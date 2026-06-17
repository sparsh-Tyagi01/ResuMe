import type { resume } from "../../types/models";

interface Props {
  data: resume;
}

const ModernTemplate: React.FC<Props> = ({ data }) => {
  const {
    personalInfo = { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
    summary = "",
    experience = [],
    education = [],
    skills = { languages: [], frameworks: [], tools: [], other: [] },
    projects = [],
    certifications = [],
    leadership = [],
    colorAccent = "#1E3A8A", // Default dark blue/navy
  } = data;

  const initials = personalInfo.name
    ? personalInfo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ME";

  return (
    <div
      className="w-[794px] min-h-[1123px] bg-white text-slate-800 flex box-border relative print-preview-canvas"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Left Sidebar (30%) */}
      <div
        className="w-[30%] text-white p-6 flex flex-col justify-between"
        style={{ backgroundColor: colorAccent }}
      >
        <div>
          {/* Avatar Placeholder */}
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center font-bold text-2xl mb-6 mx-auto border border-white/30">
            {initials}
          </div>

          <h1 className="text-xl font-extrabold text-center uppercase tracking-wider mb-1">
            {personalInfo.name || "YOUR NAME"}
          </h1>
          <p className="text-xs text-white/80 text-center uppercase font-semibold tracking-widest mb-6">
            {personalInfo.title || "PROFESSIONAL TITLE"}
          </p>

          <hr className="border-white/20 mb-6" />

          {/* Contact Details */}
          <div className="space-y-4 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/95">Contact</h3>
            <div className="space-y-2.5 text-xs text-white/80">
              {personalInfo.email && (
                <div>
                  <p className="font-semibold text-white/60 text-[10px] uppercase">Email</p>
                  <p className="break-all">{personalInfo.email}</p>
                </div>
              )}
              {personalInfo.phone && (
                <div>
                  <p className="font-semibold text-white/60 text-[10px] uppercase">Phone</p>
                  <p>{personalInfo.phone}</p>
                </div>
              )}
              {personalInfo.location && (
                <div>
                  <p className="font-semibold text-white/60 text-[10px] uppercase">Location</p>
                  <p>{personalInfo.location}</p>
                </div>
              )}
              {personalInfo.linkedin && (
                <div>
                  <p className="font-semibold text-white/60 text-[10px] uppercase">LinkedIn</p>
                  <p className="break-all">{personalInfo.linkedin}</p>
                </div>
              )}
              {personalInfo.github && (
                <div>
                  <p className="font-semibold text-white/60 text-[10px] uppercase">GitHub</p>
                  <p className="break-all">{personalInfo.github}</p>
                </div>
              )}
              {personalInfo.portfolio && (
                <div>
                  <p className="font-semibold text-white/60 text-[10px] uppercase">Portfolio</p>
                  <p className="break-all">{personalInfo.portfolio}</p>
                </div>
              )}
            </div>
          </div>

          <hr className="border-white/20 mb-6" />

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/95">Skills</h3>
            <div className="space-y-3">
              {skills.languages && skills.languages.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-white/60 uppercase mb-1">Languages</h4>
                  <div className="flex flex-wrap gap-1">
                    {skills.languages.map((lang, idx) => (
                      <span key={idx} className="bg-white/10 text-white text-[9px] font-medium px-2 py-0.5 rounded border border-white/5">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.frameworks && skills.frameworks.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-white/60 uppercase mb-1">Frameworks</h4>
                  <div className="flex flex-wrap gap-1">
                    {skills.frameworks.map((fw, idx) => (
                      <span key={idx} className="bg-white/10 text-white text-[9px] font-medium px-2 py-0.5 rounded border border-white/5">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-white/60 uppercase mb-1">Tools</h4>
                  <div className="flex flex-wrap gap-1">
                    {skills.tools.map((t, idx) => (
                      <span key={idx} className="bg-white/10 text-white text-[9px] font-medium px-2 py-0.5 rounded border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.other && skills.other.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-white/60 uppercase mb-1">Other</h4>
                  <div className="flex flex-wrap gap-1">
                    {skills.other.map((o, idx) => (
                      <span key={idx} className="bg-white/10 text-white text-[9px] font-medium px-2 py-0.5 rounded border border-white/5">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Pane (70%) */}
      <div className="w-[70%] bg-white p-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Summary */}
          {summary && (
            <div>
              <h2
                className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-2.5"
                style={{ borderColor: colorAccent, color: colorAccent }}
              >
                About Me
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-3"
                style={{ borderColor: colorAccent, color: colorAccent }}
              >
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-slate-800 text-xs">
                    <div className="flex justify-between items-baseline font-bold mb-0.5">
                      <span className="text-slate-900 text-sm">{exp.role || "Job Title"}</span>
                      <span className="text-slate-500 font-semibold">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-slate-600 mb-1.5">
                      <span>{exp.company || "Company Name"}</span>
                      <span>{exp.location}</span>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 text-justify">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-3"
                style={{ borderColor: colorAccent, color: colorAccent }}
              >
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-slate-800 text-xs">
                    <div className="flex justify-between items-baseline font-bold">
                      <span className="text-slate-900">{proj.name || "Project Name"}</span>
                      <span className="text-slate-500 font-semibold">{proj.date}</span>
                    </div>
                    {((proj.githubUrl && proj.githubUrl.trim() !== "") || (proj.liveUrl && proj.liveUrl.trim() !== "")) && (
                      <div className="flex gap-2 text-[10px] mt-0.5 text-blue-600 font-medium">
                        {proj.githubUrl && proj.githubUrl.trim() !== "" && (
                          <a
                            href={proj.githubUrl.startsWith("http") ? proj.githubUrl : `https://${proj.githubUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-800"
                          >
                            GitHub
                          </a>
                        )}
                        {proj.githubUrl && proj.githubUrl.trim() !== "" && proj.liveUrl && proj.liveUrl.trim() !== "" && <span className="text-slate-300">|</span>}
                        {proj.liveUrl && proj.liveUrl.trim() !== "" && (
                          <a
                            href={proj.liveUrl.startsWith("http") ? proj.liveUrl : `https://${proj.liveUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-800"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    )}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <p className="text-[10px] text-slate-500 font-semibold italic mt-0.5">
                        Tech Stack: {proj.techStack.join(", ")}
                      </p>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-700 text-justify">
                        {proj.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-3"
                style={{ borderColor: colorAccent, color: colorAccent }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-slate-800 text-xs">
                    <div className="flex justify-between items-baseline font-bold mb-0.5">
                      <span className="text-slate-900 text-sm">{edu.institution || "Institution Name"}</span>
                      <span className="text-slate-500 font-semibold">
                        {edu.startYear && edu.endYear ? `${edu.startYear} – ${edu.endYear}` : edu.endYear || edu.startYear}
                      </span>
                    </div>
                    <div className="italic text-slate-600">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                      {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Coursework: {edu.coursework.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-3"
                style={{ borderColor: colorAccent, color: colorAccent }}
              >
                Certifications
              </h2>
              <div className="space-y-1.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between text-xs text-slate-800">
                    <span>
                      <strong>{cert.name}</strong> – {cert.issuer}
                    </span>
                    <span className="text-slate-500 font-semibold">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leadership */}
          {leadership && leadership.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-3"
                style={{ borderColor: colorAccent, color: colorAccent }}
              >
                Leadership
              </h2>
              <div className="space-y-3">
                {leadership.map((lead) => (
                  <div key={lead.id} className="text-slate-800 text-xs">
                    <div className="flex justify-between items-baseline font-bold">
                      <span className="text-slate-900">{lead.role}</span>
                      <span className="text-slate-500 font-semibold">{lead.duration}</span>
                    </div>
                    <div className="italic text-slate-600 mb-1">{lead.organization}</div>
                    {lead.bullets && lead.bullets.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 text-justify">
                        {lead.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
