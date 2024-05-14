import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    currentUser:null,
    searchQuery:""
}

export const userSlice= createSlice({
    name:'user',
    initialState,
    reducers:{
        updateUser:(state,action)=>{
            state.currentUser = action.payload.user;
        },
        loginSuccess:(state,action)=>{
            localStorage.setItem("food-app-token", action.payload.token);
            localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
            state.currentUser=action.payload.user;
            
            
        },
        logout:(state)=>{
            state.currentUser= null
            localStorage.removeItem("food-app-token");
            localStorage.removeItem("userInfo");

        },
        refresh:(state,action)=>{
            if(action.payload===true){
                state.currentUser=JSON.parse(localStorage.getItem("userInfo"));
            }
        },
        search:(state,action)=>{
           
            state.searchQuery = action.payload;
        }
    }
});

export const {updateUser,loginSuccess,logout,refresh ,search} = userSlice.actions;
export const currUser = (state)=>state.user.currentUser;
export const searchQueryInput = (state)=>state.user.searchQuery;

export default userSlice.reducer;