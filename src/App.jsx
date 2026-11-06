import Body from "./components/Body.jsx"
import Profile from "./pages/profile"
import Login from "./pages/login"
import { BrowserRouter, Route , Routes } from "react-router-dom"


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Body/>}>
        <Route path = '/login' element = {<Login/>} />
        <Route path = '/profile' element = {<Profile/>} />
        </Route>
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
