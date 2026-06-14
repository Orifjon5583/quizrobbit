import { Blocks, Bot, Box, Braces, CircuitBoard, Cpu, GraduationCap, Radio, Smartphone } from "lucide-react";

export const categories = [
  { name: "Scratch", icon: Blocks, color: "from-orange-400 to-amber-500", description: "Blokli dasturlash va algoritmlar" },
  { name: "Python", icon: Braces, color: "from-blue-500 to-indigo-600", description: "Sintaksis, ma'lumotlar va mantiq" },
  { name: "App Inventor", icon: Smartphone, color: "from-emerald-400 to-teal-600", description: "Mobil ilovalar yaratish" },
  { name: "Ustozlar yo'riqnomasi", icon: GraduationCap, color: "from-amber-400 to-orange-600", description: "Dars tashkiloti va baholash" },
  { name: "Spike Prime", icon: Bot, color: "from-rose-400 to-red-600", description: "Robototexnika va sensorlar" },
  { name: "Onshape", icon: Box, color: "from-sky-400 to-blue-600", description: "3D modellashtirish asoslari" },
  { name: "Arduino", icon: CircuitBoard, color: "from-cyan-400 to-teal-600", description: "Mikrokontroller va elektronika" },
  { name: "ESP32", icon: Cpu, color: "from-violet-400 to-purple-600", description: "Wi-Fi mikrokontroller" },
  { name: "IoT Blynk", icon: Radio, color: "from-lime-400 to-green-600", description: "IoT monitoring va boshqaruv" },
];

export const getLevel = (percentage) => percentage >= 90 ? "Expert" : percentage >= 70 ? "Advanced" : percentage >= 50 ? "Intermediate" : "Beginner";
