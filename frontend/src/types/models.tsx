import type { LucideIcon } from "lucide-react";

export interface feature {
  icon: LucideIcon;
  iconBg: string;
  borderColor: string;
  heading: string;
  content: string;
}

export interface resume {
  _id?: string;
  userId?: string;
  title: string;
  templateId: string;
  colorAccent?: string;
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  experience: {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location: string;
    bullets: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    gpa?: string;
    coursework?: string[];
  }[];
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
  };
  projects: {
    id: string;
    name: string;
    techStack: string[];
    date: string;
    githubUrl?: string;
    liveUrl?: string;
    bullets: string[];
  }[];
  certifications?: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  leadership?: {
    id: string;
    role: string;
    organization: string;
    duration: string;
    bullets: string[];
  }[];
  isPublic?: boolean;
  shareToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface job {
  _id: string;
  userId: string;
  jobTitle: string;
  company: string;
  location: string;
  jobLink: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  resumeId?: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}