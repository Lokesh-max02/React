

const Product = ({prosname,prosprice,prostatus}) => {
   
  return (
    <>
    <div>
        <h1>product: {prosname}</h1>
        <h1>price :{prosprice}</h1>
        <h1>status: {prostatus}
        </h1>
    </div>
    </>
  )
}

export default Product