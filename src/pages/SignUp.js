import React, { useState } from "react";
import styled from "styled-components";
import Button from "./Components/common/Button";
import Input from "./components/common/Input";

// 1. 레이아웃 스타일
const Container = styled.div`
  width: 450px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 2. 인풋창 명부 (fields 배열)
const fields = [
  {
    label: "이메일",
    type: "email",
    name: "email",
    placeholder: "example@email.com",
  },
  {
    label: "비밀번호",
    type: "password",
    name: "password",
    placeholder: "비밀번호 입력 (6자 이상)",
  },
  {
    label: "비밀번호 확인",
    type: "password",
    name: "confirmPassword",
    placeholder: "비밀번호 확인",
  },
  { label: "이름", type: "text", name: "name", placeholder: "이름 입력" },
  {
    label: "전화번호",
    type: "text",
    name: "phone",
    placeholder: "010-0000-0000",
  },
];

const SignUp = () => {
  // 3. 입력값과 에러를 관리하는 상태
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // 4. 타이핑할 때마다 값 갱신
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 5. 초기화 버튼
  const handleReset = () => {
    setForm({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
    });
    setErrors({});
  };

  // 6. 가입하기 제출 및 간단한 유효성 검사
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // 간단한 필수 입력 및 비밀번호 일치 검사 예시
    if (!form.email) newErrors.email = "이메일을 입력해주세요.";
    if (!form.password) newErrors.password = "비밀번호를 입력해주세요.";
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    if (!form.name) newErrors.name = "이름을 입력해주세요.";
    if (!form.phone) newErrors.phone = "전화번호를 입력해주세요.";

    setErrors(newErrors);

    // 에러가 하나도 없다면 성공!
    if (Object.keys(newErrors).length === 0) {
      alert("회원가입이 성공적으로 완료되었습니다! 🎉");
    }
  };

  return (
    <Container>
      <Title>회원가입</Title>

      <Form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            error={errors[field.name]}
          />
        ))}

        <Button type="submit">가입하기</Button>
        <Button
          type="button"
          onClick={handleReset}
          style={{ backgroundColor: "#888" }}
        >
          다시 작성
        </Button>
      </Form>
    </Container>
  );
};

export default SignUp;
