import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
// import Authentication from "./pages/Authentication";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import FoodListing from "./pages/FoodListing";
import OrderList from "./pages/OrderList";
import Authentication from "./pages/Authentication";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";
import {currUser ,refresh} from './redux/reducer/UserSlice';
import { useDispatch } from "react-redux";

const Container = styled.div``;

function App() {
  const [openAuth,setOpenAuth]= useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector(currUser);
  useEffect(()=>{
    dispatch(refresh(true));
  },[])
  
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container >
          <Navbar setOpenAuth={setOpenAuth} openAuth={openAuth} currentUser={currentUser} />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/favorite" exact element={<Favourites />} />
            <Route path="/cart" exact element={<Cart />} />
            <Route path="/dishes/:id" exact element={<FoodDetails />} />
            <Route path="/dishes" exact element={<FoodListing />} />
            <Route path="/orders" exact element={<OrderList />} />
          </Routes>
          {openAuth && <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth}/>}
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
