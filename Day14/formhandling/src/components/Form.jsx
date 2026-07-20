import React, { useState } from 'react';

const Form = () => {

  //task 1
  const [data, setData] = useState("");
  const [change, setChange] = useState([]);
 //task 2
 const [stud,setStud]=useState({name:"",course:""})
 const [students,setStudents]=useState({name:"",course:""})

 //task 3
  const [tech, setTech] = useState("");
  const [changes, setChanges] = useState([]);


 //Task-4
    const [inputStudent,setInputStudent]=useState("")
    const [student,setStudent]=useState([])


  //task 5
  const[product,setProduct]=useState([{name:"",price:""}]) 
   const [detail,setDetail]=useState([{name:"",price:""}])

  //task 1
  const changeName = (e) => {
    setData(e.target.value);
  };

  const summit = (e) => {
    e.preventDefault();

    setChange([...change, data]);
    setData("");
  };

  //task 2
const studentDetail=(e)=>{
  setStud({...stud,[e.target.name]:e.target.value})
}
const changeStudent=()=>{
  setStudents(stud)
}

//task 3
  const changeTech = (e) => {
    setTech(e.target.value);
  };

  const clickChange = (e) => {
    e.preventDefault();

    setChanges([...changes, tech]);
    setTech("");
  };

//task 4
 const submitted = (e) => {
  e.preventDefault();

  setStudent([...student, inputStudent])
  setInputStudent("")
}




  //task 5
 const getDetail=(e)=>{
  setProduct({...product,[e.target.name]:e.target.value})
 }

 const summitButton=(e)=>{
  e.preventDefault()
  setDetail([...detail,product])
 }

 
  return (
    <>
      <form>
        <h1>Task 1</h1>
        {change.map((item, index) => (
          <h2 key={index}>{item}</h2>
        ))}

        <input type="text" value={data} onChange={changeName} placeholder="Enter a name" />
         <button onClick={summit}>Click</button>
      </form>
      
       <div>
      <h1>Task 2</h1>
      <h1>Name: {students.name}</h1>
      <h1>Course: {students.course}</h1>
      <input type="text" placeholder='Enter a Name' onChange={studentDetail} value={stud.name} name="name"/><br/>
      <input type="text" placeholder='Enter a Course' onChange={studentDetail} value={stud.course} name="course" /><br/>
      <button className='bg-red-500 p-1 mb-6' onClick={changeStudent}>Submit</button>
    </div>


    <form>
        <h1>Task 3</h1>
        {changes.map((item, index) => (
          <h2 key={index}>{item}</h2>
        ))}

        <input type="text" value={tech} onChange={changeTech} placeholder="Enter a name" />
         <button onClick={clickChange}>Click</button>
      </form>

    <div>
        <form>
            <h1>Task-4</h1>
          {student .map((e, i) => (
          <h2 key={i}>{e}</h2>
        ))}
            <input type="text" placeholder='Enter Student Name' value={inputStudent}  onChange={(e)=>setInputStudent(e.target.value)}/>
            <button onClick={submitted}>Click Add Student</button>
        </form>
    </div>

      <form>
        <h1>Task 5</h1>
        <input type="text" placeholder='Enter a Name' onChange={getDetail} value={product.name} name="name"/>
        <input type="number" placeholder='Enter a price' onChange={getDetail} value={product.price} name="price"/>
        <button onClick={summitButton}>Add product</button>
        <h1>{detail.map((e,i)=>(
          <div key={i+1}>
            <h1>{e.name}-{e.price}</h1>
          </div>
        ))}</h1>
      </form>
    </>
  );
};

export default Form;