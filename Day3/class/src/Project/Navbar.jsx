import vijay from "../assets/learn.png"
import banner from "../assets/banner.png"
 import "./Navbar.css"
const Navbar =()=>{
    return (<>
    <div className="vijay">
        <div>
    <img src={vijay} width={200}   alt="" />

    </div>
    <div className="home">
        <input type="text" placeholder="Search" />
   
    <a href="#">Home</a>
    <a href="#">Login</a>
    </div>
    </div>
    <div>
        <img src={banner} alt="" width={1520} height={400}/>
    </div>
    </>
    )
}
export default Navbar