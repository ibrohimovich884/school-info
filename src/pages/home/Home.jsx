import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import "./home.css";

function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [allStudents, setAllStudents] = useState([]);
    const navigate = useNavigate();

    // Barcha o'quvchilarni bir marta yuklab olamiz
    useEffect(() => {
        // Bu yerda barcha sinflar ro'yxatini yuklaydigan API bo'lishi kerak
        // Agar API bo'lmasa, har bir sinfni alohida fetch qilib concat qilish kerak
        fetch("https://four0-mak-server-3.onrender.com/all-students") 
            .then(res => res.json())
            .then(data => setAllStudents(data))
            .catch(err => console.error("Qidiruv ma'lumotlarini yuklashda xato:", err));
    }, []);

    // Qidiruv mantiqi: Ism yoki Familiyada harfma-harf qidiradi
    const filteredStudents = searchTerm.trim() === "" ? [] : allStudents.filter(student => 
        student["Full name"].toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            {/* Search Input */}
            <div className="search-section">
                <input 
                    type="text" 
                    placeholder="O'quvchini qidirish... (masalan: ek)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                
                {/* Qidiruv natijalari */}
                {filteredStudents.length > 0 && (
                    <div className="search-results">
                        {filteredStudents.map((student, index) => (
                            <div 
                                key={index} 
                                className="search-item"
                                onClick={() => navigate(`/grade/${student.gradeId}`)}
                            >
                                <img src={student.Image || "/students/default.jpg"} alt="avatar" />
                                <div className="search-info">
                                    <p className="search-name">{student["Full name"]}</p>
                                    <p className="search-grade">{student.gradeId.toUpperCase()}-sinf</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <h2 className="grade-title">Sinfingizni tanlang!</h2>
            <div className="grade-list">
                {["7a", "7b", "8a", "8b", "9a", "9b", "9d"].map(grade => (
                    <NavLink key={grade} to={`/grade/${grade}`} className="grade-card">
                        {grade.toUpperCase().replace('A', '-A').replace('B', '-B').replace('D', '-D')}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default Home;