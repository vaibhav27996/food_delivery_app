import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link as LinkR, NavLink } from "react-router-dom";
import LogoImg from "../utils/Images/Logo.png";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Button from "./Button";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout, search } from "../redux/reducer/UserSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextInput from "../components/TextInput";
import {getUserDetails} from '../api/index'
const Nav = styled.div`
  background-color:#046665;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;
const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;
const NavLogo = styled(LinkR)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;
const Logo = styled.img`
  height: 79px;
  @media screen and (max-width: 768px) {
    height: 35px;
  }
`;
const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 1s slide-in;
  text-decoration: none;
  @media screen and (max-width: 768px) {
    color: #1f1717;
   
  }

  &:hover {
    color: white;
  }
  &.active {
    color: white;
    border-bottom: 1.8px solid #c9cae0;
    @media screen and (max-width: 768px) {
      color: #1f1717;
    }
  }
`;
const ButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  align-items: center;
  padding: 0 6px;
  color: ${props => props.theme.primary};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  color: ${props => props.theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;
const MobileIcons = styled.div`
  color: ${props => props.theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
`;

const MobileMenu = styled.ul`
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 80%;
  padding: 12px 40px 24px 40px;
  background: white;
  position: absolute;
  top: 68px;
  right: 0;
  border-radius: 0 0 20px 20px;
  margin-right: 2px;
  color:black
`;

const TextButton = styled.span`
  text-align: end;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const MobileSearchInput = styled.input`
  margin-top: 3px;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid white;
  color:white
  width: 200px;

  @media screen and (max-width: 768px) {
    width: 113px;
  }
`;




const Navbar = ({ setOpenAuth, openAuth, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState('');
  const logoutBtn = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logout Successfully", {
      autoClose: 1500,
    });
  };

  const getUserImg = async()=>{
    let token = localStorage.getItem('food-app-token');
    if(currentUser && token){
      await getUserDetails(token).then((res)=>{
        setImageSrc(`data:image/jpeg;base64,${res.data}`);
      }).catch((err)=>{})
    }
  }

  useEffect(()=>{
    getUserImg();
  },[]);

  useEffect(()=>{
    {!openAuth && getUserImg()};
  },[openAuth]);

  console.log('imageSrc',imageSrc);
  return (
    <Nav>
      <NavContainer>
        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded style={{ color: "inherit" }} />
        </MobileIcon>
        <NavLogo to="/">
          <Logo src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4r2jvDhaqZbiRQvBhfpTKsgjDNY798e9jxzFK5ke-uiChRYSqZLweVQHEQFRgN41tvSo&usqp=CAU" />
        </NavLogo>

        <MobileIcons>
          <MobileSearchInput
            type="text"
            placeholder="Search"
            onChange={(e) => dispatch(search(e.target.value))}
          ></MobileSearchInput>

          {currentUser && (
            <>
              <Navlink to="/favorite">
                <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
              </Navlink>
              <Navlink to="/cart">
                <ShoppingCartOutlined
                  sx={{ color: "inherit", fontSize: "28px" }}
                />
              </Navlink>

              {imageSrc ?
              <img src={imageSrc} alt="Your Image" style={{width:'60px',height:'60px',borderRadius:'50%'}}/>

              : 
              <Avatar></Avatar>}
              </>
          )}
        </MobileIcons>

        <NavItems>
          <Navlink to="/">Home</Navlink>
          <Navlink to="/dishes">Dishes</Navlink>
          {currentUser && <Navlink to="/orders">Orders</Navlink>}
          {/* <Navlink to="/contact">Contact</Navlink> */}
        </NavItems>

        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <Navlink to="/" onClick={() => setIsOpen(false)}>
              Home
            </Navlink>
            <Navlink to="/dishes" onClick={() => setIsOpen(false)}>
              Dishes
            </Navlink>

            {/* <Navlink to="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </Navlink> */}
            {currentUser ? (
              <>
                <Navlink to="/orders" onClick={() => setIsOpen(false)}>
                  Orders
                </Navlink>
                <TextButton onClick={logoutBtn}>Logout</TextButton>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                <Button
                  text="Sign Up"
                  outlined
                  small
                  onClick={() => setOpenAuth(true)}
                />
                <Button
                  text="Sign In"
                  small
                  onClick={() => setOpenAuth(true)}
                />
              </div>
            )}
          </MobileMenu>
        )}

        <ButtonContainer>
        <MobileSearchInput
            type="text"
            placeholder="Search"
            onChange={(e) => dispatch(search(e.target.value))}
          ></MobileSearchInput>
          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
              </Navlink>
              <Navlink to="/cart">
                <ShoppingCartOutlined
                  sx={{ color: "inherit", fontSize: "28px" }}
                />
              </Navlink>
              {imageSrc ?
              <img src={imageSrc} alt="Your Image" style={{width:'60px',height:'60px',borderRadius:'50%'}}/>

              : 
              <Avatar></Avatar>}
              <TextButton onClick={logoutBtn}>Logout</TextButton>
            </>
          ) : (
            <>
              <Button text="Sign In" small onClick={() => setOpenAuth(true)} />
            </>
          )}
        </ButtonContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
