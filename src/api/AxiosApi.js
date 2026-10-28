import axios from "axios"; // 비동기 통신 라이브러리
import BoardDetail from "../pages/boards/BoardDetail";
const HM_DOMAIN = "http://localhost:8111";

const AxiosApi = {
  // auth controller
  // 회원 가입 여부 확인 (GET)
  memberExist: async (email) => {
    return await axios.get(HM_DOMAIN + `/auth/exists/${email}`);
  },
  // 회원 가입 (POST)
  memberSignup: async (email, pwd, name) => {
    return await axios.post(HM_DOMAIN + "/auth/signup", { email, pwd, name });
  },
  // 로그인 (POST)
  memberLogin: async (email, pwd) => {
    return await axios.post(HM_DOMAIN + "/auth/login", { email, pwd });
  },

  // board controller
  // 게시글 쓰기 (POST)
  boardWrite: async (title, content, email) => {
    return await axios.post(HM_DOMAIN + "/board/write", {
      title,
      content,
      email,
    });
  },
  // 게시글 전체 목록 조회 (GET)
  boardList: async () => {
    return await axios.get(HM_DOMAIN + "/board/list");
  },
  // 게시글 상세 조회
  boardDetail: async (id) => {
    return await axios.get(HM_DOMAIN + `/board/${id}`);
  },
  // 게시글 페이지 조회
  // 게시글 수정
  // 게시글 삭제
  // 게시슬 검색

  // comment controller
  // 댓글 쓰기
  // 댓글 목록 조회
  // 댓글 수정
  // 댓글 삭제

  // member constroller
  // 회원 목록 조회
  memberList: async () => {
    return await axios.get(HM_DOMAIN + "/member/list");
  },
  // 회원 정보 수정
  // 회원 목록 페이지 조회
  // 회원 삭제
  // 회원 상세 조회
};

export default AxiosApi;
