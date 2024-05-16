import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { category } from "../utils/data";
import HeaderImage from "../utils/Images/Food_Banner.jpg";
import ProductCategoryCard from "../components/cards/ProductCategoryCard";
import ProductCard from "../components/cards/ProductCard";
import { getAllProducts } from "../api/index";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { searchQueryInput } from "../redux/reducer/UserSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: #e8dede;
`;
const Section = styled.div`
  gap: 28;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  margin-top: 10px;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;
const Img = styled.img`
  width: 100%;
  max-width: 1200px;
`;
const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const searchInput = useSelector(searchQueryInput);
  const {message} = useParams();
  const navigate =useNavigate();
  
  const getProducts = async () => {
    await getAllProducts(searchInput.length > 0 ? `search=${searchInput}` : ``)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    getProducts();
  }, [searchInput]);

  return (
    <Container>
      <Section>
        <Img src={HeaderImage} />
      </Section>

      <Section>
        <Title>Food Category</Title>
        <CardWrapper>
          {category.map((categories, i) => (
            <ProductCategoryCard key={i} categories={categories} />
          ))}
        </CardWrapper>
      </Section>
      <br />
      <Section>
        <Title>Most Popular</Title>
        {loading ? (
          <CircularProgress />
        ) : (
          <CardWrapper>
            {products.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </CardWrapper>
        )}
      </Section>
    </Container>
  );
};

export default Home;
