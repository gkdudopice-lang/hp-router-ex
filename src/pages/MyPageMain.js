import React, { useRef } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";

/* ───────── 스타일 컴포넌트 ───────── */
const Container = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 40px auto;
  padding: 40px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 10px 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledLink = styled(Link)`
  display: block;
  padding: 16px 20px;
  background-color: #ffffff;
  color: #1e293b;
  text-decoration: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;

  /* 💡 변형을 준 보더라인: 평소엔 은은한 테두리 */
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease-in-out;

  &:hover {
    /* 💡 마우스 올렸을 때: 연한 보라 배경(#f3e8ff)과 쨍한 #c327eb 테두리 조합! */
    background-color: #f3e8ff;
    border-color: #c327eb;
    color: #c327eb;
    transform: translateY(-2px);
  }
`;
const Button = styled.button`
  padding: 8px 12px;
  border: 1px solid #e53935;
  border-radius: 9px; /* 작은 직사각형 느낌 (각지게 하려면 0px) */
  background-color: #ffffff;
  color: #e53935;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: #fff5f5;
    border-color: #c62828;
    color: #c62828;
  }

  &:active {
    background-color: #fde8e8;
  }
`;

const MyPageMain = () => {
  const navigate = useNavigate();
  const alertShown = useRef(false);

  // 회원탈퇴
  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      "정말 회원탈퇴 하시겠습니까?\n탈퇴 시 계정 정보가 익명화되며, 다시 로그인할 수 없습니다.",
    );
    if (!confirmed) return;

    try {
      await AxiosApi.withdrawMember();

      // 토큰 및 로컬스토리지 위시리스트 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("wishlist");

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/login", { replace: true });
    } catch (error) {
      const data = error.response?.data;

      const serverMessage =
        typeof data === "string" ? data : data?.message || data?.error;

      if (serverMessage) {
        alert(serverMessage);
      } else if (
        error.response?.status === 400 ||
        error.response?.status === 409
      ) {
        alert(
          "진행 중인 예매가 있어 회원탈퇴를 할 수 없습니다.\n예매 취소 또는 공연 완료 후 다시 시도해 주세요.",
        );
      } else {
        alert(
          "회원탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    }
  };

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin !== "TRUE" && !alertShown.current) {
      alertShown.current = true;
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <Container>
      <PageTitle>마이페이지</PageTitle>

      {/* 1. 계정 관리 섹션 */}
      <Section>
        <SectionTitle>계정 관리</SectionTitle>
        <StyledLink to="/mypage/account">계정 정보</StyledLink>
        <StyledLink to="/mypage/customer-center">고객센터</StyledLink>
      </Section>

      {/* 2. 쇼핑 & 예약 내역 섹션 */}
      <Section>
        <SectionTitle>쇼핑 & 예약</SectionTitle>
        <StyledLink to="/reservation/history">예약 내역 보기</StyledLink>
        <StyledLink to="/wishlist">찜 목록 보기</StyledLink>
      </Section>

      {/* 3. 활동 관리 섹션 */}
      <Section>
        <SectionTitle>활동 관리</SectionTitle>
        <StyledLink to="/mypage/reviews">내가 쓴 리뷰</StyledLink>
      </Section>
      {/* 4. 회원탈퇴 버튼 */}
      <Button type="button" onClick={handleWithdraw}>
        회원탈퇴
      </Button>
    </Container>
  );
};

export default MyPageMain;
