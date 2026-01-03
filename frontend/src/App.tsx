import { Route, Routes } from "react-router-dom"
import Login from "./pages/login"
import Landing from "./components/landing"
import Register from "./pages/register"
import Dashboard from "./pages/dashboard"
import Mainlayout from "./pages/mainlayout"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/home" element={<Landing/>}/>
        <Route element={<Mainlayout/>}>
          <Route path="/" element={<Dashboard/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App