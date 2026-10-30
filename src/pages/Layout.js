import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import Input from "../Components/common/Input";
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
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 350px; // 검색바 전체 영역의 크기 (원하시는 만큼 조절 가능)

  /* 1. 인풋창은 남은 공간을 길게 채우도록 설정 */
  input {
    flex: 1;
  }

  /* 2. 돋보기 버튼은 크기가 찌그러지지 않게 고정 */
  button {
    width: 60px;
    flex-shrink: 0;
  }
`;

const SearchButton = styled.button`
  width: 50px;
  height: 40px;
  background-color: white; // 원하시는 색상 (예: 다크그레이)
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: lightgray; // 마우스 올렸을 때 색상
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

  /* 찜과 마이페이지 색상을 다르게 주고 싶을 때 지정 */
  .wish-link {
    color: #ff4757;
  }

  .mypage-link {
    color: blue;
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

const Layout = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearchSubmit = () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    alert(`검색어 "${searchKeyword}"(으)로 검색합니다.`);
  };

  return (
    <Container>
      {/* 공통 헤더 영역 */}
      <Header>
        <Logo onClick={() => navigate("/")}>
          <img src={logoImg} alt="로고" style={{ height: "40px" }} />
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
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
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
};

export default Layout;
