import React from 'react'
import Navbar from './navbar'
import { Outlet } from 'react-router-dom'
import Footer from './footer'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axios";
import { addUser, removeUser  } from "../redux/userSlice";



const Body = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const userData = useSelector((store) => store.user);

  const fetchUser = async() => {
    if(userData) return;
    try{
      const res = await axiosClient.get("/profile");
      dispatch(addUser(res.data.user));
    }
    catch(err){
      dispatch(removeUser());
      navigate("/login");
      console.log(err);
    }
  }
  useEffect(()=>{
    fetchUser();
  },[]);

  return (
    <>
    <Navbar/>
    <Outlet/>

    </>
  )
}

export default Body;