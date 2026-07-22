import React, { useState } from "react";
import styles from "./sidebar.module.css";
import { ContactRound, LayoutDashboard, Sidebar } from "lucide-react";
export default function LeftSidebar() {
  const [open, setOpen] = useState(false);
  const handleSidebar = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <Sidebar onClick={handleSidebar} />
      {open ? (
        <div className={styles.sidebarCont}>
          <div className={styles.contents}>
          <div className={styles.dashboard}>
             <a className={styles.innerDash} href="/student"><LayoutDashboard/>Dashboard</a></div>
          <div  className={styles.user}>
            <a className={styles.innerInvite} href="/invite-user"><ContactRound/>Invite user</a></div>
        
         
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
