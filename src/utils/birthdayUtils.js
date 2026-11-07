/**
 * Tug'ilgan kun ma'lumotlarini tahlil qilish va hisoblash uchun yordamchi funksiyalar
 */

const MONTH_NAMES_UZ = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];

/**
 * Matn shaklidagi tug'ilgan kun sanasini parsed ob'ektga aylantiradi
 */
export function parseStudentBirthday(dateStr) {
    if (!dateStr || typeof dateStr !== "string") return null;
    const str = dateStr.trim();
    if (!str || str.toLowerCase() === "unknown" || str.toLowerCase() === "noma'lum") return null;

    let month = -1;
    let day = -1;
    let year = null;

    // YYYY-MM-DD yoki YYYY/MM/DD
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(str)) {
        const parts = str.split(/[-/]/).map(Number);
        year = parts[0];
        month = parts[1] - 1;
        day = parts[2];
    }
    // DD.MM.YYYY yoki DD-MM-YYYY yoki DD/MM/YYYY
    else if (/^\d{1,2}[.-/]\d{1,2}[.-/]\d{4}$/.test(str)) {
        const parts = str.split(/[.-/]/).map(Number);
        day = parts[0];
        month = parts[1] - 1;
        year = parts[2];
    }
    // MM/DD yoki DD/MM (yilsiz)
    else if (/^\d{1,2}[.-/]\d{1,2}$/.test(str)) {
        const parts = str.split(/[.-/]/).map(Number);
        if (parts[0] > 12) {
            day = parts[0];
            month = parts[1] - 1;
        } else {
            month = parts[0] - 1;
            day = parts[1];
        }
    }

    if (isNaN(month) || isNaN(day) || month < 0 || month > 11 || day < 1 || day > 31) {
        return null;
    }

    return { month, day, year, raw: dateStr };
}

/**
 * Har bir o'quvchi uchun tug'ilgan kungacha va tug'ilgan kundan keyingi kunlarni hisoblaydi
 */
export function getBirthdayMetrics(student, referenceDate = new Date()) {
    const parsed = parseStudentBirthday(student.Birthday);
    if (!parsed) return null;

    const currentYear = referenceDate.getFullYear();
    const todayZero = new Date(currentYear, referenceDate.getMonth(), referenceDate.getDate());

    const bdayThisYear = new Date(currentYear, parsed.month, parsed.day);
    const diffMsThisYear = bdayThisYear.getTime() - todayZero.getTime();
    const diffDaysThisYear = Math.round(diffMsThisYear / (1000 * 60 * 60 * 24));

    let daysUntilNext;
    let daysSinceLast;

    if (diffDaysThisYear === 0) {
        // Bugun tug'ilgan kuni!
        daysUntilNext = 0;
        daysSinceLast = 0;
    } else if (diffDaysThisYear > 0) {
        // Bu yildagi tug'ilgan kuni hali oldinda
        daysUntilNext = diffDaysThisYear;

        // O'tgan yildagi eng oxirgi tug'ilgan kuni
        const lastBdayDate = new Date(currentYear - 1, parsed.month, parsed.day);
        const diffMsLast = todayZero.getTime() - lastBdayDate.getTime();
        daysSinceLast = Math.round(diffMsLast / (1000 * 60 * 60 * 24));
    } else {
        // Bu yildagi tug'ilgan kuni o'tib ketgan
        daysSinceLast = Math.abs(diffDaysThisYear);

        // Keyingi tug'ilgan kuni kelasi yili
        const nextBdayDate = new Date(currentYear + 1, parsed.month, parsed.day);
        const diffMsNext = nextBdayDate.getTime() - todayZero.getTime();
        daysUntilNext = Math.round(diffMsNext / (1000 * 60 * 60 * 24));
    }

    const monthName = MONTH_NAMES_UZ[parsed.month];
    const formattedDate = `${parsed.day}-${monthName}`;

    return {
        student,
        parsed,
        monthName,
        formattedDate,
        monthIndex: parsed.month,
        day: parsed.day,
        year: parsed.year,
        daysUntilNext,
        daysSinceLast,
        isToday: daysUntilNext === 0,
        isTomorrow: daysUntilNext === 1,
    };
}

/**
 * Barcha o'quvchilar ichidan o'tib ketgan ENGI YAQIN 3 ta tug'ilgan kun egasini qaytaradi
 */
export function getPastThreeBirthdays(students, referenceDate = new Date()) {
    const list = (students || [])
        .map(s => getBirthdayMetrics(s, referenceDate))
        .filter(item => item !== null && item.daysSinceLast > 0);

    // Eng kam o'tgan kun bo'yicha tartiblash (masalan 1 kun oldin, 3 kun oldin, 5 kun oldin)
    list.sort((a, b) => a.daysSinceLast - b.daysSinceLast);

    return list.slice(0, 3);
}

/**
 * Yaqinlashib kelayotgan tug'ilgan kunlar (eng yaqinidan boshlab)
 */
export function getUpcomingBirthdays(students, referenceDate = new Date()) {
    const list = (students || [])
        .map(s => getBirthdayMetrics(s, referenceDate))
        .filter(item => item !== null);

    // Eng kam qolgan kun bo'yicha tartiblash (0 kun [bugun], 1 kun [ertaga], 2 kun...)
    list.sort((a, b) => a.daysUntilNext - b.daysUntilNext);

    return list;
}

export { MONTH_NAMES_UZ };
