import React from "react";

const Dummy = ({ datas }) => {
  return (
    <>
      {datas.map((student) => (
        <div key={student.id}>
          <h2>ID : {student.id}</h2>
          <h2>Name : {student.name}</h2>
          <h2>Course : {student.course}</h2>
          
        </div>
      ))}
    </>
  );
};

export default Dummy;