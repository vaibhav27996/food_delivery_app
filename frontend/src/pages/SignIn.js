import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { toast } from "react-toastify";
import { UserSignIn, userForgotPassword } from "../api/index";
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
// ZPQTTQM6NWDDFD8MFM7UZ1S5
const SignIn = ({ setOpenAuth }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const validateInput = () => {
    switch (true) {
      case !email || !password:
        toast.error("All fields are required !", {
          autoClose: 1500,
        });
        break;
      case password.length < 5:
        toast.error("Password length should be greater than 5 ! !", {
          autoClose: 1500,
        });
        break;
      default:
        return true;
    }
    setButtonDisabled(false);
    setLoading(false);
    return false;
  };

  const validatePasswordInput = () => {
    switch (true) {

      case !newPassword && !confirmNewPassword && !userEmail:
        toast.error("All fields are required !", {
          autoClose: 1500,
        });
        break;

      case (!newPassword || !confirmNewPassword) && userEmail:
        toast.error("Both password are required !", {
          autoClose: 1500,
        });
        break;

      case newPassword !== confirmNewPassword:
        toast.error("Both password not matched!", {
          autoClose: 1500,
        });
        break;

      case newPassword.length < 5 && confirmNewPassword.length < 5:
        toast.error("Both password length should be greater than 5 !", {
          autoClose: 1500,
        });
        break;

      default:
        return true;
    }

    setButtonDisabled(false);
    setLoading(false);
    return false;
  };

  const validateEmail = (inputEmail) => {
      const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      switch(true){
        case !inputEmail.match(isValidEmail):
          toast.error("Invalid Email", {
            autoClose: 1500,
          });
        break;

        default:
          return true
      }
      setButtonDisabled(false);
      setLoading(false);
      return false;
  };

  const handleSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);

    if (validateInput() && validateEmail(email)) {
      await UserSignIn({ email, password })
        .then((res) => {
          console.log("res", res);
          dispatch(loginSuccess(res.data));
          toast.success("Login Successfully !", {
            autoClose: 1500,
          });
          setLoading(false);
          setButtonDisabled(false);
          setOpenAuth(false);
        })
        .catch((err) => {
          setLoading(false);
          setButtonDisabled(false);
          toast.error("User not found!", {
            autoClose: 1500,
          });
        });
    }
  };

  const handleForgotPass = async () => {
    setLoading(true);
    setButtonDisabled(true);
    
    if (forgotPassword && validatePasswordInput() && validateEmail(userEmail)) {
      await userForgotPassword({ newPassword, confirmNewPassword, userEmail })
        .then((res) => {
     
          if(res.data==="User Not Found"){
            toast.error(res.data, {
              autoClose: 1500,
            });
          }else{
            toast.success(res.data, {
              autoClose: 1500,
            });
          }
         
          setLoading(false);
          setButtonDisabled(false);
          setOpenAuth(true);
          setForgotPassword(false);
        })
        .catch((err) => {
          setLoading(false);
          setButtonDisabled(false);
          setForgotPassword(false);
          toast.error("Invalid Inputs!", {
            autoClose: 1500,
          });
        });
    }
  };

  return (
    <Container>
      <div>
        <Title>Welcome to Indian Restaurent</Title>
        {forgotPassword ? (
          <span> Please enter new password</span>
        ) : (
          <span>Please login with your details</span>
        )}
      </div>

      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        {forgotPassword ? (
          <>
            <TextInput
              label="Enter Email"
              placeholder="Enter your email address"
              value={userEmail}
              handelChange={(e) => setUserEmail(e.target.value)}
            />

            <TextInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              handelChange={(e) => setNewPassword(e.target.value)}
              password
            />

            <TextInput
              label="Confirm Password"
              placeholder="Enter confirm password"
              value={confirmNewPassword}
              handelChange={(e) => setConfirmNewPassword(e.target.value)}
              password
            />

            <Button
              text="Submit"
              onClick={handleForgotPass}
              isLoading={loading}
              isDisabled={buttonDisabled}
            />
          </>
        ) : (
          <>
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
            <TextButton onClick={() => setForgotPassword(true)}>
              Forgot Password?
            </TextButton>
            <Button
              text="Sign In"
              onClick={handleSignIn}
              isLoading={loading}
              isDisabled={buttonDisabled}
            />
          </>
        )}
      </div>
    </Container>
  );
};

export default SignIn;
