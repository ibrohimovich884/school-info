import React, { useState } from "react";
import "./Calc.css";

function Calc() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [op, setOp] = useState("+");

  const calculate = () => {
    const a = Number(num1);
    const b = Number(num2);
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : "∞";
      default: return "";
    }
  };

  return (
    <div className="calc">
      <div className="calc-card">
        <h1 className="title">Simple Calculator</h1>

        <div className="inputs">
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="0"
          />

          <select value={op} onChange={(e) => setOp(e.target.value)}>
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="result">
          = <span>{calculate()}</span>
        </div>
      </div>
    </div>
  );
}

export default Calc;
