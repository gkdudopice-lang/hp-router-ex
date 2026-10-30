// src/pages/mypage/AccountInfo.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BackButton from "../Components/common/BackButton";

const AccountInfo = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    userId: "",
    email: "",
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  // 사용자 정보를 불러오는 API 연동 (기존 팀원 코드 유지)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            userId: data.userId,
            email: data.email,
            name: data.name,
            phone: data.phone,
          });
        }
      } catch (error) {
        console.error("유저 정보를 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      {/* 💡 상단 헤더 영역 (공통 백버튼 + 정중앙 타이틀) */}
      <HeaderRow>
        <BackButton to="/mypage" />
        <Title>계정 정보</Title>
      </HeaderRow>

      <Box>
        {/* 아이디 */}
        <Row>
          <Label>아이디</Label>
          <Value>{userInfo.userId}</Value>
        </Row>

        {/* 이메일 */}
        <Row>
          <Label>이메일</Label>
          <Value>{userInfo.email}</Value>
        </Row>

        {/* 이름 */}
        <Row>
          <Label>이름</Label>
          <ValueGroup>
            <span>{userInfo.name}</span>
            <ActionButton onClick={() => alert("이름 변경 클릭")}>
              변경
            </ActionButton>
          </ValueGroup>
        </Row>

        {/* 휴대폰 번호 */}
        <Row>
          <Label>휴대폰 번호</Label>
          <ValueGroup>
            <span>{userInfo.phone}</span>
            <ActionButton onClick={() => alert("휴대폰 번호 변경 클릭")}>
              변경
            </ActionButton>
          </ValueGroup>
        </Row>

        {/* 배송지 관리 (클릭 시 주소 관리 페이지로 이동) */}
        <Row clickable onClick={() => navigate("/profile/address")}>
          <Label>배송지 관리</Label>
          <ArrowButton>&gt;</ArrowButton>
        </Row>

        {/* 본인 인증 */}
        <Row clickable onClick={() => navigate("/identity-verification")}>
          <Label>본인 인증</Label>
          <ArrowButton>&gt;</ArrowButton>
        </Row>

        {/* 결제수단 관리 */}
        <Row clickable onClick={() => navigate("/payment")}>
          <Label>결제수단 관리</Label>
          <ArrowButton>&gt;</ArrowButton>
        </Row>
      </Box>
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

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-size: 15px;
`;

const Box = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${(props) =>
      props.clickable ? "#f8f9fa" : "transparent"};
    border-color: ${(props) => (props.clickable ? "#c327eb" : "#f1f5f9")};
  }
`;

const Label = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
`;

const Value = styled.span`
  font-size: 15px;
  color: #64748b;
`;

const ValueGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #64748b;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #c327eb; /* 포인트 보라색 적용 */
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 0;

  &:hover {
    color: #9333ea;
  }
`;

const ArrowButton = styled.span`
  font-size: 18px;
  color: #94a3b8;
  font-weight: bold;
`;

export default AccountInfo;
