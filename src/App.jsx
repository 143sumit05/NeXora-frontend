import Body from "./components/Body.jsx"
import Profile from "./pages/profile"
import Login from "./pages/login"
import Feed from "./components/feed"
import { BrowserRouter, Route , Routes } from "react-router-dom"


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Body/>}>
        <Route index element = {<Feed/>}/>
        <Route path = '/profile' element = {<Profile/>} />
        <Route path = '/login' element = {<Login/>} />
        </Route>


      </Routes>
    
    </BrowserRouter>
  )
}

export default App
