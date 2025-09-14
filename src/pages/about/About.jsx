import "./About.css";

function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">Biz haqimizda</h1>
        <p className="about-text">
          40-maktab — bu nafaqat ta’lim maskani, balki o‘quvchilarning ijodiy
          va shaxsiy rivojlanishi uchun haqiqiy maydon. Bizning maqsadimiz —
          yosh avlodni bilimli, mustaqil fikrlaydigan va vatanparvar insonlar
          qilib tarbiyalash.
        </p>

        <p className="about-text">
          Maktabimizda zamonaviy dars uslublari qo‘llaniladi, qo‘shimcha
          to‘garaklar (informatika, matematika, sport va san’at yo‘nalishlari)
          mavjud. Bundan tashqari, o‘quvchilar turli musobaqalar va tanlovlarda
          faol ishtirok etib, yutuqlarga erishmoqdalar.
        </p>

        <div className="about-grid">
          <div className="about-box">
            <h3>🎓 Ta’lim sifati</h3>
            <p>
              Malakali o‘qituvchilar va interaktiv dars metodlari orqali
              yuqori natijalarga erishamiz.
            </p>
          </div>
          <div className="about-box">
            <h3>⚽ Sport va sog‘lom turmush</h3>
            <p>
              O‘quvchilar uchun futbol, voleybol, shaxmat va boshqa
              musobaqalar tashkil etiladi.
            </p>
          </div>
          <div className="about-box">
            <h3>🎨 Ijod va san’at</h3>
            <p>
              Rassomlik, teatr va musiqa to‘garaklari orqali o‘quvchilar
              iste’dodlarini rivojlantirishlari mumkin.
            </p>
          </div>
        </div>

        <div className="about-highlight">
          ✨ “Bilim – kelajak kaliti!” ✨
        </div>
      </div>
    </div>
  );
}

export default About;
