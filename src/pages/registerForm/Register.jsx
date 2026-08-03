import React, { useState, useEffect } from "react";
import styles from "./register.module.css";

import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useSearchParams } from "react-router";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const [userRoleData, setUserRoleData] = useState("");
  const [searchParams] = useSearchParams();
  const userIdValue = searchParams.get("id");
  
  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/invite-user?id=${userIdValue}`,
        );
        setEmail(response.data.email);
        setUserRoleData(response.data.userRole);
      } catch (error) {
        toast.error("there was an eror");
        console.log(error);
      }
    };
    if (userIdValue) {
      fetchInvite();
    }
  }, [userIdValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const registerData = { name, email, password, userRoleData };
    axios
      .post("http://localhost:8000/auth/register", registerData)
      .then((response) => {
        setEmail("");
        setName("");
        setPassword("");
        toast.success("student has been registered successfully", {
          position: "top-center",
        });
        console.log(registerData);
      })
      .catch((error) => {
        const data = error.response.data;
        console.log(data)
        console.log(error)
        if (data.errors) {
          //errors[0] is an array
          data.errors.forEach((err) => {
            toast.error(err.msg);
          });
        } else {
          toast.error(data.message || data.error);
        }

        // console.log(error.response.data.errors[1].msg)
        console.log(error.response.data.errors);
        console.log(error.response.data);
      });
  };

  return (
    <div className={styles.registerCont}>
      <div className={styles.register}>
        <div className={styles.heading}>Register</div>
        <form onSubmit={() => handleSubmit()}>
          <div>
            <div>
              <label>Name*</label>
              <input
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          

          <div>
            <label>Email*</label>
            <input
              placeholder="example@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              
            />
          
          </div>
            <div>
              <label>Role</label>
              <input  placeholder="role" value={userRoleData} />
            </div>
        
          <div>
            <label>Password*</label>
            <input
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button onClick={handleSubmit}>Register</button>
          {/* here works when added but not when onSubmit mabey */}
          <ToastContainer />
        </form>
        <div>
          Already Registered? <a href="/">Login here</a>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
