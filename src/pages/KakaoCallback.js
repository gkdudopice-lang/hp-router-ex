import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AxiosApi from "../api/AxiosApi";

// 토큰 Payload(Base64URL)를 디코딩해 sub(이메일 대체값) 꺼내기
const getSubFromToken = (token) => {
  const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(payload)).sub;
};

// 카카오가 http://localhost:3000/oauth/kakao?code=... 로 돌려보내는 페이지
const KakaoCallback = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const called = useRef(false); // 인가 코드는 1회용 → StrictMode 이중 실행 방지

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    if (!code) {
      // 사용자가 동의 화면에서 취소하면 ?error=access_denied 로 돌아옴
      alert("카카오 로그인이 취소되었습니다.");
      nav("/", { replace: true });
      return;
    }

    const login = async () => {
      try {
        const { data } = await AxiosApi.kakaoLogin(code);
        // 일반 로그인과 같은 TokenDto → 같은 방식으로 저장
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("email", getSubFromToken(data.accessToken)); // kakao_회원번호
        localStorage.setItem("isLogin", "TRUE");
        nav("/home", { replace: true });
      } catch (err) {
        alert(err.response?.data?.message ?? "카카오 로그인에 실패했습니다.");
        nav("/", { replace: true });
      }
    };
    login();
  }, [nav, searchParams]);

  return (
    <p style={{ textAlign: "center", marginTop: 100 }}>카카오 로그인 중...</p>
  );
};

export default KakaoCallback;
