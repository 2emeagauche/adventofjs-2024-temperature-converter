import { useState, useEffect, useRef } from "react";

export default function App() {
  const [tempInput, setTempInput] = useState("24.0");
  const [isCelsius, setIsCelsius] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const outerCircle = useRef(null);

  const rootStyles = getComputedStyle(document.documentElement);
  const delta = rootStyles.getPropertyValue("--delta") * 1;
  const base = rootStyles.getPropertyValue("--base") * 1;

  const hue = ((tempInput - base) / delta) * 180 + 180;
  document.documentElement.style.setProperty("--outerhue", hue);

  function handleTemp(e) {
    let val = parseFloat(e.target.value);
    document.documentElement.style.setProperty("--temp", val);
    document.documentElement.style.setProperty(
      "--dial-angle",
      ((val - base) * 360) / delta - 270 + "deg"
    );
    setTempInput(() => val.toFixed(0));
  }

  function cToF(v) {
    return (v * 9) / 5 + 32;
  }

  function fToC(v) {
    return ((v - 32) * 5) / 9;
  }

  function handleSwitch() {
    setTempInput((v) => {
      const newV = isCelsius ? cToF(v) : fToC(v);
      if (isCelsius) {
        document.documentElement.style.setProperty("--delta", 72);
        document.documentElement.style.setProperty("--base", 32);
      } else {
        document.documentElement.style.setProperty("--delta", 40);
        document.documentElement.style.setProperty("--base", 0);
      }
      document.documentElement.style.setProperty("--temp", newV);
      return newV.toFixed(1);
    });
    setIsCelsius((v) => !v);
  }

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = outerCircle.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const newAngle = ((Math.atan2(y, x) * 180) / Math.PI - 360) % 360;
    document.documentElement.style.setProperty(
      "--dial-angle",
      newAngle + "deg"
    );

    const newTemp =
      ((newAngle > -360 && newAngle < -270 ? newAngle + 630 : newAngle + 270) *
        delta) /
        360 +
      base;
    setTempInput(() => newTemp);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="App">
      <div
        className="converter"
        ref={outerCircle}
        onMouseMove={handleMouseMove}
      >
        <div className={`outer ${isDragging ? "" : "anim"}`}></div>
        <div className="inner"></div>
        <div className={`hand ${isDragging ? "" : "anim"}`}>
          <div className="dial" onMouseDown={handleMouseDown}></div>
        </div>
        <div className="center">
          <div type="text" className="tempInput">
            <input
              type="number"
              min={isCelsius ? 0 : 32}
              max={isCelsius ? 40 : 104}
              value={tempInput}
              onChange={handleTemp}
              onFocus={(e) => e.target.select()}
            />
            °{isCelsius ? "C" : "F"}
          </div>
        </div>
        <div className="dot dot0"></div>
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        <div className="dot dot4"></div>
        <div className="dot dot5"></div>
        <div className="dot dot6"></div>
        <div className="dot dot7"></div>
        <div className="dot dot8"></div>
        <div className="dot dot9"></div>
        <div className="dot dot10"></div>
        <div className="dot dot11"></div>
        <div className="dot dot12"></div>
        <div className="dot dot13"></div>
        <div className="dot dot14"></div>
        <div className="dot dot15"></div>
        <div className="temp zeroquarter">{isCelsius ? "0" : "32"}°</div>
        <div className="temp onequarter">{isCelsius ? "10" : "50"}°</div>
        <div className="temp twoquarter">{isCelsius ? "20" : "68"}°</div>
        <div className="temp threequarter">{isCelsius ? "30" : "86"}°</div>
      </div>
      <button className="switch" onClick={handleSwitch}>
        Convert to {isCelsius ? "Fahrenheit" : "Celsius"}
      </button>
    </div>
  );
}
