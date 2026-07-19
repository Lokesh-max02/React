import React, { useState } from 'react'

const Array_obj = () => {
    const[detail,setDetail]=useState({name:"Lokesh",course:"React"})
    const [price,setPrice]=useState({name:"Mobile",price:20000})
    const [hero,setHero]=useState(["vijay","ajith","suriya"])
   const [num,setNum]=useState([10,20,30,40])
   const[fruit,setFruit]=useState(["Apple","Orange"])
   const[fruits,setFruits]=useState(["Apple","Orange","Mango"])
   const[student,setStudent]=useState([{id:1,name:"Lokesh"},
    {id:2,name:"Rahul"}
   ])

   const[students,setStudents]=useState([{id:1,course:"React"},
    {id:2,course:"Node"}
   ])
   
   const [item,setItem]=useState([{id:1,name:"Laptop"}])

   const [emp,setEmp]=useState([{id:1,name:"Lokesh"},
    {id:2,name:"Rahul"},
    {id:3,name:"Karthick"}
   ])


   const deleteEmp=()=>{
    setEmp(emp.filter((e)=>e.name!=="Rahul"))
   }
const updateObject=()=>{
   
    setItem([...item,{id:2,name:"Mobile"}])
}

const updateStudents=()=>{
    setStudents(students.map((e)=>e.id===1?{...e,course:"MERN"}:e))
   }

   const updateStudent=()=>{
    setStudent(student.map((e)=>e.id===1?{...e,name:"Karthick"}:e))
   }
   
    const changeText =()=>{
    setDetail({...detail,course:"MERN"})
   }

   const changePrice=()=>{
    setPrice({...price,price:"25000"})
   }

   const changeHero=()=>{
    hero[1]="Sk"
    setHero([...hero])
   }

   const changeNum =()=>{
    num[2]=100
    setNum([...num])
   }

   const changeFruit =()=>{
    fruit.push("Mango")
    setFruit([...fruit])
   }

   const removeFruit=()=>{
    fruits.pop("Mango")
 setFruits([...fruits])
   }
  return (
    <>
    <div>
        <h1>TasK 1</h1>
        <h1>{detail.course}</h1>
         <h1>{detail.name}</h1>
        <button className='bg-red-600 p-1 rounded mb-6' onClick={changeText}>Click</button>
    </div>
    <div>
        <h1>Task 2</h1>
        <h1>{price.name}</h1>
         <h1>{price.price}</h1>
        <button className='bg-green-500 p-1 rounded mb-6' onClick={changePrice}>Click to change</button>
    </div>
    <h1>TasK 3</h1>
        <h1>{hero.join("-")}</h1>
         
        <button className='bg-orange-600 p-1 rounded mb-6' onClick={changeHero}>Click</button>
     <div>
        <h1>TasK 4</h1>
        
         <h1>{num.join()}</h1>
        <button className='bg-pink-600 p-1 rounded mb-6' onClick={changeNum}>Click</button>
     </div>

     <div>
        <h1>TasK 5</h1>
        
         <h1>{fruit.join()}</h1>
        <button className='bg-gray-800 text-white p-1 rounded mb-6' onClick={changeFruit}>Change fruits</button>
     </div>
     <div>
        <h1>Task 6</h1>
         <h1>{fruits.join()}</h1>
        <button className='bg-gray-800 text-white p-1 rounded mb-6' onClick={removeFruit}>Remove fruits</button>
     </div>

     <div>
        <h1>Task 7</h1>
        <h1>{student.map((e,i)=>(
            <div>
                <h1>id: {e.id}</h1>
                <h1>Name : {e.name}</h1>
                
            </div>
            
        ))}</h1>
        <button className='bg-blue-800 text-white p-1 rounded mb-6' onClick={updateStudent}>click</button>
     </div>
     <div>
        <h1>Task 8</h1>
        <h1>{students.map((e,i)=>(
            <div>
                <h1>id: {e.id}</h1>
                <h1>course : {e.course}</h1>
                
            </div>
            
        ))}</h1>
        <button className='bg-black text-white p-1 rounded mb-6' onClick={updateStudents}>click</button>
     </div>
      <div>
        <h1>Task 9</h1>
        <h1>{item.map((e,i)=>(
            <div>
                <h1>id: {e.id}</h1>
                <h1>Name : {e.name}</h1>
                
            </div>
            
        ))}</h1>
        <button className='bg-blue-800 text-white p-1 rounded mb-6' onClick={updateObject}>click</button>
     </div>
      <div>
        <h1>Task 10</h1>
        <h1>{emp.map((e)=>(
            <div>
                <h1>id: {e.id}</h1>
                <h1>Name : {e.name}</h1>
                
            </div>
            
        ))}</h1>
        <button className='bg-blue-800 text-white p-1 rounded mb-6' onClick={deleteEmp}>click</button>
     </div>
    </>
  )
}

export default Array_obj