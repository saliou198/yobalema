
import './App.css';
import NavBar from './navBar';
import Form from './loginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {


  return (
    <>
    
    <BrowserRouter>
    <NavBar />
      <Routes>
        <Route path="/login" element={<Form />} />
        <Route path="/" element={<div className="home"></div>} />
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
