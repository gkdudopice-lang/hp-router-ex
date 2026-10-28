import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
`;

// 공통 Input과 같은 느낌의 여러 줄 입력창
const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 300px;
  padding: 1em;
  font-size: 15px;
  font-family: inherit;
  border: 1px solid #999;
  border-radius: 18px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: orange;
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const CancelBtn = styled.button`
  width: 100%;
  height: 50px;
  color: white;
  background-color: #999;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;
`;

const BoardWrite = () => {
  const [title, setTitle] = useState(""); //제목
  const [content, setContent] = useState(""); //내용
  const nav = useNavigate(); //페이지 이동

  // 제목, 내용 모두 입력돼야 등록 버튼 활성화
  const isValid = title.trim() !== "" && content.trim() !== "";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    //로그인 할 때 저장해 둔 이메일을 작성자로 사용
    const email = localStorage.getItem("email");
    if (!email) {
      alert("로그인이 필요합니다.");
      nav("/");
      return;
    }

    try {
      const res = await AxiosApi.boardWrite(title, content, email);
      console.log(res.data);
      if (res.data) {
        alert("게시글이 등록되었습니다.");
        nav("/board", { replace: true }); //뒤로가기로 작성 화면에 다시 오지 않도록
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    } catch (err) {
      console.log(err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Title>글쓰기</Title>
        <Input
          value={title}
          placeholder={"제목을 입력하세요"}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          value={content}
          placeholder="내용을 입력하세요"
          onChange={(e) => setContent(e.target.value)}
        />
        <BtnRow>
          <CancelBtn type="button" onClick={() => nav(-1)}>
            취소
          </CancelBtn>
          <Button type="submit" enabled={isValid}>
            등록
          </Button>
        </BtnRow>
      </Form>
    </Container>
  );
};

export default BoardWrite;
