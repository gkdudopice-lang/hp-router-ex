import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AxiosApi from "../api/AxiosApi";
import { saveAuth } from "../api/AxiosInstance";

// JWT Payload에서 sub 값 가져오기
const getSubFromToken = (token) => {
  const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(payload)).sub;
};

// 네이버 로그인 콜백 페이지
const NaverCallback = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const savedState = sessionStorage.getItem("naver_oauth_state");

    // 로그인 취소 또는 인가 코드 누락
    if (!code) {
      sessionStorage.removeItem("naver_oauth_state");
      alert("네이버 로그인이 취소되었습니다.");
      nav("/", { replace: true });
      return;
    }

    // state 검증
    if (!state || !savedState || state !== savedState) {
      sessionStorage.removeItem("naver_oauth_state");
      alert("네이버 로그인 인증 정보가 일치하지 않습니다.");
      nav("/", { replace: true });
      return;
    }

    // 검증이 끝났으므로 저장된 state 제거
    sessionStorage.removeItem("naver_oauth_state");

    const login = async () => {
      try {
        const { data } = await AxiosApi.naverLogin(code, state);

        // JWT 저장 및 자동 재발급 예약
        saveAuth(data);

        localStorage.setItem("email", getSubFromToken(data.accessToken));
        localStorage.setItem("isLogin", "TRUE");

        nav("/home", { replace: true });
      } catch (err) {
        alert(err.response?.data?.message ?? "네이버 로그인에 실패했습니다.");
        nav("/", { replace: true });
      }
    };

    login();
  }, [nav, searchParams]);

  return (
    <p style={{ textAlign: "center", marginTop: 100 }}>네이버 로그인 중...</p>
  );
};

export default NaverCallback;
