import { useResume as useResumeContext } from "../context/ResumeContext";

export const useResume = () => {
  return useResumeContext();
};

export default useResume;
