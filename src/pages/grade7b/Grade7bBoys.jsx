import { useState } from "react";
import { schoolData } from "../../data";
import ProfileCard from "../ProfileCard";
import "../Grade.css";

const schoolName = "40-maktab";
const grade = "Grade-7b";
const boys = schoolData[schoolName][0][grade][0]["Boys"];

function BoysPage7b() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="grade">
      <h1>{grade} – Boys 👦</h1>
      <div className="card-list">
        {boys.map((boyObj, i) => {
          const nameKey = Object.keys(boyObj)[0];
          const info = boyObj[nameKey][0];
          return (
            <ProfileCard
              key={`boy-${i}`}
              info={info}
              index={`boy-${i}`}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BoysPage7b;
