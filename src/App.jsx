import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatbotPage from './chatbot/chatbot.jsx';
import LoginPage from './loginpage.jsx';
import LogoutPage from './logoutpage.jsx';
import SignupPage from './signup/signup.jsx';
import EditProfilePage from './editprofilepage/editprofilepage.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<ChatbotPage/>}/>
        <Route path="/loginpage" element={<LoginPage/>}/>
        <Route path="/logoutpage" element={<LogoutPage/>}/>
        <Route path="/signuppage" element={<SignupPage/>}/>
        <Route path="/editprofilepage" element={<EditProfilePage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
