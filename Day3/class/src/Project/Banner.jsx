import nine from "../assets/96.jpg"
import one from "../assets/2.jpg"
import second from "../assets/3.jpg"
import third from "../assets/4.jpg"
import course1 from "../assets/course_2.jpg"
import course2 from "../assets/course_3.jpg"
import course3 from "../assets/course_4.jpg"
import course4 from "../assets/course_5.jpg"
import './Banner.css'
const Banner=()=>{
    return(<>
    <div className="parents">
        <div className="nines">
            <img src={nine} alt="" width={200} />
            <h2>Movie Name : 96</h2>
            <h2>Hero Name : Vijay Sethupathy</h2>
            <h2>Collection : 100cr</h2>
        </div>
        <div className="nines">
            <img src={one} alt="" width={180} />
            <h2>Movie Name : Kaththi</h2>
            <h2>Hero Name : Vijay </h2>
            <h2>Collection : 200cr</h2>
        </div>
        <div className="nines">
            <img src={second} alt="" width={200} />
            <h2>Movie Name : 3</h2>
            <h2>Hero Name : Dhanush</h2>
            <h2>Collection : 100cr</h2>
        </div>
        <div className="nines">
            <img src={third} alt="" width={200} />
            <h2>Movie Name : 3</h2>
            <h2>Hero Name : Dhanush</h2>
            <h2>Collection : 200cr</h2>
        </div>
    </div>
    <div className="image">
        <div className="cards">
            <h3>Product 1</h3>
            <img src={course1} alt=""  width={300}/>
        </div>
         <div>
            <h3>Product 2</h3>
            <img src={course2} alt=""  width={300}/>
        </div>
         <div>
            <h3>Product 3</h3>
            <img src={course3} alt=""  width={280}/>
        </div>
         <div>
            <h3>Product 4</h3>
            <img src={course4} alt=""  width={330}/>
        </div>
    </div>
    </>)
}
export default Banner