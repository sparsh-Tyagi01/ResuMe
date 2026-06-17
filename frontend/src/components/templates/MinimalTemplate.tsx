import type { resume } from "../../types/models";

interface Props {
  data: resume;
}

const MinimalTemplate: React.FC<Props> = ({ data }) => {
  const {
    personalInfo = { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
    summary = "",
    experience = [],
    education = [],
    skills = { languages: [], frameworks: [], tools: [], other: [] },
    projects = [],
    certifications = [],
    leadership = [],
    colorAccent = "#0EA5E9", // Default sky blue/teal accent
  } = data;

  return (
    <div
      className="w-[794px] min-h-[1123px] bg-white text-slate-900 p-12 box-border text-[12.5px] leading-relaxed relative print-preview-canvas"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{personalInfo.name || "YOUR NAME"}</h1>
          <p
            className="text-sm font-semibold tracking-wider uppercase mt-1"
            style={{ color: colorAccent }}
          >
            {personalInfo.title || "PROFESSIONAL TITLE"}
          </p>
        </div>
        <div className="text-right text-[11.5px] text-slate-500 space-y-0.5">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
        </div>
      </div>

      {/* Online Profiles */}
      {(personalInfo.github || personalInfo.linkedin || personalInfo.portfolio) && (
        <div className="flex gap-4 text-[11px] text-slate-400 border-t border-slate-100 pt-2 mb-6">
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

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <p className="text-slate-600 leading-relaxed text-justify italic">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Experience</h3>
          <div className="border-t border-slate-200 pt-2.5 space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="text-slate-700">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="font-bold text-slate-900 text-sm">
                    {exp.role} <span className="font-normal text-slate-400">at</span> {exp.company}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
                {exp.location && <p className="text-[11px] text-slate-400 italic mb-1.5">{exp.location}</p>}
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
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Projects</h3>
          <div className="border-t border-slate-200 pt-2.5 space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="text-slate-700">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  <span className="text-xs text-slate-400 font-semibold">{proj.date}</span>
                </div>
                {((proj.githubUrl && proj.githubUrl.trim() !== "") || (proj.liveUrl && proj.liveUrl.trim() !== "")) && (
                  <div className="flex gap-2 text-[11px] mt-0.5 text-blue-600 font-semibold">
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
                  <div className="flex flex-wrap gap-1 my-1">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${colorAccent}15`, color: colorAccent }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-600 text-justify">
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

      {/* Skills */}
      {skills &&
        (skills.languages?.length > 0 ||
          skills.frameworks?.length > 0 ||
          skills.tools?.length > 0 ||
          skills.other?.length > 0) && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Skills</h3>
            <div className="border-t border-slate-200 pt-2.5 grid grid-cols-2 gap-4">
              {skills.languages && skills.languages.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Languages</h4>
                  <p className="text-slate-700">{skills.languages.join(", ")}</p>
                </div>
              )}
              {skills.frameworks && skills.frameworks.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Frameworks</h4>
                  <p className="text-slate-700">{skills.frameworks.join(", ")}</p>
                </div>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Tools</h4>
                  <p className="text-slate-700">{skills.tools.join(", ")}</p>
                </div>
              )}
              {skills.other && skills.other.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Other</h4>
                  <p className="text-slate-700">{skills.other.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Education</h3>
          <div className="border-t border-slate-200 pt-2.5 space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-slate-700">
                <div className="flex justify-between items-baseline font-bold mb-0.5">
                  <span className="text-slate-900 text-sm">{edu.institution}</span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {edu.startYear && edu.endYear ? `${edu.startYear} – ${edu.endYear}` : edu.endYear || edu.startYear}
                  </span>
                </div>
                <p className="text-slate-600">
                  {edu.degree} in {edu.field} {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Certifications</h3>
          <div className="border-t border-slate-200 pt-2.5 grid grid-cols-2 gap-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-slate-700">
                <span className="font-bold">{cert.name}</span> – <span className="text-slate-500">{cert.issuer}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leadership */}
      {leadership && leadership.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Leadership</h3>
          <div className="border-t border-slate-200 pt-2.5 space-y-3">
            {leadership.map((lead) => (
              <div key={lead.id} className="text-slate-700">
                <div className="flex justify-between items-baseline font-bold">
                  <span className="text-slate-900">{lead.role}</span>
                  <span className="text-xs text-slate-400 font-semibold">{lead.duration}</span>
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
  );
};

export default MinimalTemplate;
