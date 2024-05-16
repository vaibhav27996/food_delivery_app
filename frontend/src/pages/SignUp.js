import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { toast } from "react-toastify";
import { UserSignUp } from "../api/index";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducer/UserSlice";
const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${(props) => props.theme.primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.text_secondary + 90};
`;
const TextButton = styled.div`
  width: 100%;
  text-align: end;
  color: ${(props) => props.theme.text_primary};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  font-weight: 500;
  &:hover {
    color: ${(props) => props.theme.primary};
  }
`;

const SignUp = ({ setOpenAuth }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [img, setImg] = useState();

  const validateInput = () => {
    switch (true) {
      case !email || !password || !name:
        toast.error("All fields are required !", {
          autoClose: 1500,
        });
        break;

      case password.length < 5:
        toast.error("Password length should be greater than 5 !", {
          autoClose: 1500,
        });
        break;

      default:
        return true;
    }

    setbuttonDisabled(false);
    setLoading(false);
    return false;
  };

  const validateEmail = () => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    switch (true) {
      case !email.match(isValidEmail):
        toast.error("Invalid Email", {
          autoClose: 1500,
        });
        break;

      default:
        return true;
    }
    setbuttonDisabled(false);
    setLoading(false);
    return false;
  };
  const handleSignUp = async () => {
    try {
      setLoading(true);
      setbuttonDisabled(true);
      if (validateInput() && validateEmail()) {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("img", img);

        let res = await UserSignUp(formData);
        dispatch(loginSuccess(res.data));
        toast.success("Sign up Successfully !", {
          autoClose: 1500,
        });
        setLoading(false);
        setbuttonDisabled(false);
        setOpenAuth(false);
      }
    } catch (error) {
      setLoading(false);
      setbuttonDisabled(false);
      toast.error("Invalid Inputs !", {
        autoClose: 1500,
      });
    }
  };

  return (
    <Container>
      <div>
        <Title>Indian Restaurant</Title>
        <Span>Please sign up with your details</Span>
      </div>

      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <TextInput
          label="Enter Name"
          placeholder="Enter your full name"
          value={name}
          handelChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Enter Email"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label="Enter Password"
          placeholder="Enter your password"
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
          password
        />

        <TextInput
          label="Choose Profile image"
          handelChange={(e) => setImg(e.target.files[0])}
          file
        />

        <Button
          text="Sign Up"
          isLoading={loading}
          isDisabled={buttonDisabled}
          onClick={handleSignUp}
        />
      </div>
    </Container>
  );
};

export default SignUp;
