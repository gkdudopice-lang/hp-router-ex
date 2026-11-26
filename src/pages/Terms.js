import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PRIMARY_COLOR = "#c327eb";
const PRIMARY_HOVER = "#a81cd0";

const TERMS_LIST = [
  {
    id: "service",
    required: true,
    title: "[필수] 서비스 이용약관 및 포트폴리오 데모 안내",
    content: `제1조 (목적 및 서비스 성격)
본 약관은 「갈래말래」(이하 "서비스")가 제공하는 공연·뮤지컬·연극 예매 및 AI 공연 추천 시연 서비스의 이용 조건과 절차를 안내함을 목적으로 합니다. 본 서비스는 포트폴리오 시연 및 기능 검증을 위해 운영되는 데모 환경입니다.

제2조 (테스트 결제 및 시연 환경 안내)
1. 본 서비스의 결제는 PG사 테스트(샌드박스) 환경으로 동작하며, 예매·결제 완료 및 내역 조회 기능은 정상 작동하나 실제 금액은 청구되지 않습니다.
2. 시연용 예매 내역 및 AI 추천 결과는 실제 공연 입장 효력이 없으며 실제 공연 정보와 다를 수 있습니다.
3. 회원은 회원가입 시 실제 사용 중인 주요 비밀번호 대신 테스트용 정보를 입력해야 합니다.

제3조 (서비스 변경 및 중단)
운영자는 포트폴리오 점검, 서버 유지보수, 시연 기간 종료 등의 사유로 서비스의 전부 또는 일부를 변경·초기화·중단할 수 있습니다.`,
  },
  {
    id: "privacy",
    required: true,
    title: "[필수] 개인정보 수집 및 이용 동의",
    content: `1. 수집 항목 및 이용 목적
- 회원가입 시: 이메일, 비밀번호(암호화 저장), 이름(닉네임) → 회원 식별, 로그인 인증, 마이페이지 기능 제공
- 서비스 이용 시: 예매 내역, 선택 좌석 정보, 찜 목록, AI 질문 내역 → 예매·찜 내역 조회 및 개인화 기능 시연

2. 보유 및 파기 기준
- 회원은 마이페이지 내 회원 탈퇴 기능을 통해 언제든 계정을 삭제할 수 있으며, 탈퇴 시 회원 정보 및 예매·찜 내역은 즉시 파기됩니다.
- 또한 포트폴리오 시연 기간 종료 및 서버 점검·DB 초기화 시 수집된 정보는 일괄 파기될 수 있습니다.

3. 동의 거부 권리 및 안내
이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으나, 필수 항목에 동의하지 않을 경우 회원가입 및 예매·찜 등 회원 전용 기능 이용이 제한됩니다. 시연 환경 특성상 테스트용 이메일과 비밀번호 사용을 권장합니다.`,
  },
];

const PageContainer = styled.div`
  max-width: 680px;
  margin: 64px auto;
  padding: 40px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  user-select: none;
  -webkit-user-select: none;
`;

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
`;

const SubTitle = styled.p`
  margin: 0 0 28px;
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
`;

const TermItem = styled.div`
  margin-bottom: 22px;
`;

const TermHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: ${PRIMARY_COLOR};
    cursor: pointer;
  }
`;

const ToggleButton = styled.button`
  border: none;
  background: none;
  padding: 6px 8px;
  font-size: 15px;
  color: #6b7280;
  text-decoration: underline;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: #111827;
  }
`;

const TermContentBox = styled.div`
  margin-top: 12px;
  padding: 16px 18px;
  max-height: 210px;
  overflow-y: auto;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  white-space: pre-line;
  user-select: text;
  -webkit-user-select: text;
`;

const Divider = styled.hr`
  margin: 24px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
`;

const AllCheckBox = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-radius: 10px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;

  input[type="checkbox"] {
    width: 22px;
    height: 22px;
    accent-color: ${PRIMARY_COLOR};
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

const CancelButton = styled.button`
  flex: 1;
  height: 54px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  height: 54px;
  border-radius: 10px;
  border: none;
  background-color: ${({ disabled }) => (disabled ? "#d1d5db" : PRIMARY_COLOR)};
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "#d1d5db" : PRIMARY_HOVER};
  }
`;

const TermsPage = () => {
  const navigate = useNavigate();

  const [checkedMap, setCheckedMap] = useState({
    service: false,
    privacy: false,
  });

  const [expandedMap, setExpandedMap] = useState({
    service: true,
    privacy: true,
  });

  const allChecked = TERMS_LIST.every((item) => checkedMap[item.id]);
  const requiredChecked = TERMS_LIST.filter((item) => item.required).every(
    (item) => checkedMap[item.id],
  );

  const handleAllChange = (e) => {
    const checked = e.target.checked;
    const nextState = {};
    TERMS_LIST.forEach((item) => {
      nextState[item.id] = checked;
    });
    setCheckedMap(nextState);
  };

  const handleSingleChange = (id) => (e) => {
    const checked = e.target.checked;
    setCheckedMap((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleToggleExpand = (id) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNext = () => {
    if (!requiredChecked) return;
    navigate("/signup", { state: { termsAgreed: true } });
  };

  return (
    <PageContainer>
      <Title>약관 동의</Title>
      <SubTitle>
        갈래말래 포트폴리오 데모 서비스 이용을 위해 아래 필수 약관을 확인하고
        동의해 주세요.
      </SubTitle>

      {TERMS_LIST.map((item) => (
        <TermItem key={item.id}>
          <TermHeader>
            <CheckLabel>
              <input
                type="checkbox"
                checked={checkedMap[item.id]}
                onChange={handleSingleChange(item.id)}
              />
              <span>{item.title}</span>
            </CheckLabel>
            <ToggleButton
              type="button"
              onClick={() => handleToggleExpand(item.id)}
            >
              {expandedMap[item.id] ? "접기" : "보기"}
            </ToggleButton>
          </TermHeader>

          {expandedMap[item.id] && (
            <TermContentBox>{item.content}</TermContentBox>
          )}
        </TermItem>
      ))}

      <Divider />

      <AllCheckBox>
        <input
          type="checkbox"
          checked={allChecked}
          onChange={handleAllChange}
        />
        전체 약관에 동의합니다
      </AllCheckBox>

      <ButtonGroup>
        <CancelButton type="button" onClick={() => navigate(-1)}>
          이전으로
        </CancelButton>
        <SubmitButton
          type="button"
          disabled={!requiredChecked}
          onClick={handleNext}
        >
          동의하고 회원가입 계속하기
        </SubmitButton>
      </ButtonGroup>
    </PageContainer>
  );
};

export default TermsPage;
