// src/pages/mypage/AccountInfo.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BackButton from "../Components/common/BackButton";

const AccountInfo = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    userId: "test_user",
    email: "test@example.com",
    name: "홍길동",
    phone: "010-1234-5678",
  });

  const [loading, setLoading] = useState(false); // 임시로 로딩 false 처리

  /* 백엔드 API 연동 부 (추후 백엔드 준비되면 주석 해제)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error("유저 정보를 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
  */

  if (loading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderRow>
        <BackButton to="/mypage" />
        <Title>계정 정보</Title>
      </HeaderRow>

      <Box>
        <Row>
          <Label>아이디</Label>
          <Value>{userInfo.userId}</Value>
        </Row>

        <Row>
          <Label>이메일</Label>
          <Value>{userInfo.email}</Value>
        </Row>

        <Row>
          <Label>이름</Label>
          <ValueGroup>
            <span>{userInfo.name}</span>
            <ActionButton onClick={() => alert("이름 변경 클릭")}>
              변경
            </ActionButton>
          </ValueGroup>
        </Row>

        <Row>
          <Label>휴대폰 번호</Label>
          <ValueGroup>
            <span>{userInfo.phone}</span>
            <ActionButton onClick={() => alert("휴대폰 번호 변경 클릭")}>
              변경
            </ActionButton>
          </ValueGroup>
        </Row>

        {/* 💡 $clickable 로 수정하여 경고 해결 */}
        <Row $clickable onClick={() => navigate("/profile/address")}>
          <Label>배송지 관리</Label>
          <ArrowButton>&gt;</ArrowButton>
        </Row>

        <Row $clickable onClick={() => navigate("/identity-verification")}>
          <Label>본인 인증</Label>
          <ArrowButton>&gt;</ArrowButton>
        </Row>

        <Row $clickable onClick={() => navigate("/mypage/payment")}>
          <Label>결제수단 관리</Label>
          <ArrowButton>&gt;</ArrowButton>
        </Row>
      </Box>
    </Container>
  );
};

/* ───────── 스타일 컴포넌트 ───────── */
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
  /* 💡 DOM으로 전달되지 않도록 $clickable 사용 */
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${(props) =>
      props.$clickable ? "#f8f9fa" : "transparent"};
    border-color: ${(props) => (props.$clickable ? "#c327eb" : "#f1f5f9")};
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
  color: #c327eb;
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
