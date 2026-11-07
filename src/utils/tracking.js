import { API_URL } from "../config.js";

// Har bir brauzer/qurilma uchun DOIMIY (login bo'lmasa ham saqlanadigan) ID.
// Shu ID orqali "kim, qachon, nechinchi marta keldi" ni bilib olamiz.
const VISITOR_KEY = "visitorId";

export const getVisitorId = () => {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
};

/**
 * Har qanday foydalanuvchi hodisasini serverga yuboradi.
 * Fire-and-forget — hech qachon UI'ni bloklamaydi, xato bo'lsa ham sahifa ishlashda davom etadi.
 *
 * type misollari: "pageView" | "login" | "search" | "viewStudent"
 * meta   - shu hodisaga xos qo'shimcha ma'lumot, masalan { query: "ali" } yoki { studentId, gradeId }
 */
export const trackEvent = (type, meta = {}) => {
    const payload = {
        visitorId: getVisitorId(),
        type,
        userAgent: navigator.userAgent,
        referrer: document.referrer || null,
        path: window.location.pathname,
        time: new Date().toISOString(),
        ...meta,
    };

    fetch(`${API_URL}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).catch(() => {
        // Fire-and-forget — server uxlayotgan yoki ulanmagan bo'lsa xatolik yashiriladi
    });
};
