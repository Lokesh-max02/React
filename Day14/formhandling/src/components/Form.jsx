import React, { useState } from 'react';

const Form = () => {
  const [data, setData] = useState("");
  const [change, setChange] = useState([]);

  const changeName = (e) => {
    setData(e.target.value);
  };

  const summit = (e) => {
    e.preventDefault();

    setChange([...change, data]);
    setData("");
  };

  return (
    <>
      <form>
        {change.map((item, index) => (
          <h2 key={index}>{item}</h2>
        ))}

        <input
          type="text"
          value={data}
          onChange={changeName}
          placeholder="Enter a name"
        />

        <button onClick={summit}>Click</button>
      </form>
    </>
  );
};

export default Form;