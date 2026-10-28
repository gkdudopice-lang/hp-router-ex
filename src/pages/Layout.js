import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.header`
  height: 40px;
  background-color: lightblue;
`;

const Main = styled.main`
  flex: 1;
  background-color: bisque;
`;

const Footer = styled.footer`
  height: 40px;
  background-color: orange;
`;

const Layout = () => {
  return (
    <Container>
      <Header>여기는 헤더 영역 입니다.</Header>
      <Main>
        <Outlet />
      </Main>
      <Footer>여기는 풋터 영역 입니다.</Footer>
    </Container>
  );
};

export default Layout;
