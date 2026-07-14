import Studentcard from "./Studentcard"


const Employee = ({detail}) => {
  return (
   <>
  
   <div className="bg-amber-300">
   <h1>{detail.name}</h1>
   <h1>{detail.email}</h1>
   <h1>{detail.dept}</h1>
   </div>
   </>
  )
}

export default Employee