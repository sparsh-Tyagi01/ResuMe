import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

const Mainlayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full">
        <Navbar />
      </header>

      <main className="flex-1 w-full">
        <Outlet/>
      </main>

      <footer className="w-full mt-10">
        <Footer/>
      </footer>
    </div>
  )
}

export default Mainlayout