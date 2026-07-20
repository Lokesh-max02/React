import React, { useState } from 'react'

const Form = () => {
   //task 1
  const[name,setName]=useState("")
   const[show,setShow]=useState("")
  //task 2
  const[stuname,setStuName]=useState("")
  const[stucourse,setCourse]=useState("")
  const[getname,setGetName]=useState("") 
  const[getcourse,setGetCourse]=useState("")

  //task 3
  const [employee,setEmployee]=useState({name:"",Dept:"",salary:""})
   const[result,setResult]=useState({name:"",Dept:"",salary:""})

   //task 4
 const [product,setProduct]=useState({name:"",price:"",category:""})
 const [detail,setDetail]=useState({name:"",price:"",category:""})

 //task 5
 const[member,setMember]=useState({name:"",email:"",city:"",age:""})
  const[profiles,setProfiles]=useState({name:"",email:"",city:"",age:""})

const profile=(e)=>{
 setMember({...member,[e.target.name]:e.target.value})
}

const handleProfile=()=>{
  setProfiles(member)
}

//task 4
const changeEmployee=(e)=>{
setProduct({...product,[e.target.name]:e.target.value})
}
const OnChange=()=>{
  setDetail(product)
}

//task 3
  const handleeChange=(e)=>{
    setEmployee({...employee,[e.target.name]:e.target.value})
  }
const clickButton=()=>{
  setResult(employee)
}


//task 2

   const buttonClick=()=>{
    setGetName(stuname)
    setGetCourse(stucourse)
   }

//task 1
   const changeName=(e)=>{
    setName(e.target.value)
   }

   const buttonChange=()=>{
    setShow(name)
    setName("")
   }

  return (
   <>
   <h1>Task 1</h1>
   <h1>{show}</h1>
   <input type="text" placeholder='Enter a Name' onChange={changeName} value={name} /><br/>
   <button className='bg-red-500 p-1 mb-6' onClick={buttonChange}>Click</button>
    
    <div>
      <h1>Task 2</h1>
      <h1>Name: {getname}</h1>
      <h1>Course: {getcourse}</h1>
      <input type="text" placeholder='Enter a Name' onChange={(e)=>setStuName(e.target.value)} value={stuname}/><br/>
      <input type="text" placeholder='Enter a Course' onChange={(e)=>setCourse(e.target.value)} value={stucourse} /><br/>
      <button className='bg-red-500 p-1 mb-6' onClick={buttonClick}>Submit</button>
    </div>
   
   <div>
    <h1>task 3</h1>
    <input type="text"placeholder='enter a name'onChange={handleeChange} name='name' value={employee.name}/><br/>
    <input type="text"placeholder='enter a Department'onChange={handleeChange} name='Dept' value={employee.Dept}/><br/>
     <input type="number"placeholder='enter a salary'onChange={handleeChange} name='salary' value={employee.salary} /><br/>
     <button className='bg-red-500 p-1 mb-6' onClick={clickButton}>Submit</button>
     <h2>Employee Details</h2>
      <h3>Name: {result.name}</h3>
      <h3>Department: {result.Dept}</h3>
      <h3>Salary: ₹{result.salary}</h3>
   </div>

   <div>
    <h1>Task 4</h1>
    <input type="text" placeholder='Enter a Name' onChange={changeEmployee} name="name" value={product.name} /><br/>
    <input type="text" placeholder='Enter a price' onChange={changeEmployee} name="price" value={product.price} /><br/>
    <input type="text" placeholder='Enter a category' onChange={changeEmployee} name="category" value={product.category} /><br/>
    <button className='bg-red-500 p-1 mb-6' onClick={OnChange}>submit</button>
    <div className='bg-gray-300 p-5 w-80 '>
    <h2> Details</h2>
      <h3>Product Name: {detail.name}</h3>
      <h3>price: {detail.price}</h3>
      <h3>category :{detail.category}</h3>
   </div>
   </div>

   <div>
    <h1>task 5</h1>
    <input type="text" placeholder='Enter a name' onChange={profile} name="name" value={member.name} /><br/>
    <input type="Email" placeholder='Enter a Email' onChange={profile} name="email" value={member.email} /><br/>
    <input type="text" placeholder='Enter a city' onChange={profile} name="city" value={member.city} /><br/>
    <input type="number" placeholder='Enter a age' onChange={profile} name="age" value={member.age} /><br/>
    <button className='bg-red-500 p-1 mb-6' onClick={handleProfile}>click</button>
    <div className='bg-blue-600 p-3 flex justify-center'>
    <div className='bg-white p-6 '>
      <h1 className='text-xl mb-3 font-bold'>User Profile</h1>
      <h3>Name :{profiles.name}</h3>
      <h3>Email :{profiles.email}</h3>
      <h3>City :{profiles.city}</h3>
      <h3>Age :{profiles.age}</h3>
    </div>
    </div>
   </div>
   </>
  )
}

export default Form