import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode, type Dispatch, type SetStateAction } from "react";
import type { resume } from "../types/models";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface ResumeContextType {
  activeResume: resume | null;
  setActiveResume: Dispatch<SetStateAction<resume | null>>;
  loading: boolean;
  saving: boolean;
  loadResume: (id: string) => Promise<resume | null>;
  createResume: (title?: string, templateId?: string) => Promise<resume | null>;
  updateResumeData: (updatedFields: Partial<resume>) => void;
  saveResume: () => Promise<void>;
  deleteResume: (id: string) => Promise<boolean>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const normalizeResume = (data: any): resume => {
  if (!data) return data;
  return {
    ...data,
    personalInfo: data.personalInfo || { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
    skills: {
      languages: data.skills?.languages || [],
      frameworks: data.skills?.frameworks || [],
      tools: data.skills?.tools || [],
      other: data.skills?.other || [],
    },
    experience: (data.experience || []).map((item: any) => ({
      ...item,
      id: item.id || item._id || Math.random().toString(36).substr(2, 9),
    })),
    education: (data.education || []).map((item: any) => ({
      ...item,
      id: item.id || item._id || Math.random().toString(36).substr(2, 9),
    })),
    projects: (data.projects || []).map((item: any) => ({
      ...item,
      id: item.id || item._id || Math.random().toString(36).substr(2, 9),
    })),
    certifications: (data.certifications || []).map((item: any) => ({
      ...item,
      id: item.id || item._id || Math.random().toString(36).substr(2, 9),
    })),
    leadership: (data.leadership || []).map((item: any) => ({
      ...item,
      id: item.id || item._id || Math.random().toString(36).substr(2, 9),
    })),
  };
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [activeResume, setActiveResume] = useState<resume | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // References to keep track of changes for auto-save
  const activeResumeRef = useRef<resume | null>(null);
  const isDirtyRef = useRef<boolean>(false);

  useEffect(() => {
    activeResumeRef.current = activeResume;
  }, [activeResume]);

  // Load a resume by ID
  const loadResume = useCallback(async (id: string): Promise<resume | null> => {
    if (!token) return null;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/resume/${id}`);
      if (res.status === 200 && res.data && res.data.data) {
        const formatted = normalizeResume(res.data.data);
        setActiveResume(formatted);
        isDirtyRef.current = false;
        return formatted;
      }
      return null;
    } catch (err) {
      console.error("Failed to load resume:", err);
      toast.error("Failed to load resume.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create a new resume
  const createResume = useCallback(async (title?: string, templateId?: string): Promise<resume | null> => {
    if (!token) return null;
    setLoading(true);
    try {
      const res = await axiosInstance.post("/resume/create", {
        title: title || "Untitled Resume",
        templateId: templateId || "jake-classic",
      });
      if (res.status === 201 && res.data && res.data.data) {
        const formatted = normalizeResume(res.data.data);
        setActiveResume(formatted);
        isDirtyRef.current = false;
        toast.success("Resume created!");
        return formatted;
      }
      return null;
    } catch (err) {
      console.error("Failed to create resume:", err);
      toast.error("Failed to create resume.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Save active resume manual trigger
  const saveResume = useCallback(async () => {
    const current = activeResumeRef.current;
    if (!token || !current || !current._id) return;
    setSaving(true);
    try {
      await axiosInstance.put(`/resume/${current._id}`, current);
      isDirtyRef.current = false;
      toast.success("Saved ✓", { id: "autosave-toast" });
    } catch (err) {
      console.error("Failed to save resume:", err);
      toast.error("Auto-save failed.");
    } finally {
      setSaving(false);
    }
  }, [token]);

  // Update resume data details on change
  const updateResumeData = useCallback((updatedFields: Partial<resume>) => {
    setActiveResume((prev) => {
      if (!prev) return null;
      isDirtyRef.current = true;
      return {
        ...prev,
        ...updatedFields,
      };
    });
  }, []);

  // Debounced auto-save timer effect every 30 seconds
  useEffect(() => {
    if (!token) return;

    const autoSaveInterval = setInterval(() => {
      if (isDirtyRef.current && activeResumeRef.current && activeResumeRef.current._id) {
        saveResume();
      }
    }, 30000); // 30 seconds

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [token, saveResume]);

  const deleteResume = useCallback(async (id: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await axiosInstance.delete(`/resume/${id}`);
      if (res.status === 200) {
        if (activeResumeRef.current?._id === id) {
          setActiveResume(null);
          isDirtyRef.current = false;
        }
        return true;
      }
      throw new Error("Failed to delete resume");
    } catch (err) {
      console.error("Failed to delete resume:", err);
      throw err;
    }
  }, [token]);

  return (
    <ResumeContext.Provider
      value={{
        activeResume,
        setActiveResume,
        loading,
        saving,
        loadResume,
        createResume,
        updateResumeData,
        saveResume,
        deleteResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
