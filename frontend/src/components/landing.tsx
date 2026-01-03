import Footer from "./footer"
import Homepage from "../pages/homepage"
import Navbar from "./navbar"

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 left-0 z-50 ">
        <Navbar />
      </header>

      <main className="flex-1 w-full">
        <Homepage/>
      </main>

      <footer className="w-full mt-10">
        <Footer/>
      </footer>
    </div>
  )
}

export default Landing