import React, { useState } from "react";
import styles from "./register.module.css";

import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const [messageError , setMessageError] = useState("")
  const [emailError, setEmailError] = useState("")

  
const handleSubmit = (e) => {
  console.log("")
    e.preventDefault()
      const registerData = {name , email , password}
    axios.post("http://localhost:8000/auth/register", registerData)
      .then((response) => {
      setEmail("")
      setName('')
      setPassword("")
          toast.success("student has been registered successfully", {
       position:"top-center"
     })
        console.log(registerData)
      })
      .catch((error) => {
     const data = error.response.data
     if(data.errors){ //errors[0] is an array
      data.errors.forEach((err) => {
        toast.error(err.msg)
      })
     }else{
      toast.error(data.message || data.error)
     }
    
        // console.log(error.response.data.errors[1].msg)
         console.log(error.response.data.errors)
         console.log(error.response.data);
      
      })
  }
 


  return (
    <div className={styles.registerCont}>
       <div className={styles.register}>
        
      <div className={styles.heading}>Register</div>
      <form onSubmit={() => handleSubmit()}>
       
        <div>
          <label>Name*</label>
          <input placeholder="Enter name" 
           value={name}
          onChange={(e) => setName(e.target.value)}
          
          required/>
        </div>
        {/* <div className={styles.errorMessage}>{messageError}</div> */}
        <div>
          <label>Email*</label>
          <input placeholder="example@gmail.com"
          type="email"
           value={email}
          onChange={(e) => setEmail(e.target.value)}
          
          required/>

        </div>
             {/* <div className={styles.errorMessage}>{emailError}</div> */}
        <div>
          <label>Password*</label>
          <input placeholder="Enter password"
           value={password}
          onChange={(e) => setPassword(e.target.value)}
          
          required/>
        </div>


        <button onClick={handleSubmit}>Register</button> 
        {/* here works when added but not when onSubmit mabey */}
         <ToastContainer/>
      </form>
      <div>Already Registered? <a href="/">Login here</a></div>
        {error && 
        <div className={styles.error}>{error}</div>}
        
    </div>
    </div>
   
  );
}
