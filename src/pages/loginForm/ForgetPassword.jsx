import React, { useState } from 'react'
import styles from './forgetPassword.module.css'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import LoadingSpinner from '../../components/studentDisplay/LoadingSpinner'
export default function ForgetPassword({handleClick}) {
    const [email , setEmail] = useState("")
    const [loading , setLoading] = useState(false)
      const [clicked, setClicked] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            setLoading(true)
        const response = await axios.post("http://localhost:8000/auth/forgetPassword" , 
        {email})
        //   console.log(response.data.message)
        // console.log(response.data.email)
        console.log(response.data.message)
        console.log(response.data.email)
        console.log("data has been submited")
         toast.success("A reset email has been sent to your inbox!", {
               position:"top-center"
             })
        }catch(error){
            console.log(error)
             toast.error("there was an error", {
               position:"top-center"
             })
            // console.log(error.response.message)
        }finally{
            setLoading(false)
            setEmail("")
            setClicked(false)
        }
    }
  return (
    <div>
        <ToastContainer/>
          <div className={styles.forgetCont}>
            <h1>Forget password</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input 
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
                
                <button  type='submit' >Done</button>
            </form>
        </div> 
      
        {loading ? <LoadingSpinner/> : ""}
    </div>
  )
}
