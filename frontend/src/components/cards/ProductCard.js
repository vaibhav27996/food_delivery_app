import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CircularProgress, Rating } from "@mui/material";
import {
  AddShoppingCartOutlined,
  FavoriteBorder,
  FavoriteRounded,
  ShoppingBagOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  addFavourite,
  addToCart,
  getFavourite,
  removeFromFavourite,
} from "../../api/index";
import { toast } from "react-toastify";

const Card = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  @media (max-width: 600px) {
    width: 180px;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 300px;
  border-radius: 6px;
  object-fit: cover;
  transition: all 0.3s ease-out;
  @media (max-width: 600px) {
    height: 180px;
  }
`;
const Menu = styled.div`
  position: absolute;
  color: ${props => props.theme.text_primary};
  top: 14px;
  right: 14px;
  display: none;
  flex-direction: column;
  gap: 12px;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease-out;
  &:hover {
    background-color: ${props => props.theme.black};
  }

  &:hover ${Image} {
    opacity: 0.9;
  }
  &:hover ${Menu} {
    display: flex;
  }
`;
const MenuItem = styled.div`
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
`;
const Rate = styled.div`
  position: absolute;

  color: ${props => props.theme.text_primary};
  top: 12px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  opacity: 0.9;
`;
const Details = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: column;
  padding: 4px 10px;
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text_primary};
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.text_primary};
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  white-space: normal;
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.text_primary};
`;
const Percent = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: green;
`;
const Span = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${props => props.theme.text_secondary + 50};
`;
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  const getCurrUser = localStorage.getItem("food-app-token");
  const addToFavourite = async (productId) => {
    try {
      const token = localStorage.getItem("food-app-token");
      await addFavourite({ productId }, token)
        .then((res) => {
          setFavorite(true);

          toast.success(res.data.message, {
            autoClose: 1500,
          });
        })
        .catch((err) => {});
    } catch (error) {}
  };

  const addCart = async (productId) => {
    try {
      const token = localStorage.getItem("food-app-token");
      await addToCart({ productId, quantity: 1 }, token)
        .then((res) => {
          console.log("ress", res);
          toast.success(res.data.message, {
            autoClose: 1500,
          });
          navigate("/cart");
        })
        .catch((err) => {});
    } catch (error) {}
  };

  const checkFavorite = async () => {
    const token = localStorage.getItem("food-app-token");
    await getFavourite(token, { productId: product?._id })
      .then((res) => {
        const isFavorite = res.data?.some(
          (favorite) => favorite._id === product?._id
        );

        setFavorite(isFavorite);
      })
      .catch((err) => {});
  };

  const removeFavourite = async (productId) => {
    const token = localStorage.getItem("food-app-token");
    console.log(productId);
    await removeFromFavourite(token, { productId })
      .then((res) => {
        setFavorite(false);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    console.log('call')
    checkFavorite();
  }, [favorite]);

  return (
    <Card>
      <Top>
        <Image src={product.img} />
        {getCurrUser && (
          <>
            <Menu>
              <MenuItem
                onClick={() =>
                  favorite
                    ? removeFavourite(product?._id)
                    : addToFavourite(product?._id)
                }
              >
                {favorite ? (
                  <FavoriteRounded sx={{ fontSize: "20px", color: "red" }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: "20px" }} />
                )}
              </MenuItem>
              <MenuItem onClick={() => addCart(product?._id)}>
                <ShoppingBagOutlined sx={{ fontSize: "20px" }} />
              </MenuItem>
            </Menu>
          </>
        )}

        <Rate>
          <Rating value={3.5} sx={{ fontSize: "14px" }} />
        </Rate>
      </Top>

      <Details
        onClick={() => getCurrUser && navigate(`/dishes/${product._id}`)}
      >
        <Title>{product?.name}</Title>
        <Desc>{product?.desc}</Desc>
        <Price>
          {" "}
          ${product?.price?.org}
          <Span>${product?.price?.mrp}</Span>
          <Percent>(${product?.price?.off} off)</Percent>
        </Price>
      </Details>
    </Card>
  );
};

export default ProductCard;
