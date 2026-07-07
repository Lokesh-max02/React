import React from 'react'
import "./Report.css"
const cards = () => {
 
  
let info=[{id:1,Name:"vijay",designation:"FS Java"},
  {id:2,Name:"Gokul",designation:"FS python"},
  {id:3,Name:"Rahul",designation:"FS Mern"},
  {id:4,Name:"Ajith",designation:"FS Java"}
]
  return (
   <>
   <div className='container'>
    <h1>Team Members</h1>
    <div className='team'>
      {info.map((member)=>(
    <div className='card' key={member.id}>
        <h2>{member.Name}</h2>
        <p>{member.designation}</p>
        </div>
      )
      )}
   
   </div>
   </div>
   </>
)
}



export default cards