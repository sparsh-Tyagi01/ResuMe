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

export interface resume {
    _id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    github?: string;
    linkedin?: string;
    skills: string[];
    experience: experience[];
    education: education[];
    resumeUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface experience {
    company: string;
    role: string;
    duration: string;
    description: string;
}

export interface education {
    degree: String,
    institution: String,
    year: String
}