import img1 from "../assets/1.jpg"
import img2 from "../assets/2.jpg"
import img3 from "../assets/3.jpg"
export const Card = () => {
    return (
        <>
        <h1 className="text-5xl text-center">Events</h1>
        <br/>
        <div className="flex justify-center align-center gap-10">
            <div className="bg-amber-100 w-70 ">
                <img src={img1} alt="" width={300}/>
                <a href="#">07/07/2026|Upcoming Event</a>
                <p>13th Episode - Discovery Series: Understanding the Business Environment in Spain</p>
                <button className="bg-red-500">Add to calender</button>
            </div>
           <div className="bg-amber-100 w-70 ">
                <img src={img2} alt="" width={300}/>
                <a href="#">07/07/2026|Upcoming Event</a>
                <p>SEZ Open House  with MEPZ Officials</p>
               <button className="bg-red-500 mt-9">Add to calender</button>
            </div>
            <div className="bg-amber-100 w-70 ">
                <img src={img3} alt="" width={300}/>
                <a href="#">07/07/2026|Upcoming Event</a>
                <p>12th Episode - Discovery Series: Understanding the Business Environment in Malaysia</p>
                <button className="bg-red-500">Add to calender</button>
            </div>
        </div>

        </>
    )
}
