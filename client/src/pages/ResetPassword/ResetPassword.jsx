
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./resetPassword.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [show, setShow] = useState(true)
  const handleShow =() => {
    setShow((prev) => !prev)
  }
  const handleUpdatedPass = async (e) => {
    e.preventDefault();
console.log("button clicked")

    if (newPass !== confirmPass) {
      setMessage("Passwords do not match, try again");
      return; // stop here — don't call the backend with mismatched passwords
    }

    try {
      const response = await axios.post("http://localhost:8000/auth/reset-password", {
        email,
        newPassword: newPass,
      });
      setMessage(response.data.message);
      setNewPass("");
      setConfirmPass("");
       
         toast.success("password has been updated", {
            position:"top-center"
          })
          setTimeout(() => {
              navigate("/")
              console.log("i have naviagted")
          },2000)
      ;
       
    } catch (error) {
        const data = error.response.data;
            if (data.errors) {
              data.errors.forEach((err) => {
                toast.error(err.msg);
              });
            }
                console.log(error.response.data.errors[0].msg);
      console.log(error);
      
    }
  };

  return (
  
    <div className={styles.resetCont}>
        <ToastContainer/>
        <div className={styles.resetForm}>
      <h1>Reset your password</h1>
      <form onSubmit={handleUpdatedPass}>
        <label>Enter new password</label>
        <div className={styles.passwordInputCont}>
            <input
            type={show ? "text" : "password"}
          placeholder="Enter new password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
         <div className={styles.passwordHide}>
        {show ? <Eye width={20} onClick={handleShow}/> : <EyeOff width={20} onClick={handleShow}/> }
       </div>
        </div>
      
        <label>Confirm password</label>
        <div className={styles.passwordInputCont}>
            <input
           type={show ? "text" : "password"}
          placeholder="Confirm password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
          <div className={styles.passwordHide}>
        {show ? <Eye width={20} onClick={handleShow}/> : <EyeOff width={20} onClick={handleShow}/> }
       </div>
        </div>
      
        <button type="submit">Done</button>
      </form>
      {message}
    </div>
    </div>
  
  );
}
