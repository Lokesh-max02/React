import { Link } from "react-router-dom"
import Home from "./Home"


const Navbar = () => {
  return (
    <>
    <div className="bg-blue-500 p-3 flex justify-between align-center">
    <div className="bg-white p-1">
        logo
    </div>
    <div className="flex gap-5">

        <Link to="/">Home</Link>
        <Link to="/Employee">Employee</Link>
        <Link to="/">Task 3</Link>
        <Link to="/">Task 4</Link>
        <Link to="/">Task 5</Link>
    </div>
     </div>
     <Home/>
    </>
  )
}

export default Navbar