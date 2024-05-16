import axios from "axios";

const API = axios.create({
//   baseURL: "https://food-delivery-backend-ld49.onrender.com/",
  baseURL: "http://localhost:8000/",

});

export const UserSignUp = async (formData) => await API.post("/user/signup", formData,{
    'Content-Type': 'multipart/form-data'
});
export const UserSignIn = async (data) => await API.post("/user/signin", data);

export const userForgotPassword = async (data) => await API.post("/user/forgotPassword", data);


export const getAllProducts = async(filter)=>await API.get(`/food?${filter}`,filter);

export const getProductDetails = async (id) => await API.get(`/food/${id}`,id);


export const getCart = async(token)=>await API.get('/user/cart',{
    headers:{Authorization:`Bearer ${token}`}
});


export const addToCart = async(data,token)=>await API.post('/user/cart',data,{
    headers:{Authorization:`Bearer ${token}`}
});


export const deleteFromCart = async (token,data)=>await API.patch('/user/cart',data,{
    headers:{Authorization:`Bearer ${token}`}
})
// favoutite

export const getFavourite = async(token)=>await API.get('/user/favourite',{
    headers:{Authorization:`Bearer ${token}`}
});

export const addFavourite = async(data,token)=>await API.post('/user/favourite',data,{
    headers:{Authorization:`Bearer ${token}`}
});

export const removeFromFavourite = async (token,data)=>await API.patch('/user/favourite',data,{
    headers:{Authorization:`Bearer ${token}`}
})


// Place order

export const placeOrder = async (token,data)=>await API.post('/user/order/',data,{
    headers:{Authorization:`Bearer ${token}`}
})

export const stripePaymentGateway = async (token,data) => await API.post('/user/stripePayment', data,{
    headers:{Authorization:`Bearer ${token}`}
});


export const getAllOrderList = async (token,filter)=>await API.get(`/user/getAllOrders?${filter}`,{
    headers:{Authorization:`Bearer ${token}`}
},filter)


export const getUserDetails = async (token)=>await API.get('/user/getImage',{
    headers:{Authorization:`Bearer ${token}`}
})


