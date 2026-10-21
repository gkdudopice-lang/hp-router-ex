import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  text-align: left;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #333;
`;

const StyledInput = styled.input`
  margin: 0 30px;
  width: 100%;
  height: auto;
  line-height: normal;
  padding: 1em;
  border: 1px solid #999;
  border-radius: 18px;
  outline-style: none;

  &:focus {
    border-color: orangered;
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const InputComponent = ({ label, error, ...rest }) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <StyledInput {...rest} />
      {error && <ErrorText style={{ color: "red" }}>{error}</ErrorText>}
    </Wrapper>
  );
};

export default InputComponent;
