import React, { useState } from "react";
import { UserCircle2, LogOut, Settings } from "lucide-react";
import styles from "./profile.module.css";
import { useNavigate } from "react-router";
import { clearAccessToken } from "../../auth";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const profileOptions = [
    { id: 1, name: "Logout", icon: <LogOut /> },
    { id: 2, name: "Settings", icon: <Settings /> },
  ];
  const [modal, setModal] = useState(false);
  const [option, setOption] = useState(false);

  const handleOptions = (option) => {
    setOption((prev) => !prev);
    // navigate("/");
  };
const handleLogout = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8000/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    console.log(response.data.message)

    clearAccessToken();
    navigate("/");
    
  } catch (err) {
    console.log(err);
  }
};
  const handleModal = () => {
    setModal((prev) => !prev);
    console.log("i was clicked");
  };

  return (
    <div className={styles.logoutCont}>
      <UserCircle2
        onClick={handleOptions}
        width={50}
        height={30}
        cursor="pointer"
      />
      {option ? (
        <div className={styles.options}>
          <div onClick={() => handleModal()} className={styles.option}>
            Logout
          </div>
        </div>
      ) : (
        ""
      )}

      {modal ? (
        <div className={styles.logoutModal}>
          <div className={styles.logoutInner}>
            <p>Are you sure you want to log out?</p>
            <div className={styles.logoutBtns}>
              <button onClick={handleLogout} className={styles.logbtns}>
                Logout
              </button>
              <button onClick={handleModal} className={styles.cancelbtns}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
