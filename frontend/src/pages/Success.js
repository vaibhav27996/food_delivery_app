import React ,{useState,useEffect}from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import styled from 'styled-components';

const Message =styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
font-size: 33px;
`
const Success = () => {

    const navigate= useNavigate();
    useEffect(()=>{
      const callMessage= ()=>{
      
        toast.success("Place order Successfully !", {
          autoClose: 1500,
        });
        setTimeout(()=>{
            navigate('/')
        },3000)
      }
      callMessage();
    },[])

  return (
    <div>
          <Message>
              Place Order Successfully
          </Message>
    </div>
  )
}

export default Success
