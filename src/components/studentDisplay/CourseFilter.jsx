import React, { useEffect, useState } from "react";
import axios from "axios";
export default function CourseFilter({ filterValue, setFilterValue , courseSelect}) {
 


  return (
    <div>
      <div>
        <label htmlFor="options">Choose an option: </label>
        <select
          id="options"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="" disabled>
            -- Select --
          </option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="Btech">Btech</option>
        </select>
        <button onClick={courseSelect}>Done</button>
        {filterValue}
      </div>
    </div>
  );
}
