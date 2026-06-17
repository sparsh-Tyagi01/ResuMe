import type { resume } from "../../types/models";

interface Props {
  data: resume;
}

const ElegantTemplate: React.FC<Props> = ({ data }) => {
  const {
    personalInfo = { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
    summary = "",
    experience = [],
    education = [],
    skills = { languages: [], frameworks: [], tools: [], other: [] },
    projects = [],
    certifications = [],
    leadership = [],
    colorAccent = "#8B5CF6", // Default violet accent
  } = data;

  return (
    <div
      className="w-[794px] min-h-[1123px] bg-white text-slate-800 p-10 box-border text-[12px] leading-relaxed relative print-preview-canvas flex flex-col justify-between"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div>
        {/* Full-width Header with Accent Line */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <h1
                className="text-3xl font-bold uppercase tracking-wider"
                style={{ fontFamily: "'EB Garamond', serif", color: colorAccent }}
              >
                {personalInfo.name || "YOUR NAME"}
              </h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                {personalInfo.title || "PROFESSIONAL TITLE"}
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500 space-y-0.5">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
            </div>
          </div>
          {/* Subtle colored accent line */}
          <div className="h-1 w-full rounded-full" style={{ backgroundColor: colorAccent }}></div>
        </div>

        {/* Links section */}
        {(personalInfo.github || personalInfo.linkedin || personalInfo.portfolio) && (
          <div className="flex gap-4 justify-center text-[10.5px] text-slate-400 mb-6 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-100">
            {personalInfo.linkedin && (
              <span>
                <strong>LinkedIn:</strong> <span className="text-slate-600">{personalInfo.linkedin}</span>
              </span>
            )}
            {personalInfo.github && (
              <span>
                <strong>GitHub:</strong> <span className="text-slate-600">{personalInfo.github}</span>
              </span>
            )}
            {personalInfo.portfolio && (
              <span>
                <strong>Portfolio:</strong> <span className="text-slate-600">{personalInfo.portfolio}</span>
              </span>
            )}
          </div>
        )}

        {/* Two-Column Content Layout */}
        <div className="flex gap-6 items-start">
          {/* Left Column (40% width) */}
          <div className="w-[40%] space-y-6">
            {/* Summary */}
            {summary && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: colorAccent }}
                >
                  About Me
                </h3>
                <p className="text-slate-600 text-justify leading-relaxed">{summary}</p>
              </div>
            )}

            {/* Technical Skills */}
            {skills &&
              (skills.languages?.length > 0 ||
                skills.frameworks?.length > 0 ||
                skills.tools?.length > 0 ||
                skills.other?.length > 0) && (
                <div>
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: colorAccent }}
                  >
                    Skills
                  </h3>
                  <div className="space-y-2.5 text-slate-600">
                    {skills.languages && skills.languages.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider">Languages</span>
                        <span>{skills.languages.join(", ")}</span>
                      </div>
                    )}
                    {skills.frameworks && skills.frameworks.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider">Frameworks</span>
                        <span>{skills.frameworks.join(", ")}</span>
                      </div>
                    )}
                    {skills.tools && skills.tools.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider">Tools</span>
                        <span>{skills.tools.join(", ")}</span>
                      </div>
                    )}
                    {skills.other && skills.other.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider">Other</span>
                        <span>{skills.other.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Education */}
            {education && education.length > 0 && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: colorAccent }}
                >
                  Education
                </h3>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-slate-600">
                      <p className="font-bold text-slate-800 text-[12px]">{edu.institution}</p>
                      <p className="italic text-slate-600 text-[11px]">{edu.degree} in {edu.field}</p>
                      <p className="text-[10px] text-slate-400">
                        {edu.startYear} – {edu.endYear} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: colorAccent }}
                >
                  Certifications
                </h3>
                <div className="space-y-2 text-slate-600">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="leading-tight">
                      <p className="font-bold text-slate-800 text-[11px]">{cert.name}</p>
                      <p className="text-slate-500 text-[10px]">{cert.issuer} | {cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (60% width) */}
          <div className="w-[60%] space-y-6">
            {/* Experience */}
            {experience && experience.length > 0 && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: colorAccent }}
                >
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-slate-600">
                      <div className="flex justify-between items-baseline font-bold">
                        <span className="text-slate-800 text-[13px]">{exp.role}</span>
                        <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap ml-2">
                          {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline italic text-[11px] text-slate-500 mb-1.5">
                        <span>{exp.company}</span>
                        <span>{exp.location}</span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 text-justify">
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
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: colorAccent }}
                >
                  Key Projects
                </h3>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="text-slate-600">
                      <div className="flex justify-between items-baseline font-bold mb-0.5">
                        <span className="text-slate-800">{proj.name}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{proj.date}</span>
                      </div>
                      {((proj.githubUrl && proj.githubUrl.trim() !== "") || (proj.liveUrl && proj.liveUrl.trim() !== "")) && (
                        <div className="flex gap-2 text-[10.5px] mt-0.5 font-medium">
                          {proj.githubUrl && proj.githubUrl.trim() !== "" && (
                            <a
                              href={proj.githubUrl.startsWith("http") ? proj.githubUrl : `https://${proj.githubUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-blue-600"
                              style={{ color: colorAccent }}
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
                              className="underline hover:text-blue-600"
                              style={{ color: colorAccent }}
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                      )}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <p className="text-[9.5px] font-semibold text-slate-500 mb-1">
                          Stack: {proj.techStack.join(", ")}
                        </p>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 text-justify">
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

            {/* Leadership */}
            {leadership && leadership.length > 0 && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: colorAccent }}
                >
                  Leadership
                </h3>
                <div className="space-y-3">
                  {leadership.map((lead) => (
                    <div key={lead.id} className="text-slate-600">
                      <div className="flex justify-between items-baseline font-bold mb-0.5">
                        <span className="text-slate-800">{lead.role}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{lead.duration}</span>
                      </div>
                      <p className="italic text-slate-500 mb-1">{lead.organization}</p>
                      {lead.bullets && lead.bullets.length > 0 && (
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 text-justify">
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
    </div>
  );
};

export default ElegantTemplate;
