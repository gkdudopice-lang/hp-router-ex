import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import AnswerView from "./AnswerView";
import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 30px 20px 100px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin: -16px 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputArea = styled.div`
  width: 100%;
`;

const QuestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin: 0;
`;

const AiAssistant = () => {
  const nav = useNavigate();

  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const onAsk = async (e) => {
    e.preventDefault();

    if (!question.trim() || loading) return;

    setLoading(true);

    try {
      const { data } = await AxiosApi.ragChat(question, "all");

      setResults((prev) => [{ question, result: data }, ...prev]);
      setQuestion("");
    } catch (err) {
      alert(err.response?.data?.message ?? "질문 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>콘서트 AI 도우미</Title>

      <Description>궁금한 콘서트 정보를 편하게 질문해 보세요.</Description>

      <Form onSubmit={onAsk}>
        <QuestionSection>
          <SectionTitle>질문하기</SectionTitle>

          <InputArea>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 500))}
              placeholder="콘서트에 대해 물어보세요."
            />
          </InputArea>
        </QuestionSection>

        <Button type="submit" enabled={!loading && Boolean(question.trim())}>
          {loading ? "찾는 중..." : "질문하기"}
        </Button>
      </Form>

      {results.length > 0 && (
        <QuestionSection>
          <SectionTitle>AI 답변</SectionTitle>

          {results.map((r, i) => (
            <AnswerView
              key={i}
              question={r.question}
              result={r.result}
              onOpenBoard={(id) => nav(`/board/${id}`)}
            />
          ))}
        </QuestionSection>
      )}
    </Container>
  );
};

export default AiAssistant;
