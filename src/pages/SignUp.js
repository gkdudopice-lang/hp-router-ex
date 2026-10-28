import styled from "styled-components";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Components/common/Button";
import Input from "../Components/common/Input";
import AxiosApi from "../api/AxiosApi";

/* ───────── 정규식 ───────── */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PWD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
const NAME_REGEX = /^[가-힣a-zA-Z]{2,10}$/;
const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

/* ───────── 스타일 ───────── */
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 30px;
  box-sizing: border-box;
  background-color: #f8f9fa;
`;

const Form = styled.form`
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h1`
  margin: 0 0 10px;
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #333;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Message = styled.p`
  margin: 4px 8px 0;
  min-height: 18px;
  text-align: right;
  font-size: 12px;
  color: ${({ $valid }) => ($valid ? "#2e9e4f" : "#e5484d")};
`;

/* 버튼 색상을 보라색(#c327eb)으로 커스텀하기 위한 래퍼 혹은 컴포넌트 내부 수정 */
const StyledButton = styled(Button)`
  background-color: ${({ enabled }) => (enabled ? "#c327eb" : "#ccc")};
  &:hover {
    background-color: ${({ enabled }) => (enabled ? "#a81cd0" : "#ccc")};
  }
`;

const BottomText = styled.p`
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #666;

  a {
    margin-left: 6px;
    color: #c327eb;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Signup = () => {
  const [inputId, setInputId] = useState("");
  const [inputPwd, setInputPwd] = useState("");
  const [inputPwdCheck, setInputPwdCheck] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputPhone, setInputPhone] = useState("");

  const [idStatus, setIdStatus] = useState("idle");

  const nav = useNavigate();

  const isIdValid = inputId.trim() !== "";
  const isEmail = EMAIL_REGEX.test(inputEmail);
  const isPwd = PWD_REGEX.test(inputPwd);
  const isPwdCheck = inputPwdCheck !== "" && inputPwd === inputPwdCheck;
  const isName = NAME_REGEX.test(inputName);
  const isPhone = PHONE_REGEX.test(inputPhone);

  useEffect(() => {
    if (!inputId.trim()) {
      setIdStatus("idle");
      return;
    }

    setIdStatus("checking");
    let ignore = false;

    const timer = setTimeout(async () => {
      try {
        const res = await AxiosApi.memberExist(inputId);
        if (ignore) return;
        setIdStatus(res.data === true ? "duplicate" : "available");
      } catch (err) {
        if (!ignore) setIdStatus("error");
      }
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [inputId]);

  const isIdOk = inputId.trim() !== "" && idStatus === "available";
  const isAllValid =
    isIdOk && isPwd && isPwdCheck && isEmail && isName && isPhone;

  const getIdMessage = () => {
    if (!inputId) return "";
    switch (idStatus) {
      case "checking":
        return "중복 확인 중...";
      case "available":
        return "사용 가능한 아이디입니다.";
      case "duplicate":
        return "이미 사용 중인 아이디입니다.";
      case "error":
        return "중복 확인 중 오류가 발생했습니다.";
      default:
        return "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAllValid) return;

    try {
      const response = await AxiosApi.memberSignup(
        inputId,
        inputPwd,
        inputName,
        inputPhone,
        inputEmail,
      );
      console.log(response.data);
      if (response.data === true) {
        alert(`${inputName}님, 회원가입이 완료되었습니다.`);
        nav("/login", { replace: true });
      } else {
        alert("회원 가입이 실패 했습니다.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Title>회원가입</Title>

        {/* 1. 아이디 (type="text"로 변경하여 브라우저 이메일 경고창 방지) */}
        <Field>
          <Input
            type="text"
            value={inputId}
            placeholder="아이디를 입력하세요"
            onChange={(e) => setInputId(e.target.value.trim())}
          />
          <Message $valid={isIdOk}>{getIdMessage()}</Message>
        </Field>

        {/* 2. 비밀번호 */}
        <Field>
          <Input
            type="password"
            value={inputPwd}
            placeholder="비밀번호를 입력하세요."
            onChange={(e) => setInputPwd(e.target.value)}
          />
          <Message $valid={isPwd}>
            {inputPwd &&
              (isPwd
                ? "사용 가능한 비밀번호입니다."
                : "영문, 숫자, 특수문자 포함 8~20자로 입력하세요.")}
          </Message>
        </Field>

        {/* 3. 비밀번호 재확인 */}
        <Field>
          <Input
            type="password"
            value={inputPwdCheck}
            placeholder="비밀번호 재확인"
            onChange={(e) => setInputPwdCheck(e.target.value)}
          />
          <Message $valid={isPwdCheck}>
            {inputPwdCheck &&
              (isPwdCheck
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다.")}
          </Message>
        </Field>

        {/* 4. 이메일 */}
        <Field>
          <Input
            type="email"
            value={inputEmail}
            placeholder="이메일을 입력하세요"
            onChange={(e) => setInputEmail(e.target.value.trim())}
          />
          <Message $valid={isEmail}>
            {inputEmail &&
              (isEmail
                ? "올바른 이메일 형식입니다."
                : "이메일 형식이 올바르지 않습니다.")}
          </Message>
        </Field>

        {/* 5. 이름 */}
        <Field>
          <Input
            value={inputName}
            placeholder="이름을 입력하세요"
            onChange={(e) => setInputName(e.target.value.trim())}
          />
          <Message $valid={isName}>
            {inputName &&
              (isName
                ? "사용 가능한 이름입니다."
                : "한글 또는 영문 2~10자로 입력하세요.")}
          </Message>
        </Field>

        {/* 6. 연락처 */}
        <Field>
          <Input
            value={inputPhone}
            placeholder="연락처를 입력하세요 ex) 010-0000-0000"
            onChange={(e) => setInputPhone(e.target.value.trim())}
          />
          <Message $valid={isPhone}>
            {inputPhone &&
              (isPhone
                ? "올바른 연락처 형식입니다."
                : "휴대폰 번호 형식(- 포함)을 확인하세요.")}
          </Message>
        </Field>

        {/* 보라색(#c327eb)이 적용된 버튼 */}
        <StyledButton type="submit" enabled={isAllValid}>
          가입하기
        </StyledButton>

        <BottomText>
          이미 계정이 있으신가요?
          <Link to="/login">로그인</Link>
        </BottomText>
      </Form>
    </Container>
  );
};

export default Signup;
