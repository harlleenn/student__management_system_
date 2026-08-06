import { useTimer } from "react-timer-hook";
import { useNavigate } from "react-router";
export default function TimerLogout() {
  const getExpiryTimestamp = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 3000);
    return time;
  };
  const navigate = useNavigate();
  const { seconds, minutes,} = useTimer({
    expiryTimestamp: getExpiryTimestamp(),
    onExpire: () => {
      navigate("/logout");
    },
  });

  return (
    <div>
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}
