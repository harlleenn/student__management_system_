import React, { useState } from 'react'
import styles from './searchInput.module.css'
import { Search } from 'lucide-react'
export default function SearchInput({query,setQuery}) {

    
  return (
    <div className={styles.inputContainer}>
        <input placeholder='Search student by name or email '
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        />
     
    </div>
  )
}
