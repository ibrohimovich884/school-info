import { useState } from "react";
import { schoolData } from "../../data";
import ProfileCard from "../ProfileCard";
import "../Grade.css";

const schoolName = "40-maktab";
const grade = "Grade-7a";
const girls = schoolData[schoolName][0][grade][0]["Girls"];
console.log(girls);

function GirlsPage7a() {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="grade">
            <h1>{grade} – Girls 👧</h1>
            <div className="card-list">
                {girls.map((girlObj, i) => {
                    const nameKey = Object.keys(girlObj)[0];
                    const info = girlObj[nameKey][0];
                    return (
                        <ProfileCard
                            key={`girl-${i}`}
                            info={info}
                            index={`girl-${i}`}
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default GirlsPage7a;
