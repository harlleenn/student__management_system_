import React from 'react'
import { useNavigate } from 'react-router'
import styles from './logoutPage.module.css'
export default function LogoutPage() {
    const navigate = useNavigate()
    const handleLogin = () => {
        navigate("/")
    }
  return (
    
            <div className={styles.logoutCont}>
        <div className={styles.logout}>
            <span>Please click here to sign in</span>
            <button onClick={handleLogin} className={styles.signInBtn}>Sign in</button>
        </div>
    </div>

  )
}
