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
    degree: String;
    institution: String;
    year: String;
}

export interface job {
  _id: string;
  userId: string;
  jobTitle: string;
  company: string;
  location: string;
  jobLink: string;
  status: 'Apply' | 'Applied' | 'Interview' | 'Rejected' | 'Selected';
  resumeId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface template {
  _id: string;
  name: string;
  previewUrl: string;
  htmlUrl: string;
  fields: string[];
  createdAt: string;
  updatedAt: string;
}