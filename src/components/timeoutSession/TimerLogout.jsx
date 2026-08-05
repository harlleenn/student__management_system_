import { useTimer } from 'react-timer-hook';
import { useNavigate } from 'react-router';
export default function TimerLogout() {
  // Set your desired countdown duration
  const getExpiryTimestamp = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 3); // 5 minutes from now
    return time;
  };
const navigate = useNavigate()
  const {
    seconds,
    minutes,
    hours,
    isRunning,
  } = useTimer({
    expiryTimestamp: getExpiryTimestamp(),
    onExpire: () => {
      navigate("/")
    },
  });

  return (
    <div>
      
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
    

    </div>
  );
}