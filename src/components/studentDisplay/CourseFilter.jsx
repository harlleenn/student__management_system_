import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from './courseFilter.module.css'
export default function CourseFilter({ filterValue, setFilterValue , courseSelect}) {
 


  return (
    <div className={styles.dropCont}>
      <div className={styles.dropdownCont}>
        <label htmlFor="options" className={styles.labelCourse}>Choose a course: </label>
        <select
          id="options"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className={styles.options}
        >
          <option value="" disabled>
            -- Select --
          </option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="Btech">Btech</option>
          <option value="Bcom">Bcom</option>
          <option value="Bba">Bba</option>
          <option value="">Clear</option>
        </select>
        <button onClick={courseSelect} className={styles.done}>Done</button>
        {filterValue}
      </div>
    </div>
  );
}
