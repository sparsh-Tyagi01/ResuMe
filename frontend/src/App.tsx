import { Route, Routes } from "react-router-dom"
import Mainlayout from "./components/mainlayout"
import Homepage from "./pages/homepage"
import Login from "./components/login"
import Landing from "./components/landing"
import Register from "./components/register"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Landing/>}/>
        <Route element={<Mainlayout/>}>
          <Route path="/home" element={<Homepage/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App