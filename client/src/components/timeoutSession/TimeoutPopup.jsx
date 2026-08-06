import React, { useEffect, useState } from "react";
import styles from "./timeout.module.css";
import TimerLogout from "./TimerLogout";
import { useNavigate } from "react-router";
export default function TimeoutPopup() {
    const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShowPopup(true);
        console.log("nothing has been touched so i am coming after 5 seconds");
      }, 3000);
    };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
      events.forEach((event) => window.removeEventListener(event, resetTimer));

    };
  }, []);
  const handleCancel = () => {
    navigate("/student")
    setShowPopup(false)
  }

  return (
    <div >

      {showPopup && (
    <div className={styles.timerCont}>
         <div className={styles.timer}>
          <span>Time remaining before you log out: <TimerLogout/></span>
          <div className={styles.timerBtnCont}>
            <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            {/* <button className={styles.logoutBtn}>Logout</button> */}
          </div>
        </div>
    </div>
       
      )}
    
    </div>
  
  );
}
