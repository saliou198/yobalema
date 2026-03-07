
import './App.css';
import NavBar from './navBar';
import LoginForm from './loginPage';
import SignupForm from './signupPage';
import Home from './home';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {


  return (
    <>
   
    <BrowserRouter>
     <NavBar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
