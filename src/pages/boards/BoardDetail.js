import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px;
`;

const Card = styled.article`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  color: #888;
`;

// 줄바꿈(\n)을 그대로 보여주기 위해 pre-wrap 사용
const Content = styled.p`
  margin: 0;
  min-height: 200px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const BackBtn = styled.button`
  margin-top: 16px;
  padding: 10px 18px;
  background-color: #999;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;
`;

const BoardDetail = () => {
  const { boardId } = useParams(); // 페이지 이동 시 정보 전달
  const [board, setBoard] = useState();
  const nav = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await AxiosApi.boardDetail(boardId);
        console.log(res.data);
        setBoard(res.data);
      } catch (err) {
        console.error(err);
        alert("게시글을 불러오지 못했습니다.");
        nav("/board");
      }
    };
    fetchDetail();
  }, [boardId, nav]);

  if (!board) return <Container>불러오는 중...</Container>;

  return (
    <Container>
      <Card>
        <Title>{board.title}</Title>
        <Meta>
          <span>{board.name || board.email}</span>
          <span>{board.regDate?.substring(0, 10)}</span>
        </Meta>
        <Content>{board.content}</Content>
      </Card>
      <BackBtn onClick={() => nav("/board")}>목록으로</BackBtn>
    </Container>
  );
};

export default BoardDetail;
