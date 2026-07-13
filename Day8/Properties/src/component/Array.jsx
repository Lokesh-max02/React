import Dummy from "./Dummy";

const Array = () => {
  const details = [
    { id: 1, name: "Lokesh", course: "Fs" },
    { id: 2, name: "Rahul", course: "Fs Java" },
    { id: 3, name: "Gokul", course: "Fs Python" },
    { id: 4, name: "John", course: "Fs Mern" },
    { id: 5, name: "Mick", course: "Fs .NET" }
  ];

  return (
    <>
      <Dummy datas={details} />
    </>
  );
};

export default Array;