import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AxiosApi from "../api/AxiosApi";
import { saveAuth } from "../api/AxiosInstance";

// 토큰 Payload(Base64URL)를 디코딩해 sub 꺼내기
const getSubFromToken = (token) => {
  const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(payload)).sub;
};

// 구글이 http://localhost:3000/oauth/google 로 돌려보내는 페이지
const GoogleCallback = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");

    if (!code) {
      alert("구글 로그인이 취소되었습니다.");
      nav("/", { replace: true });
      return;
    }

    const login = async () => {
      try {
        const { data } = await AxiosApi.googleLogin(code);

        // 토큰 저장 및 자동 재발급 예약
        saveAuth(data);

        // 기존 카카오 로그인과 동일한 방식으로 사용자 정보 저장
        localStorage.setItem("email", getSubFromToken(data.accessToken));
        localStorage.setItem("isLogin", "TRUE");

        nav("/home", { replace: true });
      } catch (err) {
        alert(err.response?.data?.message ?? "구글 로그인에 실패했습니다.");
        nav("/", { replace: true });
      }
    };

    login();
  }, [nav, searchParams]);

  return (
    <p style={{ textAlign: "center", marginTop: 100 }}>구글 로그인 중...</p>
  );
};

export default GoogleCallback;
