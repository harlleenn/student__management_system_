import React, { useState } from "react";
import styles from "./popup.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
export default function Popup() {
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/invite-user", {
        email,
        userRole,
      });
      toast.success("A link has been sent to your email!", {
        position: "top-center",
      });
      console.log(response.data.message);
      
    } catch (error) {
      console.log(error);
      toast.error("There was an error please try again", {
        position: "top-center",
      });
    }
    console.log("i was clciked");
    setEmail("");
    setUserRole("");
  };

  return (
    <div>
      <ToastContainer />
      <div className={styles.popupCont}>
        <form className={styles.popupForm} onSubmit={handleInvite}>
          <input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.options}>
            <label htmlFor="admin">Admin</label>
            <input
              type="radio"
              value="Admin"
              name="userRole"
              id="admin"
              checked={userRole === "Admin"}
              required
              onChange={(e) => setUserRole(e.target.value)}
            />
            <label htmlFor="viewer">Viewer</label>
            <input
              type="radio"
              value="Viewer"
              name="userRole"
              id="viewer"
              checked={userRole === "Viewer"}
               required
              onChange={(e) => setUserRole(e.target.value)}
            />
            <label htmlFor="editor">Editor</label>
            <input
              type="radio"
              value="Editor"
              name="userRole"
              id="editor"
              checked={userRole === "Editor"}
               required={true}
              onChange={(e) => setUserRole(e.target.value)}
            />
          </div>

          <button type="submit">Done</button>
        </form>
      </div>
    </div>
  );
}
