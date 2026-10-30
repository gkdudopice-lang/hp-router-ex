import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

const MyPageMain = () => {
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
    </Container>
  );
};

export default MyPageMain;
