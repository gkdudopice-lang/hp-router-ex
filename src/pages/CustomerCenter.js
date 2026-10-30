// src/pages/mypage/CustomerCenter.js
import React from "react";
import styled from "styled-components";
import BackButton from "../Components/common/BackButton";
import kakao_btn from "../img/kakao_btn.png";

const CustomerCenter = () => {
  return (
    <Container>
      {/* 상단 헤더 영역 (공통 백버튼 + 정중앙 타이틀) */}
      <HeaderRow>
        <BackButton to="/mypage" />
        <Title>고객센터</Title>
      </HeaderRow>

      {/* 전화 상담 섹션 */}
      <SectionCard>
        <SubTitle>전화 상담</SubTitle>
        <MainContent>02 - 0000 - 0000</MainContent>
        <TimeInfo>운영시간 : 오전 9시 ~ 오후 6시 (주말/공휴일 휴무)</TimeInfo>
      </SectionCard>

      {/* 카카오톡 상담 섹션 */}
      <SectionCard>
        <SubTitle>카카오톡 1:1 문의</SubTitle>
        <MainContent>실시간 빠른 상담</MainContent>
        <TimeInfo>운영시간 : 오전 9시 ~ 오후 6시</TimeInfo>

        {/* 💡 화면 깨짐 방지를 위해 flex 박스 내부로 깔끔하게 배치한 카카오 버튼 */}
        <KakaoButton
          href="https://pf.kakao.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={kakao_btn} alt="카카오톡 1:1 문의 상담" />
          <span>카카오톡 채널 바로가기</span>
        </KakaoButton>
      </SectionCard>
    </Container>
  );
};

/* ───────── 스타일 컴포넌트 (화이트·블랙·보라 감성) ───────── */
const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 40px auto;
  padding: 30px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    border-color: #c327eb; /* 마우스 올리면 포인트 보라색 테두리 */
  }
`;

const SubTitle = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
`;

const MainContent = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 4px 0;
`;

const TimeInfo = styled.span`
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 12px;
`;

const KakaoButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fee500; /* 카카오 공식 노란색 배경 */
  color: #381e1f;
  padding: 10px 16px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  width: fit-content;
  margin-top: 4px;
  transition:
    transform 0.1s ease,
    opacity 0.2s ease;

  img {
    width: 24px;
    height: 24px;
    display: block;
  }

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.96);
  }
`;
export default CustomerCenter;
