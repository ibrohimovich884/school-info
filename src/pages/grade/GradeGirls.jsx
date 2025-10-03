// pages/grade/GradeBoys.jsx
import { useOutletContext } from "react-router";

function BoysPage() {
  const { gradeData } = useOutletContext();
  const boys = gradeData.students.filter(s => s.gender === "male");

  return (
    <div>
      <h3>O‘g‘il bolalar ro‘yxati</h3>
      <ul>
        {boys.map(boy => (
          <li key={boy.id}>{boy.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default BoysPage;
