import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

// 전체 페이지
const FailContainer = styled.div`
  width: 100%;
  min-height: 650px;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 60px 20px;
  box-sizing: border-box;

  background-color: #f8f9fa;
`;

// 결제 실패 카드
const FailBox = styled.div`
  width: 850px;
  max-width: 100%;
  min-height: 600px;

  padding: 70px 80px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #ffffff;
  border-radius: 20px;

  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);

  @media (max-width: 600px) {
    padding: 40px 25px;
    min-height: auto;
  }
`;

// 에러 이미지
const FailImage = styled.img`
  display: block;
  width: 120px;
  margin-bottom: 25px;
`;

// 제목
const FailTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #333333;

  margin: 0 0 40px;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

// 에러 정보 영역
const FailInfo = styled.div`
  width: 100%;

  padding: 35px;
  box-sizing: border-box;

  background-color: #f8f9fa;
  border-radius: 12px;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

// 에러 메시지와 에러 코드
const FailInfoItem = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  b {
    display: block;
    margin-bottom: 10px;

    font-size: 20px;
    color: #333333;
  }

  p {
    margin: 0;

    font-size: 18px;
    line-height: 1.6;

    color: #666666;
    word-break: break-word;
  }
`;

// 메인으로 돌아가기 링크
const FailHomeLink = styled(Link)`
  display: block;
  width: 100%;

  margin-top: 40px;

  text-decoration: none;
`;

// 메인으로 돌아가기 버튼
const FailHomeButton = styled.button`
  width: 100%;

  padding: 18px;

  border: none;
  border-radius: 10px;

  background-color: #3182f6;
  color: #ffffff;

  font-size: 20px;
  font-weight: bold;

  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: #a81cd0;
  }
`;

// 결제 실패 페이지
export function FailPage() {
  const [searchParams] = useSearchParams();

  const message =
    searchParams.get("message") || "결제가 취소되었거나 실패했습니다.";

  const code = searchParams.get("code") || "결제 오류";

  return (
    <FailContainer>
      <FailBox>
        <FailImage
          src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
          alt="에러 이미지"
        />

        <FailTitle>결제를 실패했어요</FailTitle>

        <FailInfo>
          <FailInfoItem>
            <b>에러메시지</b>
            <p>{message}</p>
          </FailInfoItem>

          <FailInfoItem>
            <b>에러코드</b>
            <p>{code}</p>
          </FailInfoItem>
        </FailInfo>

        <FailHomeLink to="/">
          <FailHomeButton type="button">메인으로 돌아가기</FailHomeButton>
        </FailHomeLink>
      </FailBox>
    </FailContainer>
  );
}
