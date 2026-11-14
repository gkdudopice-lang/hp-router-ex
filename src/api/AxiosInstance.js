import axios from "axios";

export const HM_DOMAIN = "http://localhost:8111";
export const WS_URL = "ws://localhost:8111";

const AxiosInstance = axios.create({ baseURL: HM_DOMAIN });

// 자동 재발급 타이머
let reissueTimer = null;

// 같은 탭 안에서 중복 재발급 방지
let reissuePromise = null;

// 여러 탭에서 재발급 중복 방지용 잠금 이름
const REISSUE_LOCK = "auth-reissue-lock";

// 로그아웃 / 인증 정보 정리
export const clearAuth = () => {
  if (reissueTimer) {
    clearTimeout(reissueTimer);
    reissueTimer = null;
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessTokenExpiresAt");
};

// 새 토큰 저장 및 자동 재발급 예약
export const saveAuth = (data) => {
  const hasPreviousToken = !!localStorage.getItem("accessToken");

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  // 서버에서 받은 Access Token 만료 시각
  localStorage.setItem("accessTokenExpiresAt", data.accessTokenExpiresIn);

  // 로그 출력
  console.log(hasPreviousToken ? "🔄 토큰 재발급 성공" : "🔐 로그인 토큰 저장");

  console.log(
    "새 Access Token 만료까지 남은 시간:",
    Math.round((data.accessTokenExpiresIn - Date.now()) / 1000),
    "초",
  );

  // 자동 재발급 예약
  scheduleAutoReissue(data.accessTokenExpiresIn);
};

// 만료 10초 전에 자동 재발급 예약
export const scheduleAutoReissue = (expiresAt) => {
  if (reissueTimer) {
    clearTimeout(reissueTimer);
  }

  if (!expiresAt || !localStorage.getItem("refreshToken")) {
    return;
  }

  const delay = Math.max(Number(expiresAt) - Date.now() - 10000, 0);

  reissueTimer = setTimeout(() => {
    console.log("⏰ Access Token 만료 임박! 자동 재발급 시작");
    reissueWithLock().catch((error) => {
      console.error("자동 토큰 재발급 실패:", error);

      // 일시적인 네트워크 오류라면 잠시 후 다시 시도
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        reissueTimer = setTimeout(() => {
          reissueWithLock().catch(console.error);
        }, 5000);
      } else {
        clearAuth();
        alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
        window.location.href = "/";
      }
    });
  }, delay);
};

// 토큰 재발급 요청
const requestReissue = async (previousAccessToken) => {
  // 다른 탭에서 이미 갱신했다면 새 토큰 사용
  const currentAccessToken = localStorage.getItem("accessToken");

  if (previousAccessToken && currentAccessToken !== previousAccessToken) {
    return {
      accessToken: currentAccessToken,
    };
  }

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh Token이 없습니다.");
  }

  const { data } = await axios.post(`${HM_DOMAIN}/auth/reissue`, {
    refreshToken,
  });

  saveAuth(data);

  return data;
};

// 여러 탭에서 재발급이 겹치지 않도록 잠금
const reissueWithLock = async () => {
  if (reissuePromise) {
    return reissuePromise;
  }

  const previousAccessToken = localStorage.getItem("accessToken");

  const execute = async () => {
    return requestReissue(previousAccessToken);
  };

  if (navigator.locks?.request) {
    reissuePromise = navigator.locks
      .request(REISSUE_LOCK, execute)
      .finally(() => {
        reissuePromise = null;
      });
  } else {
    // Web Locks 미지원 브라우저에서는 현재 탭 내부에서만 중복 방지
    reissuePromise = execute().finally(() => {
      reissuePromise = null;
    });
  }

  return reissuePromise;
};

// 다른 탭에서 토큰이 갱신되면 현재 탭도 타이머 갱신
window.addEventListener("storage", (event) => {
  if (event.key === "accessTokenExpiresAt") {
    if (event.newValue) {
      scheduleAutoReissue(event.newValue);
    } else if (reissueTimer) {
      clearTimeout(reissueTimer);
      reissueTimer = null;
    }
  }
});

// 페이지 새로고침 후에도 자동 재발급 타이머 복구
const savedExpiry = localStorage.getItem("accessTokenExpiresAt");

if (savedExpiry && localStorage.getItem("refreshToken")) {
  scheduleAutoReissue(savedExpiry);
}

// 기존 요청 인터셉터
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 기존 401 자동 재발급 기능 유지
AxiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const url = original?.url ?? "";

    const isAuthCall =
      url.includes("/auth/login") ||
      url.includes("/auth/kakao") ||
      url.includes("/auth/reissue");

    if (
      err.response?.status !== 401 ||
      isAuthCall ||
      !original ||
      original._retry
    ) {
      return Promise.reject(err);
    }

    original._retry = true;

    try {
      const data = await reissueWithLock();

      original.headers.Authorization = `Bearer ${data.accessToken}`;

      return AxiosInstance(original);
    } catch (e) {
      clearAuth();
      alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
      window.location.href = "/";

      return Promise.reject(e);
    }
  },
);

export default AxiosInstance;
