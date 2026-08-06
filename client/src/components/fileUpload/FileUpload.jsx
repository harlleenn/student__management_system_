import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function FileUpload({studentId}) {
    const [files, setFiles] = useState(null)
    const [message , setMessage] = useState("")
   const handleFileChange = (e) => {
    if(e.target.files){
        setFiles(e.target.files[0])
       
    }
     console.log(`studentId is${studentId}`)
   }
  

   const handleUploadFile = async () => {
    if(!files) return ;
     const formData = new FormData()
   formData.append("image" , files)
    formData.append("studentId" , studentId)
    console.log(files)
    try{
        
        const response =  await axios.put(`http://localhost:8000/students/${studentId}/image`,
            formData,
    )
     setMessage(response.data.message)
     console.log(response.data.message)

     toast.success("File has been successfully uploaded", {
             position: "top-right",
             closeButton: false,
             autoClose: 2000,
             progress: false,
           });
  
    }catch(error) {
        console.log(error.message)

        
    }

    
   }

  return (
    <div>
        <input type='file' onChange={handleFileChange}/>
        {files && <button onClick={() => handleUploadFile()}>Upload image </button>}
        {message && <div>{message}</div>}
    </div>
  )
}
