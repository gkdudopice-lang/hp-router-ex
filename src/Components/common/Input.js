import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box; /* padding/border를 width 안에 포함 → 넘침 방지 */
  padding: 1em;
  font-size: 15px;
  border: 1px solid #999;
  border-radius: 18px;
  outline: none;

  &:focus {
    border-color: black;
  }
`;

const Input = ({ type = "text", value, onChange, placeholder }) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
