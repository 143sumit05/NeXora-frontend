import {useState} from 'react'
import axiosClient from '../utils/axios';



const login = () => {
  const [emailId, setemailId] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async() => {
    try{
      const res = await axiosClient.post("/login",{
        emailId,
        password,
      })
      console.log(res.data);
      
    }
catch(err) {
    console.log("Login Error:", err.response?.data);
}
  }
  return (
    <div className='flex justify-center items-center min-h-screen'>
<div className="border card w-96 bg-base-100 shadow-sm">
  <div className="card-body">
    <h2 className='text-3xl font-bold'>Welcome!</h2>
    <p className='text-gray-500'>Login to your NeXora account</p>
    <fieldset className="fieldset">
  <legend className="fieldset-legend">Email Id</legend>
  <input type="email" className="input" placeholder="Enter Email" value = {emailId} onChange={(e) => setemailId(e.target.value)} />
</fieldset>
    <fieldset className="fieldset">
  <legend className="fieldset-legend">Password</legend>
  <input type="password" className="input" placeholder="Enter Password" value = {password} onChange={(e) => setPassword(e.target.value)} />
</fieldset>
    <div className="mt-6">
      <button className="btn btn-primary btn-block" onClick={handleLogin} >Login</button>
    </div>
  </div>
</div>
</div>
  )
}

export default login