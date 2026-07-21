import { useEffect, useState } from "react"


const Side_Effect = () => {

   //task 1
   const[num,setNum]=useState(0)
   //task 2
 const[name,setName]=useState("")
  //task 3
  const [time,setTime]=useState(0)
  //task 4
  const[data,setData]=useState([])

   //task 1
  const changeButton=()=>{
    setNum(num+1)
  }
   useEffect(()=>{
     console.log("current value: "+num);  
   },[num])
    
  //task 2
  useEffect(()=>{
  document.title=name?"welcome"+(name):"welcome"
  },[name])
  //task 3
  
  useEffect(()=>{
  const interval=setInterval(()=>{
     setTime((prev)=>prev+1)
  },1000)
  return ()=>clearInterval(interval)
  },[])
   
  //task 4
  const getDatas=async()=>{
    const getData=await fetch("https://jsonplaceholder.typicode.com/users")
    const putData=await getData.json()
   
    
   setData(putData)
    
  }
  useEffect(()=>{
   getDatas()
  },[])
 
  return (
    <>
    <div>
      <h1>Task 1</h1>
      <h1>{num}</h1>
      <button className="bg-red-500 p-1" onClick={changeButton}>Increament</button>
    </div>
    <div>
      <h1>Task 2</h1>
      <input type="text" placeholder="Enter a Name" onChange={(e)=>setName(e.target.value)} value={name}/>
    </div>
    <div>
      <h1>Task 3</h1>
    <h1>{time}</h1>
    </div>
    <div>
      <h1>Task 4</h1>
      {data.map((e,i)=>(
        <div key={e.id}>
          <h1>{e.name}</h1>
          <p>{e.email}</p>
        </div>
      ))}
    </div>
    </>
  )
}

export default Side_Effect