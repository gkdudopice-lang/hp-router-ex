import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button"; // 공통 버튼 컴포넌트 (폼 등 다른 곳에서 사용)
import Input from "../Components/common/Input"; // 공통 인풋 컴포넌트
import logoImg from "../img/사이트 로고.png";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  cursor: pointer;

  img {
    height: 40px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 350px;

  input {
    flex: 1;
  }
`;

const SearchButton = styled.button`
  width: 50px;
  height: 40px;
  background-color: white;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: lightgray;
  }
`;

const MenuNav = styled.nav`
  display: flex;
  gap: 15px;
  align-items: center;

  a {
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    color: #555;

    &:hover {
      color: #000;
    }
  }

  .wish-link {
    color: #ff4757;
  }

  .mypage-link {
    color: blue;
  }

  .user-greeting {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  /* 헤더 전용 로그아웃 버튼 스타일 (공통 버튼 컴포넌트와 분리) */
  .logout-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer`
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 20px 40px;
  text-align: center;
  font-size: 13px;
  color: #666;
`;

export default function Layout() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  // 1. 로그인 상태 및 사용자 아이디 상태 관리
  const [isLogIn, setIsLogIn] = useState(false);
  const [userId, setUserId] = useState("");

  // 2. 컴포넌트 마운트 시 로컬스토리지 확인
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");

    if (savedUserId) {
      setIsLogIn(true);
      setUserId(savedUserId);
    }
  }, []);

  // 3. 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem("isLogin");

    setIsLogIn(false);
    setUserId("");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleSearchSubmit = () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    navigate(`/search?keyword=${searchKeyword}`);
  };

  return (
    <Container>
      {/* 공통 헤더 영역 */}
      <Header>
        <Logo onClick={() => navigate("/")}>
          <img src={logoImg} alt="로고" />
        </Logo>

        <SearchBox>
          <Input
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <SearchButton onClick={handleSearchSubmit}>🔍</SearchButton>
        </SearchBox>

        <MenuNav>
          <Link to="/wishlist" className="wish-link">
            찜
          </Link>

          {/* 4. 로그인 상태에 따른 조건부 렌더링 */}
          {isLogIn ? (
            <>
              <span className="user-greeting">{userId}님</span>
              <button onClick={handleLogout} className="logout-btn">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}

          <Link to="/mypage" className="mypage-link">
            MY PAGE
          </Link>
        </MenuNav>
      </Header>

      {/* 페이지별 내용이 렌더링되는 Main 영역 (Outlet) */}
      <Main>
        <Outlet />
      </Main>

      {/* 공통 푸터 영역 */}
      <Footer>
        <p>
          회사명: (주)HP사이트 | 대표전화: 02-000-0000 | 주소: 서울특별시 강남구
          테헤란로 123
        </p>
      </Footer>
    </Container>
  );
}
