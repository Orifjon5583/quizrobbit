export const friendlyError = (error) => {
  const code = error?.code || "";
  if (code.includes("email-already-in-use")) return "Bu email bilan avval ro'yxatdan o'tilgan.";
  if (code.includes("invalid-credential")) return "Email yoki parol noto'g'ri.";
  if (code.includes("weak-password")) return "Parol kamida 6 belgidan iborat bo'lishi kerak.";
  if (code.includes("permission-denied")) return "Bu amal uchun ruxsat yetarli emas.";
  return error?.message || "Kutilmagan xatolik yuz berdi.";
};
