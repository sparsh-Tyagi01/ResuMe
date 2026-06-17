import type { resume } from "../../types/models";

interface Props {
  data: resume;
}

const JakeTemplate: React.FC<Props> = ({ data }) => {
  const {
    personalInfo = { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
    summary = "",
    experience = [],
    education = [],
    skills = { languages: [], frameworks: [], tools: [], other: [] },
    projects = [],
    certifications = [],
    leadership = [],
  } = data;

  return (
    <div
      className="w-[794px] min-h-[1123px] bg-white text-black p-10 box-border text-[13px] leading-relaxed relative print-preview-canvas"
      style={{ fontFamily: "'EB Garamond', serif" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide uppercase">{personalInfo.name || "YOUR NAME"}</h1>
        <div className="text-xs text-slate-700 flex flex-wrap justify-center gap-1.5 mt-1.5">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && (personalInfo.email || personalInfo.location || personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && <span>|</span>}
          
          {personalInfo.email && <span className="underline">{personalInfo.email}</span>}
          {personalInfo.email && (personalInfo.location || personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && <span>|</span>}
          
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && (personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && <span>|</span>}
          
          {personalInfo.linkedin && <span className="underline">{personalInfo.linkedin}</span>}
          {personalInfo.linkedin && (personalInfo.github || personalInfo.portfolio) && <span>|</span>}
          
          {personalInfo.github && <span className="underline">{personalInfo.github}</span>}
          {personalInfo.github && personalInfo.portfolio && <span>|</span>}
          
          {personalInfo.portfolio && <span className="underline">{personalInfo.portfolio}</span>}
        </div>
        {personalInfo.title && (
          <p className="text-sm font-semibold tracking-wider text-slate-800 uppercase mt-1">
            {personalInfo.title}
          </p>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            Professional Summary
          </h2>
          <p className="text-justify text-slate-800">{summary}</p>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3 text-slate-800">
              <div className="flex justify-between font-bold">
                <span>{edu.institution || "Institution Name"}</span>
                <span>
                  {edu.startYear && edu.endYear ? `${edu.startYear} – ${edu.endYear}` : edu.endYear || edu.startYear}
                </span>
              </div>
              <div className="flex justify-between italic text-slate-700">
                <span>
                  {edu.degree || "Degree"} {edu.field ? `in ${edu.field}` : ""}
                  {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
                </span>
              </div>
              {edu.coursework && edu.coursework.length > 0 && (
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Relevant Coursework:</strong> {edu.coursework.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4 text-slate-800">
              <div className="flex justify-between font-bold">
                <span>{exp.role || "Job Title"}</span>
                <span>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between italic text-slate-700 mb-1.5">
                <span>{exp.company || "Company Name"}</span>
                <span>{exp.location}</span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-slate-800 text-justify">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3 text-slate-800">
              <div className="flex justify-between font-bold">
                <span>
                  {proj.name || "Project Name"}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <span className="font-normal text-slate-600">
                      {" "}
                      | {proj.techStack.join(", ")}
                    </span>
                  )}
                </span>
                <span>{proj.date}</span>
              </div>
              {((proj.githubUrl && proj.githubUrl.trim() !== "") || (proj.liveUrl && proj.liveUrl.trim() !== "")) && (
                <div className="text-xs text-slate-600 flex gap-2 mt-0.5 font-normal">
                  {proj.githubUrl && proj.githubUrl.trim() !== "" && (
                    <a
                      href={proj.githubUrl.startsWith("http") ? proj.githubUrl : `https://${proj.githubUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-600"
                    >
                      GitHub
                    </a>
                  )}
                  {proj.githubUrl && proj.githubUrl.trim() !== "" && proj.liveUrl && proj.liveUrl.trim() !== "" && <span>|</span>}
                  {proj.liveUrl && proj.liveUrl.trim() !== "" && (
                    <a
                      href={proj.liveUrl.startsWith("http") ? proj.liveUrl : `https://${proj.liveUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-600"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              )}
              {proj.bullets && proj.bullets.length > 0 && (
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-800 text-justify">
                  {proj.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {skills &&
        (skills.languages?.length > 0 ||
          skills.frameworks?.length > 0 ||
          skills.tools?.length > 0 ||
          skills.other?.length > 0) && (
          <div className="mb-5">
            <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
              Technical Skills
            </h2>
            <div className="space-y-1 text-slate-800">
              {skills.languages && skills.languages.length > 0 && (
                <p>
                  <strong>Languages:</strong> {skills.languages.join(", ")}
                </p>
              )}
              {skills.frameworks && skills.frameworks.length > 0 && (
                <p>
                  <strong>Frameworks:</strong> {skills.frameworks.join(", ")}
                </p>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <p>
                  <strong>Tools:</strong> {skills.tools.join(", ")}
                </p>
              )}
              {skills.other && skills.other.length > 0 && (
                <p>
                  <strong>Other:</strong> {skills.other.join(", ")}
                </p>
              )}
            </div>
          </div>
        )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            Certifications
          </h2>
          <div className="space-y-1 text-slate-800">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <span>
                  <strong>{cert.name}</strong> – {cert.issuer}
                </span>
                <span>{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leadership */}
      {leadership && leadership.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            Leadership & Involvement
          </h2>
          {leadership.map((lead) => (
            <div key={lead.id} className="mb-3 text-slate-800">
              <div className="flex justify-between font-bold">
                <span>{lead.role}</span>
                <span>{lead.duration}</span>
              </div>
              <div className="italic text-slate-700 mb-1">{lead.organization}</div>
              {lead.bullets && lead.bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-slate-800 text-justify">
                  {lead.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JakeTemplate;
