import { API_URL } from "../config.js";

// Har bir brauzer/qurilma uchun DOIMIY (login bo'lmasa ham saqlanadigan) ID.
const VISITOR_KEY = "visitorId";
const LOCAL_EVENTS_KEY = "tracked_events_buffer_v1";
const MAX_LOCAL_EVENTS = 150;

export const getVisitorId = () => {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
        id = (typeof crypto !== "undefined" && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
};

// Mahalliy zaxiradagi hodisalarni olish (offline/real-time nazorat uchun)
export const getLocalEvents = () => {
    try {
        const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

// Mahalliy hodisalarni tozalash
export const clearLocalEvents = () => {
    try {
        localStorage.removeItem(LOCAL_EVENTS_KEY);
    } catch {
        // xato bo'lsa davom etadi
    }
};

/**
 * Har qanday foydalanuvchi hodisasini serverga yuboradi va mahalliy buferga yozadi.
 * Fire-and-forget — hech qachon UI'ni bloklamaydi.
 *
 * type misollari:
 *   - "pageView"            - Sahifaga kirish
 *   - "login"               - Login qilish
 *   - "search"              - Qidiruv satrini yozish
 *   - "search_open"         - Qidirib topib ochish (User qidirib aynan kimni ochgani)
 *   - "viewStudent"         - O'quvchini ko'rish (umumiy)
 *   - "viewStudentDetails"  - Sinf sahifasida kartani ochib, qaysi ma'lumotlarini ko'rgani
 *   - "studentAction"       - O'quvchining Instagram'iga bosish, rasmini ko'rish, h.k.
 */
export const trackEvent = (type, meta = {}) => {
    const payload = {
        visitorId: getVisitorId(),
        type,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
        referrer: typeof document !== "undefined" ? (document.referrer || null) : null,
        path: typeof window !== "undefined" ? window.location.pathname : "",
        time: new Date().toISOString(),
        ...meta,
    };

    // 1. Mahalliy buferga yozish (Admin panelda real-time vaqti-vaqti bilan ko'rsatish uchun)
    try {
        const localList = getLocalEvents();
        localList.unshift(payload);
        if (localList.length > MAX_LOCAL_EVENTS) {
            localList.length = MAX_LOCAL_EVENTS;
        }
        localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(localList));
        // Yangilanish signali (boshqa oyna yoki komponentlar uchun)
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("tracked_event_recorded", { detail: payload }));
        }
    } catch {
        // LocalStorage xatoliklarini e'tiborsiz qoldiramiz
    }

    // 2. Serverga yuborish
    try {
        fetch(`${API_URL}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).catch(() => {
            // Server uxlayotgan yoki ulanmagan bo'lsa xatolik yashiriladi
        });
    } catch {
        // Fetch xatoliklarini e'tiborsiz qoldiramiz
    }

    return payload;
};

/**
 * 1. Qidirib topib ochishni qayd qilish:
 * Qaysi so'z qidirildi, qaysi o'quvchi ochildi, qaysi sinfda
 */
export const trackSearchOpen = (query, student, source = "search_dropdown") => {
    if (!student) return;
    trackEvent("search_open", {
        query: query || "",
        source,
        studentId: student.id,
        name: student["Full name"] || student.Name,
        gradeId: student.gradeId,
        instagram: student.Instagram || "Unknown",
    });
};

/**
 * 2. Sinf sahifasida kartani ochib aynan qaysi ma'lumotlarni ko'rganini qayd qilish:
 * fieldsViewed: ["Full name", "Birthday", "Talked", "Instagram", "Status"]
 * durationSec: qancha vaqt ochiq qolgani
 */
export const trackStudentDetailView = (student, fieldsViewed = [], durationSec = 0, source = "grade_page") => {
    if (!student) return;
    trackEvent("viewStudentDetails", {
        studentId: student.id,
        name: student["Full name"] || student.Name,
        gradeId: student.gradeId,
        fieldsViewed,
        durationSec: Math.round(durationSec),
        source,
    });
};

/**
 * 3. O'quvchi ichidagi aniq harakatlarni qayd qilish:
 * Masalan: instagram havolasiga bosish, sinfiga o'tish
 */
export const trackStudentAction = (action, student, extra = {}) => {
    if (!student) return;
    trackEvent("studentAction", {
        action, // "click_instagram", "navigate_grade", "close_card"
        studentId: student.id,
        name: student["Full name"] || student.Name,
        gradeId: student.gradeId,
        ...extra,
    });
};
