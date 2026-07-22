import React, { useState } from 'react'
import Popup from './Popup'

export default function InviteUser() {
    const [clicked , setClicked] = useState(false)
    const handleClicked = () => {
        setClicked(prev => !prev)
    }
  return (
    <div>
        <div>
            <button onClick={handleClicked}>Invite User</button>
            {clicked && <Popup/>}
        </div>
    </div>
  )
}
