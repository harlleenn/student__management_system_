
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./resetPassword.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
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
        <input
           type="password"
          placeholder="Enter new password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <label>Confirm password</label>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
        <button type="submit">Done</button>
      </form>
      {message}
    </div>
    </div>
  
  );
}
