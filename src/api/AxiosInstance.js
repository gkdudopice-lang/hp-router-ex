import axios from "axios"; // 비동기 통신 라이브러리
export const HM_DOMAIN = "http://localhost:8111";

// 토큰을 자동으로 붙이고, 만료되면 재발급 처리하는 axios 인스턴스
const AxiosInstance = axios.create({ baseURL: HM_DOMAIN });

// 로그아웃 / 재발급 실패 시 저장된 값 정리
export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// 1. 요청 인터셉터: 모든 요청에 Access 토큰 자동 첨부
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 동시에 여러 요청이 401을 받아도 재발급은 한 번만
let reissuePromise = null;

// 2. 응답 인터셉터: 401 -> 재발급 -> 원래 요청 재시도
AxiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const url = original?.url ?? "";
    // 로그인·재발급 요청 자체의 401은 그대로 실패 처리
    const isAuthCall =
      url.includes("/auth/login") || url.includes("/auth/reissue");

    if (err.response?.status !== 401 || isAuthCall || original._retry) {
      return Promise.reject(err);
    }
    console.log("401 Unauthorized 발생, 토큰 재발급 시도:", original.url);
    original._retry = true; // 무한 재시도 방지

    try {
      if (!reissuePromise) {
        const refreshToken = localStorage.getItem("refreshToken");
        // AxiosInstance가 아니라 axios로 호출 (인터셉터 재진입 방지)
        reissuePromise = axios
          .post(`${HM_DOMAIN}/auth/reissue`, { refreshToken })
          .finally(() => {
            reissuePromise = null;
          });
      }
      const { data } = await reissuePromise;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken); // Rotation: 새 값으로 교체
      console.log("토큰 재발급 성공:", data);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return AxiosInstance(original); // 원래 요청 재시도
    } catch (e) {
      // Refresh 만료 · 재사용 감지 · 강제 만료 → 다시 로그인
      clearAuth();
      alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
      window.location.href = "/"; // 로그인 페이지
      return Promise.reject(e);
    }
  },
);

export default AxiosInstance;
