import logo from "../src/assets/h.jpg"
import "./App.css"
import Banner from "./Project/Banner"
import Navbar from "./Project/Navbar"
import Report from "./Project/Report"

const App=()=>{
  return (
    <>
     <Navbar/>
     <Banner/>
    <div className="class">
    <div className="parent">
      <div className="vijay">
    <img src={logo} width={100}/>
    </div>
    <div>
      <h1>Name : vijay</h1>
      <h1>Course : BE-CSE</h1>
      <h1>Skill : Java,HTML,CSS,Tailwind,Javascript</h1>
    </div>
    </div>
   
    </div>
    <Report/>
    </>
  )
}
export default App