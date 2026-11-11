import AxiosInstance from "./AxiosInstance";

const AxiosApi = {
  // 회원 관련

  // 아이디 중복 확인
  // 아이디 중복 확인 (GET)
  memberExist: async (userId) => {
    return await AxiosInstance.get(`/auth/exists/id/${userId}`);
  },

  // 이메일 중복 확인
  emailExist: async (email) => {
    return await AxiosInstance.get(`/auth/exists/${email}`);
  },

  // 회원 가입 (POST)
  memberSignup: (userId, pwd, name, phone, email) => {
    return AxiosInstance.post("/auth/signup", {
      userId: userId,
      pwd: pwd,
      name: name,
      phone: phone,
      email: email,
    });
  },
  memberLogin: async (userId, pwd) => {
    return await AxiosInstance.post("/auth/login", {
      userId,
      pwd,
    });
  },

  // 마이페이지 회원정보 조회
  getMypage: (memberId) => AxiosInstance.get(`/auth/mypage/${memberId}`),

  // 게시판 관련
  boardWrite: async (title, content, email) =>
    AxiosInstance.post("/board/write", {
      title,
      content,
      email,
    }),

  boardList: async () => AxiosInstance.get("/board/list"),

  boardDetail: async (id) => AxiosInstance.get(`/board/${id}`),

  memberList: async () => AxiosInstance.get("/member/list"),

  // 예매 생성
  createReservation: async (reservationData) =>
    AxiosInstance.post("/reservations", reservationData),
  // 예매 상세 조회
  getReservation: async (reservationId) =>
    AxiosInstance.get(`/reservations/${reservationId}`),

  // 공연 회차 관련
  getSchedules: async (concertId) =>
    AxiosInstance.get(`/concerts/${concertId}/schedules`),
  //공연 회차 등록
  createSchedule: async (concertId, scheduleData) =>
    AxiosInstance.post(`/concerts/${concertId}/schedules`, scheduleData),

  // 좌석 관련
  createSeats: async (scheduleId, seatNumbers) =>
    AxiosInstance.post(`/seats/demo/${scheduleId}`, seatNumbers),
  // 회차별 잔여 좌석 수 조회
  getRemainingSeats: async (scheduleId) =>
    AxiosInstance.get(`/seats/${scheduleId}/remaining`),
  //회차별 좌석 목록조회
  getSeats: async (scheduleId) => AxiosInstance.get(`/seats/${scheduleId}`),

  // 💡 [추가] ReservationDetail.js 에러를 해결하기 위한 별칭 함수 추가
  getReservationDetail: async (reservationId) =>
    AxiosInstance.get(`/reservations/${reservationId}`),

  // 💡 [추가] 콘서트(상품) 상세 정보 조회
  getConcertDetail: async (concertId) =>
    AxiosInstance.get(`/concerts/${concertId}`),

  // 💡 [추가] 전체 콘서트 목록 조회 (AllConcertMenu.js 에러 해결용)
  getAllConcerts: async () => AxiosInstance.get("/concerts"),
};

export default AxiosApi;
