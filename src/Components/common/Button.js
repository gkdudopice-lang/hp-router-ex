import styled, { css } from "styled-components";
import React, { Children } from "react";

const StyledButton = styled.button`
  font-weight: bold;
  width: 100%;
  height: 50px;
  color: white;
  background-color: orangered;
  font-size: 15px;
  border-radius: 18px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: red;
  }

  & + & {
    margin-top: 10px;
  }
`;

const ButtonComponent = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};

export default ButtonComponent;
