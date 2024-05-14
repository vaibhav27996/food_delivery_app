import { CloseRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12px;
  color: ${(props) => props.theme.primary};
  padding: 0px 4px;
  ${({ error, theme }) =>
    error &&
    `
    color: ${theme.red};
  `}
  ${({ small }) =>
    small &&
    `
    font-size: 8px;
  `}
  ${({ popup, theme }) =>
    popup &&
    `
  color: ${theme.popup_text_secondary};
  `}
`;

const OutlinedInput = styled.div`
  border-radius: 8px;
  border: 0.5px solid ${(props) => props.theme.text_secondary};
  background-color: transparent;
  color: ${(props) => props.theme.text_primary};
  outline: none;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  &:focus-within {
    border-color: ${(props) => props.theme.secondary};
  }
  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.red};
  `}

  ${({ chipableInput, height, theme }) =>
    chipableInput &&
    `
    background: ${theme.card};
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-height: ${height}
  `}

  ${({ small }) =>
    small &&
    `
    border-radius: 6px;
    padding: 8px 10px;
  `}

  ${({ popup, theme }) =>
    popup &&
    `
  color: ${theme.popup_text_secondary};
  border: 0.5px solid ${theme.popup_text_secondary + 60};
  `}
`;

const Input = styled.input`
  width: 100%;
  font-size: 14px;
  outline: none;
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.primary};
  &:focus {
    outline: none;
  }
  ${({ small }) =>
    small &&
    `
    font-size: 12px;
  `}

  ${({ popup, theme }) =>
    popup &&
    `
  color: ${theme.popup_text_secondary};
  `} ${(props) => props.theme.popup_text_secondary};
`;

const Error = styled.p`
  font-size: 12px;
  margin: 0px 4px;
  color: ${(props) => props.theme.red};
  ${({ small }) =>
    small &&
    `
    font-size: 8px;
  `}
`;

const TextInput = ({
  label,
  placeholder,
  name,
  value,
  error,
  handelChange,
  textArea,
  rows,
  columns,
  height,
  small,
  popup,
  password,
  file
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container small={small}>
      <Label small={small} popup={popup} error={error}>
        {label}
      </Label>
      <OutlinedInput small={small} popup={popup} error={error} height={height}>
        {file ? 
        
        <Input
          
          small={small}
          as="input"
          name={name}
          onChange={(e) => handelChange(e)}
          type="file"
        />
        
        : <>
        <Input
          popup={popup}
          small={small}
          as={textArea ? "textarea" : "input"}
          name={name}
          rows={rows}
          columns={columns}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handelChange(e)}
          type={password && !showPassword ? "password" : "text"}
        />
        {password && (
          <>
            {showPassword ? (
              <>
                <Visibility onClick={() => setShowPassword(false)} />
              </>
            ) : (
              <>
                <VisibilityOff onClick={() => setShowPassword(true)} />
              </>
            )}
          </>
        )}
        
        </>} 
        
        
      </OutlinedInput>
      {error && (
        <Error small={small} popup={popup}>
          {error}
        </Error>
      )}
    </Container>
  );
};

export default TextInput;
