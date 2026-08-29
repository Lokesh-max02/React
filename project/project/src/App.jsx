import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar";
import News1 from "./component/News1";
import Technology from "./component/Technology";

function App() {
  return (
    
      <>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/News1" element={<News1 />} />
      </Routes>
      <Technology/>
      </>
     
   
  );
}

export default App;