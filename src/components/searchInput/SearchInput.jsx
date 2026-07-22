import React, { useState } from 'react'
import styles from './searchInput.module.css'
export default function SearchInput({query,setQuery}) {

    
  return (
    <div className={styles.inputContainer}>
        <input placeholder='search'
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        />
        { <div>{query}</div>}
    </div>
  )
}
