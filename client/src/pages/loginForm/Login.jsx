import React from "react";
import styles from "./login.module.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { setAccessToken } from "../../auth";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "../ResetPassword/ResetPassword";
import { Eye, EyeOff } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [clicked, setClicked] = useState(false);
  const [show, setShow] = useState(true);
  const [name , setName] = useState("")
  const navigate = useNavigate();

  const { user, setUser , userName , setUserName } = useContext(AuthContext);
  

  const handleClick = () => {
    setClicked((prev) => !prev);
    console.log("i was clciked");
  };
  const handleShow = () => {
    setShow((prev) => !prev);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/auth/login", {
    
        email,
        password,
      })
      .then((response) => {
        setAccessToken(response.data.token);
        console.log(
          response.data.user_info.user_role,
          "this is from nirmaly the res.json",
        );
        setUser(response.data.user_info.user_role);
        setUserName(response.data.user_info.name)
        
        navigate("/student");
      })
      .catch((error) => {
        toast.error(error.response.data.message)
        setError(error.response.data.message);
        console.log(error.response.data.message);
      });
  };
  return (
    <div className={styles.loginCont}>
      <div className={styles.login}>
        <ToastContainer/>
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
            <div className={styles.passwordInputCont}>
              <input
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                      setPassword(e.target.value);
                  setError("")
                }
                
                }
                required
                type={show ? "text" : "password"}
                className={` ${error ? styles.passInput : ""}`}
              />

              <div className={styles.passwordHide}>
                {show ? (
                  <Eye width={20} onClick={handleShow} />
                ) : (
                  <EyeOff width={20} onClick={handleShow} />
                )}
              </div>
            </div>
          </div>

          <button>Login</button>
        </form>
        {/* {error && <div className={styles.loginError}>{error}</div>} */}
        <div className={styles.forgetPass}>
          {/* <div>
            Don't have an account? <a href="/register">Sign up here</a>
          </div> */}
          <div className={styles.forgetPassCont}>
            <a href="/forget-password" className={styles.forgetLink}>
              <button onClick={handleClick}>Forget Password</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
