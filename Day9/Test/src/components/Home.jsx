import React from 'react'
import Studentcard from './Studentcard'
import Employee from './Employee'
import { Route, Routes } from 'react-router-dom'
import Product from './Product'
import Movies from './Movies'
import Student_list from './Student_list'

const Home = () => {
  //task 1
    const name="Lokesh"
    const age=21
    const course="FS Java"
  //task 2
    const emp={name:"Lokesh",email:"lokeshj022004@gmail.com",dept:"BE-CSE"}
  //task 3
     const proname="Laptop"
    const price=40000
    const status="Available"

    //task 4
     const arr=["vijay","Ajith","suriya"]

     //task 5
     const obj=[{id:1,name:"Lokesh",course:"FS Java"},
      {id:2,name:"Rahul",course:"FS python"},
      {id:3,name:"Gokul",course:"FS mern"},
      {id:4,name:"Arun",course:"FS .net"},
     ]
  return (
    <>
    <Studentcard names={name} ages={age} courses={course}/>
    <Employee detail={emp}/>
    <Product prosname={proname} prosprice={price} prostatus={status}/>
    <Movies actor={arr}/>
    <Student_list list={obj}/>
    </>
  )
}

export default Home