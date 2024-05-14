import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { addToCart, deleteFromCart, getCart, placeOrder } from "../api";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { toast } from "react-toastify";

import { DeleteOutline } from "@mui/icons-material";
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
  background: ${props => props.theme.bg};
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
  flex: 1.3;
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
  tex-align:center
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


// ---------------------right-----------------------

const Right = styled.div`
  flex: 0.7;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 750px) {
    flex: 0.8;
  }
`;

const SubTotal = styled.div`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;
const Delivery = styled.div`
  font-size: 18px;
  font-weight: 400;
  display: flex;
  gap: 6px;
  flex-direction: column;
`;
const Span=styled.span`
  padding-top: 10px;
`

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [userCartProduct, setUserCartProduct] = useState([]);

  const [reload, setReload] = useState(false);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });
  const navigate = useNavigate();

  const convertAddress = (addressObj) => {
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const getUserCartProducts = async () => {
    setLoading(true);
    let token = localStorage.getItem("food-app-token");
    const userInfo = localStorage.getItem("userInfo");
     if(!token && !userInfo){
      navigate('/');
      setLoading(false);
    }

    await getCart(token)
      .then((res) => {
        setUserCartProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserCartProducts();
  }, [reload]);

  const addCart = async (id) => {
    const token = localStorage.getItem("food-app-token");
    await addToCart({ productId: id, quantity: 1 }, token)
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
      });
  };

  const removeCart = async (id, quantity, type) => {
    const token = localStorage.getItem("food-app-token");
    let qnt = quantity > 0 ? 1 : 0;
    if (type === "full") qnt = 0;
    await deleteFromCart(token, {
      productId: id,
      quantity: qnt,
    })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
      });
  };

  const calculateSubtotal = () => {
    return userCartProduct.reduce(
      (total, i) => total + i.quantity * i.product.price.org,
      0
    );
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      if (userCartProduct.length === 0) {
        toast.error("Add atleast 1 item in cart", {
          autoClose: 1500,
        });
        setButtonLoad(false);
      } else if (deliveryDetails.firstName === "" || deliveryDetails.lastName === "") {
        toast.error("first name or last name required ", {
          autoClose: 1500,
        });
        setButtonLoad(false);
      } else {
        const token = localStorage.getItem("food-app-token");
        const totalAmount = calculateSubtotal();
        const orderDetails = {
          products: userCartProduct,
          address: convertAddress(deliveryDetails),
          totalAmount,
        };

        await placeOrder(token, orderDetails)
          .then((res) => {
            setButtonLoad(false);
            toast.success("Place order Successfully", {
              autoClose: 1500,
            });
            setReload(!reload);
            navigate("/");
          })
          .catch((err) => {
            toast.success("Place not order Successfully", {
              autoClose: 1500,
            });
            setButtonLoad(false);
          });
      }
    } catch (err) {
      toast.error("Place not order Successfully", {
        autoClose: 1500,
      });
      setButtonLoad(false);
    }
  };

  return (
    <Container>
      <Section>
        <Title>Your Shopping Cart</Title>
        <Wrapper>
          <Left>
            <Table>
              <TableItem bold flex>
                Products
              </TableItem>
              <TableItem bold>Price</TableItem>
              <TableItem bold>Quantity</TableItem>
              <TableItem bold>Subtotal</TableItem>
              <TableItem bold>Delete</TableItem>
            </Table>

            {loading ? (
              <CircularProgress />
            ) : (
              <>

                {userCartProduct.length ===0 ? <Span>No cart product found</Span>: userCartProduct.map((cartDetails) => (
                  <>
                    <Table>
                      <TableItem flex>
                        <Product>
                          <Img src={cartDetails?.product?.img} />
                          <Details>
                            <ProductTitle>
                              {cartDetails?.product?.name}
                            </ProductTitle>
                            <ProductDesc>
                              {cartDetails?.product?.desc}
                            </ProductDesc>
                          </Details>
                        </Product>
                      </TableItem>
                      <TableItem>${cartDetails?.product?.price?.org}</TableItem>
                      <TableItem>
                        <Counter>
                          <div
                            style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() =>
                              removeCart(
                                cartDetails?.product?._id,
                                cartDetails?.quantity - 1
                              )
                            }
                          >
                            -
                          </div>
                          {cartDetails?.quantity}{" "}
                          <div
                            style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() => addCart(cartDetails?.product?._id)}
                          >
                            +
                          </div>
                        </Counter>
                      </TableItem>
                      <TableItem>
                        {" "}
                        $
                        {cartDetails.quantity *
                          cartDetails?.product?.price?.org}
                      </TableItem>
                      <TableItem>
                        <DeleteOutline
                          sx={{ color: "red" }}
                          onClick={() =>
                            removeCart(
                              cartDetails?.product?._id,
                              cartDetails?.quantity - 1,
                              "full"
                            )
                          }
                        />
                      </TableItem>
                    </Table>
                  </>
                ))}
              </>
            )}
          </Left>
          {/* Right -------------------- */}
          <Right>
            <SubTotal>Subtotal : ${calculateSubtotal()}</SubTotal>
            <Delivery>
              Delivery Details:
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                  }}
                >
                  <TextInput
                    small
                    placeholder="First Name"
                    value={deliveryDetails.firstName}
                    handelChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        firstName: e.target.value,
                      })
                    }
                  />
                  <TextInput
                    small
                    placeholder="Last Name"
                    value={deliveryDetails.lastName}
                    handelChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
                <TextInput
                  small
                  placeholder="Email Address"
                  value={deliveryDetails.emailAddress}
                  handelChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      emailAddress: e.target.value,
                    })
                  }
                />
                <TextInput
                  small
                  placeholder="Enter mobile no"
                  value={deliveryDetails.phoneNumber}
                  handelChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      phoneNumber: e.target.value,
                    })
                  }
                />
                <TextInput
                  small
                  textArea
                  rows="5"
                  placeholder="Enter address"
                  value={deliveryDetails.completeAddress}
                  handelChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      completeAddress: e.target.value,
                    })
                  }
                />
              </div>
            </Delivery>
            {/* <Delivery>
                    Payment Details:
                    <div>
                      <TextInput small placeholder="Card Number" />
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                        }}
                      >
                        <TextInput small placeholder="Expiry Date" />
                        <TextInput small placeholder="CVV" />
                      </div>
                      <TextInput small placeholder="Card Holder name" />
                    </div>
                  </Delivery> */}
            <Button
              text="Place Order"
              small
              onClick={PlaceOrder}
              isLoading={buttonLoad}
              isDisabled={buttonLoad}
            />
          </Right>
        </Wrapper>
      </Section>
    </Container>
  );
};

export default Cart;
