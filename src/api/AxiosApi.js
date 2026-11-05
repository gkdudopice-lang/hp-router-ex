import axios from "axios";

const HM_DOMAIN = "http://localhost:8111";

const AxiosApi = {
  // 회원 관련
  memberExist: async (email) => axios.get(HM_DOMAIN + `/auth/exists/${email}`),

  memberSignup: async (email, pwd, name) =>
    axios.post(HM_DOMAIN + "/auth/signup", {
      email,
      pwd,
      name,
    }),

  memberLogin: async (email, pwd) =>
    axios.post(HM_DOMAIN + "/auth/login", {
      email,
      pwd,
    }),

  // 게시판 관련
  boardWrite: async (title, content, email) =>
    axios.post(HM_DOMAIN + "/board/write", {
      title,
      content,
      email,
    }),

  boardList: async () => axios.get(HM_DOMAIN + "/board/list"),

  boardDetail: async (id) => axios.get(HM_DOMAIN + `/board/${id}`),

  memberList: async () => axios.get(HM_DOMAIN + "/member/list"),

  // 예매 생성
  createReservation: async (reservationData) =>
    axios.post(HM_DOMAIN + "/reservations", reservationData),
  // 예매 상세 조회
  getReservation: async (reservationId) =>
    axios.get(HM_DOMAIN + `/reservations/${reservationId}`),

  // 공연 회차 관련
  getSchedules: async (concertId) =>
    axios.get(HM_DOMAIN + `/concerts/${concertId}/schedules`),
  //공연 회차 등록
  createSchedule: async (concertId, scheduleData) =>
    axios.post(HM_DOMAIN + `/concerts/${concertId}/schedules`, scheduleData),

  // 좌석 관련
  createSeats: async (scheduleId, seatNumbers) =>
    axios.post(HM_DOMAIN + `/seats/demo/${scheduleId}`, seatNumbers),
  // 회차별 잔여 좌석 수 조회
  getRemainingSeats: async (scheduleId) =>
    axios.get(HM_DOMAIN + `/seats/${scheduleId}/remaining`),
  //회차별 좌석 목록조회
  getSeats: async (scheduleId) => axios.get(HM_DOMAIN + `/seats/${scheduleId}`),

  // 💡 [추가] ReservationDetail.js 에러를 해결하기 위한 별칭 함수 추가
  getReservationDetail: async (reservationId) =>
    axios.get(HM_DOMAIN + `/reservations/${reservationId}`),

  // 💡 [추가] 콘서트(상품) 상세 정보 조회
  getConcertDetail: async (concertId) =>
    axios.get(HM_DOMAIN + `/concerts/${concertId}`),

  // 💡 [추가] 전체 콘서트 목록 조회 (AllConcertMenu.js 에러 해결용)
  getAllConcerts: async () => axios.get(HM_DOMAIN + "/concerts"),
};

export default AxiosApi;
