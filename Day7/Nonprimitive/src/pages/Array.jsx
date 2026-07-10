
const course="React js"
const price=50000
const discount=5000
const isActive=false
const profileImage=null
let email;



let arr=["vijay","Ajith","suriya","sk","Dhanush"]
const Tasks = () => {

    const getCompanyname=()=>{
        return Google;
    }
  return (
   <>
{/* tassk1 */}
   <div>
    <h1>{course}</h1>
   </div>

{/* task2 */}
<div>
<p>{price}</p>
<p>{discount}</p>
</div>

{/* task3 */}

<div>
    <h1>{isActive?"Welcome user":"please login"}</h1>
</div>

{/* task4 */}

<div>
    <h2>{profileImage ?? <p>No Image is Found</p>}</h2>
</div>

{/* task5 */}

<div>
    <h2>{email ?? <p>Email Not Available</p>}</h2>
</div>

{/* task6 */}

<div>
    
</div>


{/* task7 */}
<div>
   
   <h1> {arr.map((e,i)=>(
    
        <h2 key={i}>{e}</h2>
      
    ))}</h1>
    
    <div>
        <h1>{arr.filter((e)=>e%2===0)}</h1>
    </div>
    
</div>
   </>
  )
}

export default Tasks