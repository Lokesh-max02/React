
import Primitive from "./component/Primitive"
import Non_dummy from "./component/Non_dummy"
import Array from "./component/Array"


const App = () => {
  const obj={Name : "Rahul",
Email :" rahul@gmail.com",
City : "Chennai",
Experience :" 3 Years"}
  return (
    <>
    <Primitive/>
    <Non_dummy detail={obj}/>
    <Array/>
    </>
  )
}

export default App