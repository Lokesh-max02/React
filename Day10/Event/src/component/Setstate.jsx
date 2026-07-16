import React, { useState } from "react";

const Setstate = () => {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState(false);

  const clicks = () => {
    setCount(count + 1);
  };

  return (
    <>
      <div  >
        <h1>Task- 1</h1>
        <h1>Count: {count}</h1>
        <button  className="bg-amber-800 text-white p-1 mb-4" onClick={clicks}>Click</button>
      </div>

      <div>
        <h1>Task- 3</h1>
        <h1>{logs ? "Welcome User" : "Please Login"}</h1>

        <button   className="bg-red-500 text-white p-1 mb-4" onClick={() => setLogs(true)}>
          Login
        </button>
      </div>
    </>
  );
};

export default Setstate;