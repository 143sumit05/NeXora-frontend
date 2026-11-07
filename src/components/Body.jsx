import React from 'react'
import Navbar from './navbar'
import { Outlet } from 'react-router-dom'
import Footer from './footer'
const Body = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>

    </>
  )
}

export default Body;