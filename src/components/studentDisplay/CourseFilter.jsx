import React, { useState } from 'react'
import axios from 'axios'
export default function CourseFilter() {
    const [filterValue , setFilterValue] = useState("")

const handleFilter = async () => {
    try{
        const response = await axios.post("http://localhost:8000/course-selection",
    {course:filterValue}
)
console.log(response.data.message)
console.log("i was clciked")
    }catch(error) {
        console.log(error)
    }
 
console.log("i am clicked")
}
  return (
    <div>
        <div>
             <label htmlFor="options">Choose an option: </label>
      <select id="options" value={filterValue} onChange={(e) =>setFilterValue(e.target.value) }>
        <option value="" disabled>-- Select --</option>
        <option value="MCA">MCA</option>
        <option value="BCA">BCA</option>
        <option value="Btech">Btech</option>
      
      </select>
        <button onClick={handleFilter}>Done</button>
      {filterValue}
        </div>
    </div>
  )
}
