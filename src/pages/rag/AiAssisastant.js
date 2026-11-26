import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import AnswerView from "./AnswerView";

const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Form = styled.form`
  display: flex;
  gap: 8px;
`;
const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
`;
const Select = styled.select`
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
`;
const AskBtn = styled.button`
  padding: 0 18px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.disabled ? "#a5b4fc" : "#4f46e5")};
  color: white;
  font-weight: 600;
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
`;

const AiAssistant = () => {
  const nav = useNavigate();
  const [question, setQuestion] = useState("");
  const [scope, setScope] = useState("all"); // all | mine
  const [results, setResults] = useState([]); // 최근 질문이 위로
  const [loading, setLoading] = useState(false);

  const onAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    try {
      const { data } = await AxiosApi.ragChat(question, scope);
      setResults((prev) => [{ question, result: data }, ...prev]);
      setQuestion("");
    } catch (err) {
      // 서버의 ErrorResponse 메시지 그대로 (502: "AI 서비스에 연결할 수 없습니다.")
      alert(err.response?.data?.message ?? "질문 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 style={{ margin: 0 }}>콘서트 AI 도우미</h2>
      <Form onSubmit={onAsk}>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="콘서트에 대해 물어보세요 (예: 콘서트는 어디서 하나요?)"
          maxLength={500}
        />
        <Select value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="all">전체 글</option>
          <option value="mine">내 글만</option>
        </Select>
        <AskBtn type="submit" disabled={loading || !question.trim()}>
          {loading ? "찾는 중..." : "질문"}
        </AskBtn>
      </Form>
      {results.map((r, i) => (
        <AnswerView
          key={i}
          question={r.question}
          result={r.result}
          onOpenBoard={(id) => nav(`/board/${id}`)} // 기존 게시글 상세로 이동
        />
      ))}
    </Container>
  );
};

export default AiAssistant;
