import React, { useState } from 'react'

const Task = () => {
    const [hero,setHero]=useState(["vijay","Ajith","Suriya"])
    const [fruit,setFruit]=useState(["Apple","Orange","Suriya"])
    const [obj,setObj]=useState({name:"Lokesh",course:"JS"})
    const [com,setCom]=useState({company:"Google",city:"chennai"})
    const changeHero=()=>{
        hero[1]="SK"
      setHero([...hero])
    }
 

    const changeFruit=()=>{
        fruit[1]="Banana"
        setFruit([...fruit])
    }

    const changeObj=()=>{
        setObj({...obj,course:"React"})
        
        
    }
     const changeCom=()=>{
        setCom({...com,company:"Microsoft"})
       
        
    }
    
    
    return (
    <>
    <div>
        <h1>Task-1</h1>
        <h1>{hero.map((e)=>(
        <h1>{e}</h1>
    ))}</h1>
        <button className='bg-amber-300 p-1 mb-4' onClick={changeHero}>change Hero</button>
    </div>
    <div>
        <h1>Task-2</h1>
        <h1>{fruit.map((e)=>(
        <h1>{e}</h1>
    ))}</h1>
        <button className='bg-red-500 p-1 mb-4' onClick={changeFruit}>Updated Fruits</button>
    </div>
    <div>
        <h1>Task 3</h1>
        <h1>{obj.name}</h1>
         <h1>{obj.course}</h1>
         <button className='bg-amber-700 p-1 mb-4' onClick={changeObj}>Updated course</button>

    </div>
     <div>
        <h1>Task 4</h1>
        <h1>{com.company}</h1>
         <h1>{com.city}</h1>
         <button className='bg-pink-500 p-1 mb-4' onClick={changeCom}>Updated course</button>

    </div>
    </>
  )
}

export default Task