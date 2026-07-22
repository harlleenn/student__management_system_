import './App.css'
import StudentData from './components/studentDisplay/StudentData'
import { BrowserRouter, Routes, Route } from "react-router"
import Login from './pages/loginForm/Login'
import Register from './pages/registerForm/Register'
import PrivateRoutes from './PrivateRoute'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'  
import axios from 'axios'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import ForgetPassword from './pages/loginForm/ForgetPassword'
import InviteUser from './pages/inviteUser/InviteUser'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

function App() {
  


  // useEffect(() => {
  //   const fetchCSRFToken = async () => {
  //     const res = await axios.get("/api/csrf-token") // jo defined as res.json({csrfToken : req.csrfToken})
  //     axios.defaults.headers.common["X-CSRF-Token"] = res.data.csrfToken
  //   }
  //   fetchCSRFToken()
  // }, [])


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes  />}>
            <Route path='/student' element={<StudentData/>} />
          </Route>
          <Route path='/' element={<Login  />} />
          <Route path='/register' element={<Register />} />
          <Route path='/reset-password' element={<ResetPassword/>}/>
          <Route path='/forget-password' element={<ForgetPassword/>}/>
            <Route path='/invite-user' element={<InviteUser/>}/>
            <Route path ='/invite-user-register' element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App