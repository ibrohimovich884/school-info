import "./About.css";

function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">Biz haqimizda</h1>
        <p className="about-text">
          Ushbu sayt — maktab o‘quvchilari haqidagi eng qulay va ishonchli
          ma’lumotlar platformasi. Bu yerda 7–8–9-sinflar bo‘yicha o‘quvchilar
          ro‘yxati, ularning yutuqlari va faoliyatlari bilan batafsil
          tanishishingiz mumkin.
        </p>


        <p className="about-text">
          Saytning maqsadi — maktab o‘quvchilari haqida ma’lumotlarni yig‘ib,
          sizlarga tezkor va qulay ko‘rinishda taqdim etishdir. Har bir o‘quvchi
          haqidagi ma’lumotlar sinflar bo‘yicha tartiblangan.
        </p>

        <div className="about-grid">
          <div className="about-box">
            <h3>📚 Ma’lumotlar markazi</h3>
            <p>
              Sinflar va o‘quvchilar haqida batafsil ma’lumotlarni tez va qulay
              tarzda topishingiz mumkin.
            </p>
          </div>
          <div className="about-box">
            <h3>🌐 Onlayn qulaylik</h3>
            <p>
              Sayt mobil va kompyuter qurilmalari uchun moslashtirilgan.
              Internet orqali istalgan joydan foydalanish imkoniyati mavjud.
            </p>
          </div>
          <div className="about-box">
            <h3>🔒 Ma’lumotlaringiz xavfsizligi</h3>
            <p>
              Saytimizda joylashtirilgan barcha ma’lumotlar himoyalangan bo‘lib,
              foydalanuvchilarning shaxsiy ma’lumotlari maxfiy saqlanadi va
              uchinchi shaxslarga berilmaydi.
            </p>
          </div>

        </div>

        <div className="about-highlight">
          ✨ “Biz bilan bilim va ma’lumot yanada yaqinroq!” ✨
        </div>
      </div>
    </div>
  );
}

export default About;
