import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import Input from "../Components/common/Input";
import AxiosApi from "../api/AxiosApi";

// 화면 전체를 차지하고, 가운데에 로그인 박스를 배치
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  box-sizing: border-box;
  background-color: #f8f9fa; /* 홈 화면과 통일감 있는 배경색 */
`;

// 실제 로그인 영역: 최대 너비 제한 + 요소 간 간격
const Form = styled.form`
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h1`
  margin: 0 0 10px;
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #333;
`;

const SignupText = styled.p`
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #666;

  a {
    margin-left: 6px;
    color: #c327eb; /* 시안 느낌에 맞춘 깔끔한 강조 색상 (원하시면 orange로 변경 가능) */
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
`;

const Login = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");

  const nav = useNavigate();

  // 둘 다 입력돼야 버튼 활성화
  const isValid = inputEmail.trim() !== "" && inputPwd !== "";

  // form의 onSubmit으로 처리하면 Enter 키로도 로그인 가능
  const onSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    try {
      const response = await AxiosApi.memberLogin(inputEmail, inputPwd);
      console.log(response.data);

      if (response.data) {
        localStorage.setItem("isLogin", "TRUE");
        localStorage.setItem("email", inputEmail);
        nav("/", { replace: true }); // 메인 홈("/")으로 이동
      } else {
        alert("이메일 또는 비밀번호가 틀립니다.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Title>로그인</Title>
        <Input
          type="text"
          value={inputEmail}
          placeholder="아이디를 입력하세요"
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <Input
          type="password"
          value={inputPwd}
          placeholder="비밀번호를 입력하세요."
          onChange={(e) => setInputPwd(e.target.value)}
        />
        <Button type="submit" enabled={isValid}>
          로그인
        </Button>
        <SignupText>
          계정이 없으신가요?
          <Link to="/signup">회원가입</Link>
        </SignupText>
      </Form>
    </Container>
  );
};

export default Login;
