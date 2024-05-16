import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { getAllOrderList } from "../api/index";
import { searchQueryInput } from "../redux/reducer/UserSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  background: ${(props) => props.theme.bg};
`;
const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  gap: 28px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media (max-width: 750px) {
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 1.2;
  }
`;

const Table = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 22px;
`;
const TableItem = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 18px;
`;

const Counter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid black;
  border-radius: 8px;
  padding: 4px 12px;
`;

const Product = styled.div`
  display: flex;
  gap: 16px;
`;
const Img = styled.img`
  height: 80px;
`;
const Details = styled.div`
  max-width: 130px;
  @media (max-width: 700px) {
    max-width: 60px;
  }
`;
const ProductTitle = styled.div`
  color: black;
  font-size: 16px;
  font-weight: 500;
`;
const ProductDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TotalDiv = styled.div`
  background: #080808;
  height: 38px;
  border-radius: 7px;
  padding-left: 10px;
  color: white;
  display: flex;
  padding-right: 18rem;
  text-align: right;
  @media (max-width: 768px) {
    padding-right: 0rem;
    text-align: left;
  }
`;
const TotalAmount = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getTotalSum, setGetTotalSum] = useState(null);
  const searchInput = useSelector(searchQueryInput);
  const navigate = useNavigate();

  const getAllOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem("food-app-token");
    const userInfo = localStorage.getItem("userInfo");
    if (!token && !userInfo) {
      navigate("/");
      setLoading(false);
    }

    let searchInputData = searchInput.length > 0 ? `search=${searchInput}` : ``;
    await getAllOrderList(token, searchInputData)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const calcuateTotalAmount = () => {
    return orders.reduce(
      (total, item) => (total += item.quantity * item.product.price.org),
      0
    );
  };
  useEffect(() => {
    getAllOrder();
  }, []);
  useEffect(() => {
    getAllOrder();
  }, [searchInput]);

  return (
    <Container>
      <Section>
        <Title>
          {orders.length > 0 ? "Your Order Lists" : "No Order Lists Found"}
        </Title>

        {orders.length > 0 && (
          <Wrapper>
            <Left>
              <Table>
                <TableItem bold flex>
                  Products
                </TableItem>
                <TableItem bold>Price</TableItem>
                <TableItem bold>Quantity</TableItem>
                <TableItem bold>Subtotal</TableItem>
              </Table>

              {loading ? (
                <>
                  <CircularProgress />
                </>
              ) : (
                <>
                  {orders.map((order, i) => (
                    <>
                      <Table key={i}>
                        <TableItem flex>
                          <Product>
                            <Img src={order?.product?.img} />
                            <Details>
                              <ProductTitle>
                                {order?.product?.name}
                              </ProductTitle>
                              <ProductDesc>{order?.product?.desc}</ProductDesc>
                            </Details>
                          </Product>
                        </TableItem>
                        <TableItem>₹{order?.product?.price?.org}</TableItem>
                        <TableItem>{order?.quantity} </TableItem>
                        <TableItem>
                          {" "}
                          ₹{order.quantity * order?.product?.price?.org}
                        </TableItem>
                      </Table>
                    </>
                  ))}
                  <TotalDiv>
                    <div>Total: ₹ {calcuateTotalAmount()}</div>
                  </TotalDiv>
                </>
              )}
            </Left>
          </Wrapper>
        )}
      </Section>
    </Container>
  );
};

export default OrderList;
