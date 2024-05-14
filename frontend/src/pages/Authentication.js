import React from "react";
import { Modal } from "@mui/material";
import styled from "styled-components";
import { Close } from "@mui/icons-material";
import LogoImage from "../utils/Images/food_logo.png";
import AuthImage from "../utils/Images/Food_Banner.jpg";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useState } from "react";
const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  background: ${props => props.theme.bg};
`;
const Left = styled.div`
  flex: 1;
  position: relative;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.img`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 10;
  width: 87px;
`;
const Image = styled.img`
  position: relative;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const Right = styled.div`
  position: relative;
  flex: 0.9;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 16px;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    flex: 1;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  padding: 2px;
  width: 32px;
  height: 32px;
  border: 1px solid ${props => props.theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${props => props.theme.primary + 20};
  }
`;

const Text = styled.p`
  display: flex;
  gap: 12px;
  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.text_secondary};
  margin-top: 16px;
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;
const TextButton = styled.div`
  color: ${props => props.theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
`;
const Authentication = ({ setOpenAuth, openAuth }) => {
  const [login, setLogin] = useState(true);
  return (
    <Modal open={openAuth} onClose={() => setOpenAuth(false)}>
      <Container>
        <Left>
          <Logo src={LogoImage} />
          <Image src={AuthImage} />
        </Left>
        <Right>
          <CloseButton>
            <Close onClick={() => setOpenAuth(false)} />
          </CloseButton>

          {login ? (
            <>
              <SignIn setOpenAuth={setOpenAuth} />
              <Text>
                Don`t have account ?{" "}
                <TextButton onClick={() => setLogin(false)}>Sign Up</TextButton>
              </Text>
            </>
          ) : (
            <>
              <SignUp setOpenAuth={setOpenAuth} />
              <Text>
                Have account ?{" "}
                <TextButton onClick={() => setLogin(true)}>Sign In</TextButton>
              </Text>
            </>
          )}
        </Right>
      </Container>
    </Modal>
  );
};
export default Authentication;
