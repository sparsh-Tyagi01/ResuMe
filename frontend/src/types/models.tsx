import type { LucideIcon } from "lucide-react";

export interface feature  {
    icon : LucideIcon;
    iconBg: string;
    borderColor: string;
    heading: string;
    content: string;
}

export interface work {
    id: number;
    heading: string;
    bgColor: string;
    content: string;
}