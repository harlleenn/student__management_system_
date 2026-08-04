import React, { useEffect, useState } from 'react'

export default function Exercise() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000);
    };

    window.addEventListener("mousemove", resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
    };
  }, []);

  return (
    <div>
      <p>Move your mouse to stay active</p>
      {showPopup && <h2 style={{ color: "red" }}>You went idle!</h2>}
    </div>
  );
}