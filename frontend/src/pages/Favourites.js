import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/cards/ProductCard";
import { getFavourite } from "../api/index";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: left;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${(props) => props.theme.bg};
`;
const Section = styled.div`
  gap: 28;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "start")};
  align-items: center;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: left;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;

const Span = styled.span`
  padding-top: 10px;
`;
const Favorites = () => {
  const [loading, setLoading] = useState(false);
  const [favProduct, setFavProduct] = useState([]);

  const getUserFavourite = async () => {
    let token = localStorage.getItem("food-app-token");
    setLoading(true);
    await getFavourite(token)
      .then((res) => {
        setFavProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserFavourite();
  }, []);

  return (
    <Container>
      <Section>
        <Title>Your Favorites</Title>
        <CardWrapper>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {favProduct.length === 0 ? (
                <Span>No favourite found</Span>
              ) : (
                favProduct.map((fav) => <ProductCard product={fav} />)
              )}
            </>
          )}
        </CardWrapper>
      </Section>
    </Container>
  );
};

export default Favorites;
