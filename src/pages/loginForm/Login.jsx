import React from "react";
import styles from "./login.module.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { setAccessToken } from "../../auth";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "../ResetPassword/ResetPassword";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [clicked, setClicked] = useState(false)
  const navigate = useNavigate();
const handleClick = () => {
  setClicked((prev) => !prev)
  console.log("i was clciked")
}
  const handleSubmit = (e) => {
    e.preventDefault();


    axios
      .post("http://localhost:8000/auth/login", { // once i ave revcied the reposnse object i will have reeponse.data.token which is in the login vala
        email,
        password,
      })
      .then((response) => {
        setAccessToken(response.data.token)
        navigate("/student");
        console.log(response.data);
        console.log(response.data.token, "this is the access Tokenn")
      })
      .catch((error) => {
        setError(error.response.data.message)
        console.log(error);
         console.log(error.response.data.message)
      });
  };
  return (
    <div className={styles.loginCont}>
        <div className={styles.login}>
      {/* {error ? <div>
        {error}
      </div> : ""} */}
      <div className={styles.message}>
        Welcome Back
        <div>Login to your Student Acc</div>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Email</label>
          <input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button>Login</button>
      </form>
      {error && <div className={styles.loginError}>{error}</div>}
<div className={styles.forgetPass}>
     <div>
        Don't have an account? <a href="/register">Sign up here</a>
      </div>
      <div className={styles.forgetPassCont}>
         <a href="/forget-password" className={styles.forgetLink}><button onClick={handleClick}>Forget Password</button></a> 
      </div>
    
</div>
   
    </div>
    {/* {clicked? <ForgetPassword handleClick={handleClick}/> :"" } */}
  
    </div>
  
  );
}
