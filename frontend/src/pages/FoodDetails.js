import { CircularProgress, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import {
  FavoriteBorderOutlined,
  FavoriteRounded,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  removeFromFavourite,
  getFavourite,
  getProductDetails,
  addFavourite
} from "../api";
import { useDispatch } from "react-redux";
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
    padding: 20px 16px;
  }
  background: ${props => props.theme.bg};
`;

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  max-width: 1400px;
  display: flex;
  gap: 40px;
  justify-content: center;
  @media only screen and (max-width: 700px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const ImagesWrapper = styled.div`
  flex: 0.7;
  display: flex;
  justify-content: center;
`;
const Image = styled.img`
  max-width: 400px;
  width: 100%;
  max-height: 500px;
  border-radius: 12px;
  object-fit: cover;
  @media (max-width: 768px) {
    max-width: 350px;
    height: 350px;
  }
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  gap: 18px;
  flex-direction: column;
  padding: 4px 10px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${props => props.theme.text_primary};
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.text_primary};
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 500;
  color: ${props => props.theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${props => props.theme.text_secondary + 50};
`;

const Percent = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: green;
`;

const Ingridents = styled.div`
  font-size: 16px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const Item = styled.div`
  background: ${props => props.theme.primary + 20};
  color: ${props => props.theme.primary};
  font-size: 14px;
  padding: 4px 12px;
  display: flex;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 32px 0px;
  @media only screen and (max-width: 700px) {
    gap: 12px;
    padding: 12px 0px;
  }
`;

const FoodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();

  const getProduct = async () => {
    setLoading(true);
    await getProductDetails(id).then((res) => {
      setProduct(res.data);
      setLoading(false);
    });
  };

  const addToFavourite=async (productId)=>{
    try {
      const token = localStorage.getItem("food-app-token");
      await addFavourite({productId},token).then((res)=>{
        setFavorite(true);
        setFavoriteLoading(false);
        toast.success(res.data.message, {
          autoClose: 1500,
        });
      }).catch((err)=>{})
    } catch (error) {
      
    }
  }

  const addCart=async (productId)=>{
    try {
      const token = localStorage.getItem("food-app-token");
      await addToCart({productId,quantity:1},token).then((res)=>{
        
        toast.success(res.data.message, {
          autoClose: 1500,
        });
        navigate("/cart");
      }).catch((err)=>{})
    } catch (error) {
      
    }
  }

  const checkFavorite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("food-app-token");
    console.log('product',product);
    await getFavourite(token, { productId: product?._id })
      .then((res) => {
        const isFavorite = res.data?.some(
          (favorite) => favorite._id === product?._id
        );

        setFavorite(isFavorite);
        setFavoriteLoading(false);
      })
      .catch((err) => {
       
      });
  };

  const removeFavourite = async (productId) => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("food-app-token");
    console.log(productId);
    await removeFromFavourite(token,{productId})
      .then((res) => {
        setFavorite(false);
        setFavoriteLoading(false);
      })
      .catch((err) => {
        setFavoriteLoading(false);
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(()=>{
    checkFavorite();
  },[product])

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Wrapper>
          <ImagesWrapper>
            <Image src={product?.img} />
          </ImagesWrapper>
          <Details>
            <div>
              <Title>{product?.name}</Title>
            </div>
            <Rating value={3.5} />
            <Price>
              ₹{product?.price?.org} <Span>₹{product?.price?.mrp}</Span>{" "}
              <Percent> (₹{product?.price?.off}% Off) </Percent>
            </Price>

            <Desc>{product?.desc}</Desc>

            <Ingridents>
              Ingridents
              <Items>
                {product?.ingredients.map((ingredient) => (
                  <Item>{ingredient}</Item>
                ))}
              </Items>
            </Ingridents>

            <ButtonWrapper>
              <Button
                text="Add to Cart"
                full
                outlined
                isLoading={cartLoading}
                onClick={() => addCart(product._id)}
              />
              {/* <Button text="Order Now" full /> */}
              <Button
                leftIcon={
                  favorite ? (
                    <FavoriteRounded sx={{ fontSize: "22px", color: "red" }} />
                  ) : (
                    <FavoriteBorderOutlined sx={{ fontSize: "22px" }} />
                  )
                }
                full
                outlined
                isLoading={favoriteLoading}
                onClick={() => (favorite ? removeFavourite(product._id) : addToFavourite(product._id))}
              />
            </ButtonWrapper>
          </Details>
        </Wrapper>
      )}
    </Container>
  );
};

export default FoodDetails;
