import Body from "./components/Body.jsx"
import Profile from "./pages/profile"
import Login from "./pages/login"
import Feed from "./components/feed"
import { BrowserRouter, Route , Routes } from "react-router-dom"
import Connections from "./pages/connections";
import Requests from "./pages/requests.jsx"
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Body/>}>
        <Route index element = {<Feed/>}/>
        <Route path = '/profile' element = {<Profile/>} />
        <Route path = '/login' element = {<Login/>} />
        <Route path = "/connections" element = {<Connections />} />
        <Route path="requests" element={<Requests />} />
        </Route>


      </Routes>
    
    </BrowserRouter>
  )
}

export default App
