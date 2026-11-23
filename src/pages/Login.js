import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import Input from "../Components/common/Input";
import AxiosApi from "../api/AxiosApi";
import { saveAuth } from "../api/AxiosInstance"; // 토큰 저장 및 자동 재발급 예약

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
const KakaoBtn = styled.button`
  width: 100%;
  height: 50px;
  color: #191919;
  background-color: #fee500;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;
`;
const NaverBtn = styled.button`
  width: 100%;
  height: 50px;
  color: #ffffff;
  background-color: #03c75a;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;

  &:hover {
    background-color: #02b350;
  }
`;
const GoogleBtn = styled.button`
  width: 100%;
  height: 50px;
  color: #333333;
  background-color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  border: 1px solid #dddddd;
  border-radius: 18px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;
const SocialButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;

  button {
    flex: 1;
    min-width: 0;
  }
`;

// 카카오 인가 코드 요청 주소 (client_id = REST API 키, 공개돼도 되는 값)
const KAKAO_AUTH_URL =
  "https://kauth.kakao.com/oauth/authorize?response_type=code" +
  `&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}` +
  "&redirect_uri=" +
  encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI) +
  "&prompt=login";

// 네이버 로그인 주소
const NAVER_AUTH_URL = "https://nid.naver.com/oauth2.0/authorize";

// 네이버 로그인 시작
const naverLogin = () => {
  const state = crypto.randomUUID();

  // 콜백에서 state 검증을 위해 저장
  sessionStorage.setItem("naver_oauth_state", state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.REACT_APP_NAVER_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_NAVER_REDIRECT_URI,
    state: state,
    auth_type: "reauthenticate", // 재인증 요청
  });

  window.location.href = `${NAVER_AUTH_URL}?${params.toString()}`;
};

// 구글 로그인 주소
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// 구글 로그인 시작
const googleLogin = () => {
  const params = new URLSearchParams({
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });

  window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

const Login = () => {
  const [inputId, setInputId] = useState("");
  const [inputPwd, setInputPwd] = useState("");

  const nav = useNavigate();

  // 둘 다 입력돼야 버튼 활성화
  const isValid = inputId.trim() !== "" && inputPwd !== "";

  // form의 onSubmit으로 처리하면 Enter 키로도 로그인 가능
  const onSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    try {
      const response = await AxiosApi.memberLogin(inputId, inputPwd);

      if (response.data) {
        // JWT 저장 및 자동 재발급 예약
        saveAuth(response.data);

        // 로그인 상태 저장
        localStorage.setItem("isLogin", "TRUE");

        // 로그인 아이디 저장
        localStorage.setItem("userId", inputId);
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
          value={inputId}
          placeholder="아이디를 입력하세요"
          onChange={(e) => setInputId(e.target.value)}
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
        <SocialButtonGroup>
          <KakaoBtn
            type="button"
            onClick={() => (window.location.href = KAKAO_AUTH_URL)}
          >
            카카오 로그인
          </KakaoBtn>

          <NaverBtn type="button" onClick={naverLogin}>
            네이버 로그인
          </NaverBtn>
          <GoogleBtn type="button" onClick={googleLogin}>
            구글 로그인
          </GoogleBtn>
        </SocialButtonGroup>
        <SignupText>
          계정이 없으신가요?
          <Link to="/signup">회원가입</Link>
        </SignupText>
      </Form>
    </Container>
  );
};

export default Login;
