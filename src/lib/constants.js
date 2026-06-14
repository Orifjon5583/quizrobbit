import { Blocks, Bot, Box, Braces, CircuitBoard, Cpu, GraduationCap, Radio, Smartphone } from "lucide-react";
import categoryCatalog from "../../data/categories.json";

const icons = { Blocks, Braces, Smartphone, GraduationCap, Bot, Box, CircuitBoard, Cpu, Radio };

export const categories = categoryCatalog.map(category => ({ ...category, icon: icons[category.icon] || Blocks }));

export const getLevel = (percentage) => percentage >= 90 ? "Expert" : percentage >= 70 ? "Advanced" : percentage >= 50 ? "Intermediate" : "Beginner";
