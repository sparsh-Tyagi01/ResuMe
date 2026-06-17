import React from "react";
import type { resume } from "../../types/models";

// Type definitions for the template configuration
export interface TemplateConfig {
  id: string;
  name: string;
  description?: string;
  fontFamily: string;
  primaryColor: string;
  layoutType: 
    | "single-column" 
    | "two-column-left" 
    | "two-column-right" 
    | "top-header-block" 
    | "even-split" 
    | "left-border-accent";
  spacing: "tight" | "normal" | "loose";
  showDividers: boolean;
  borderStyle: "none" | "solid" | "dashed";
  sectionOrder: string[];
}

interface Props {
  data: resume;
  config: TemplateConfig;
}

const DynamicTemplate: React.FC<Props> = ({ data, config }) => {
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

  const {
    fontFamily = "Plus Jakarta Sans",
    primaryColor: defaultColor = "#1e3a8a",
    layoutType = "single-column",
    spacing = "normal",
    showDividers = true,
    borderStyle = "none",
    sectionOrder = [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "leadership",
    ],
  } = config;

  const primaryColor = data.colorAccent || defaultColor;

  // Font family mapping
  const getFontFamily = (font: string) => {
    if (font === "EB Garamond") return "'EB Garamond', serif";
    if (font === "Plus Jakarta Sans") return "'Plus Jakarta Sans', sans-serif";
    if (font === "Inter") return "'Inter', sans-serif";
    if (font === "Roboto") return "'Roboto', sans-serif";
    if (font === "Outfit") return "'Outfit', sans-serif";
    if (font === "DM Sans") return "'DM Sans', sans-serif";
    return `'${font}', sans-serif`;
  };

  // Spacing configurations
  const getSpacingClass = (space: string) => {
    switch (space) {
      case "tight":
        return {
          padding: "p-6",
          sectionMargin: "mb-2.5",
          itemMargin: "mb-1",
          fontSize: "text-[11px]",
          headerSize: "text-[12.5px]",
          lineHeight: "leading-[1.3]",
          titleSize: "text-xl",
          subtitleSize: "text-xs",
        };
      case "loose":
        return {
          padding: "p-10",
          sectionMargin: "mb-5",
          itemMargin: "mb-3",
          fontSize: "text-[13px]",
          headerSize: "text-[14.5px]",
          lineHeight: "leading-[1.5]",
          titleSize: "text-3xl",
          subtitleSize: "text-sm",
        };
      case "normal":
      default:
        return {
          padding: "p-8",
          sectionMargin: "mb-4",
          itemMargin: "mb-2",
          fontSize: "text-[12px]",
          headerSize: "text-[13.5px]",
          lineHeight: "leading-[1.4]",
          titleSize: "text-2xl",
          subtitleSize: "text-xs",
        };
    }
  };

  const styleSettings = getSpacingClass(spacing);

  // Border configurations
  const getBorderClass = (border: string) => {
    switch (border) {
      case "solid":
        return "border border-slate-200";
      case "dashed":
        return "border border-dashed border-slate-300";
      case "none":
      default:
        return "";
    }
  };

  // Helper to render section dividers
  const renderDivider = () => {
    if (!showDividers) return null;
    return (
      <div 
        className="w-full h-[1px] mt-0.5 mb-1.5" 
        style={{ backgroundColor: primaryColor }}
      />
    );
  };

  // Render Functions for individual sections
  const renderSummarySection = () => {
    if (!summary) return null;
    return (
      <div key="summary" className={styleSettings.sectionMargin}>
        <h2 
          className={`${styleSettings.headerSize} font-bold uppercase tracking-wider`}
          style={{ color: primaryColor }}
        >
          Professional Summary
        </h2>
        {renderDivider()}
        <p className="text-justify text-slate-800">{summary}</p>
      </div>
    );
  };

  const renderEducationSection = () => {
    if (!education || education.length === 0) return null;
    return (
      <div key="education" className={styleSettings.sectionMargin}>
        <h2 
          className={`${styleSettings.headerSize} font-bold uppercase tracking-wider`}
          style={{ color: primaryColor }}
        >
          Education
        </h2>
        {renderDivider()}
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id} className={`${styleSettings.itemMargin} text-slate-800`}>
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
                <p className="text-xs text-slate-600 mt-0.5">
                  <strong>Relevant Coursework:</strong> {edu.coursework.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperienceSection = () => {
    if (!experience || experience.length === 0) return null;
    return (
      <div key="experience" className={styleSettings.sectionMargin}>
        <h2 
          className={`${styleSettings.headerSize} font-bold uppercase tracking-wider`}
          style={{ color: primaryColor }}
        >
          Experience
        </h2>
        {renderDivider()}
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id} className={`${styleSettings.itemMargin} text-slate-800`}>
              <div className="flex justify-between font-bold">
                <span>{exp.role || "Job Title"}</span>
                <span>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between italic text-slate-700 mb-0.5">
                <span>{exp.company || "Company Name"}</span>
                <span>{exp.location}</span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-0.5 text-slate-800 text-justify">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsSection = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <div key="projects" className={styleSettings.sectionMargin}>
        <h2 
          className={`${styleSettings.headerSize} font-bold uppercase tracking-wider`}
          style={{ color: primaryColor }}
        >
          Projects
        </h2>
        {renderDivider()}
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className={`${styleSettings.itemMargin} text-slate-800`}>
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
                <div className="text-[10px] text-slate-500 flex gap-2 mt-0.5 font-normal">
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
                <ul className="list-disc pl-5 mt-0.5 space-y-0.5 text-slate-800 text-justify">
                  {proj.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsSection = () => {
    if (
      !skills ||
      (!skills.languages?.length &&
        !skills.frameworks?.length &&
        !skills.tools?.length &&
        !skills.other?.length)
    ) {
      return null;
    }
    return (
      <div key="skills" className={styleSettings.sectionMargin}>
        <h2 
          className={`${styleSettings.headerSize} font-bold uppercase tracking-wider`}
          style={{ color: primaryColor }}
        >
          Technical Skills
        </h2>
        {renderDivider()}
        <div className="space-y-0.5 text-slate-800">
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
    );
  };

  const renderCertificationsSection = () => {
    if (!certifications || certifications.length === 0) return null;
    return (
      <div key="certifications" className={styleSettings.sectionMargin}>
        <h2 
          className={`${styleSettings.headerSize} font-bold uppercase tracking-wider`}
          style={{ color: primaryColor }}
        >
          Certifications
        </h2>
        {renderDivider()}
        <div className="space-y-0.5 text-slate-800">
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
    );
  };

  const renderLeadershipSection = () => {
    if (!leadership || leadership.length === 0) return null;
    return (
      <div key="leadership" className={styleSettings.sectionMargin}>
        <h2 
          className={`${styleSettings.headerSize} font-bold uppercase tracking-wider`}
          style={{ color: primaryColor }}
        >
          Leadership & Involvement
        </h2>
        {renderDivider()}
        {leadership.map((lead) => (
          <div key={lead.id} className={`${styleSettings.itemMargin} text-slate-800`}>
            <div className="flex justify-between font-bold">
              <span>{lead.role}</span>
              <span>{lead.duration}</span>
            </div>
            <div className="italic text-slate-700 mb-0.5">{lead.organization}</div>
            {lead.bullets && lead.bullets.length > 0 && (
              <ul className="list-disc pl-5 space-y-0.5 text-slate-800 text-justify">
                {lead.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSectionByKey = (key: string) => {
    switch (key) {
      case "summary":
        return renderSummarySection();
      case "experience":
        return renderExperienceSection();
      case "education":
        return renderEducationSection();
      case "skills":
        return renderSkillsSection();
      case "projects":
        return renderProjectsSection();
      case "certifications":
        return renderCertificationsSection();
      case "leadership":
        return renderLeadershipSection();
      default:
        return null;
    }
  };

  // Render contacts banner helper
  const renderContactsHeader = (isSidebar: boolean = false) => {
    if (isSidebar) {
      return (
        <div className="space-y-2 text-xs opacity-90 mt-4">
          {personalInfo.email && (
            <div>
              <p className="font-semibold opacity-60 text-[9px] uppercase tracking-wider">Email</p>
              <p className="break-all">{personalInfo.email}</p>
            </div>
          )}
          {personalInfo.phone && (
            <div>
              <p className="font-semibold opacity-60 text-[9px] uppercase tracking-wider">Phone</p>
              <p>{personalInfo.phone}</p>
            </div>
          )}
          {personalInfo.location && (
            <div>
              <p className="font-semibold opacity-60 text-[9px] uppercase tracking-wider">Location</p>
              <p>{personalInfo.location}</p>
            </div>
          )}
          {personalInfo.linkedin && (
            <div>
              <p className="font-semibold opacity-60 text-[9px] uppercase tracking-wider">LinkedIn</p>
              <p className="break-all underline">{personalInfo.linkedin}</p>
            </div>
          )}
          {personalInfo.github && (
            <div>
              <p className="font-semibold opacity-60 text-[9px] uppercase tracking-wider">GitHub</p>
              <p className="break-all underline">{personalInfo.github}</p>
            </div>
          )}
          {personalInfo.portfolio && (
            <div>
              <p className="font-semibold opacity-60 text-[9px] uppercase tracking-wider">Portfolio</p>
              <p className="break-all underline">{personalInfo.portfolio}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-xs text-slate-700 flex flex-wrap justify-center gap-2 mt-1">
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
    );
  };

  // Render layouts
  const renderSingleColumnLayout = () => {
    return (
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`${styleSettings.titleSize} font-bold tracking-wide uppercase`} style={{ color: primaryColor }}>
            {personalInfo.name || "YOUR NAME"}
          </h1>
          {renderContactsHeader(false)}
          {personalInfo.title && (
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mt-1">
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Dynamic Section Ordering */}
        {sectionOrder.map((sectionKey) => renderSectionByKey(sectionKey))}
      </div>
    );
  };

  const renderTwoColumnLayout = (sidebarLeft: boolean) => {
    // Left-sidebar or Right-sidebar placement
    // Sidebar sections: Personal details/contacts, Skills, Education
    // Main sections: Summary, Experience, Projects, Certifications, Leadership
    const sidebarContent = (
      <div className="h-full flex flex-col gap-6 text-white">
        <div>
          {/* Initials badge */}
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl mb-4 mx-auto border border-white/30">
            {personalInfo.name
              ? personalInfo.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
              : "ME"}
          </div>
          <h1 className="text-lg font-extrabold text-center uppercase tracking-wider mb-1">
            {personalInfo.name || "YOUR NAME"}
          </h1>
          <p className="text-[10px] text-white/80 text-center uppercase font-semibold tracking-widest">
            {personalInfo.title || "PROFESSIONAL TITLE"}
          </p>
        </div>

        <div className="border-t border-white/20 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Contact Info</h3>
          {renderContactsHeader(true)}
        </div>

        {/* Skills sidebar render */}
        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0 || skills.other?.length > 0) && (
          <div className="border-t border-white/20 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3">Skills</h3>
            <div className="space-y-2 text-[10.5px]">
              {skills.languages && skills.languages.length > 0 && (
                <div>
                  <h4 className="text-[9px] font-semibold text-white/60 uppercase mb-1">Languages</h4>
                  <p>{skills.languages.join(", ")}</p>
                </div>
              )}
              {skills.frameworks && skills.frameworks.length > 0 && (
                <div>
                  <h4 className="text-[9px] font-semibold text-white/60 uppercase mb-1">Frameworks</h4>
                  <p>{skills.frameworks.join(", ")}</p>
                </div>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <div>
                  <h4 className="text-[9px] font-semibold text-white/60 uppercase mb-1">Tools</h4>
                  <p>{skills.tools.join(", ")}</p>
                </div>
              )}
              {skills.other && skills.other.length > 0 && (
                <div>
                  <h4 className="text-[9px] font-semibold text-white/60 uppercase mb-1">Other</h4>
                  <p>{skills.other.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education sidebar render */}
        {education && education.length > 0 && (
          <div className="border-t border-white/20 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3">Education</h3>
            <div className="space-y-2 text-[10.5px]">
              {education.map((edu) => (
                <div key={edu.id} className="text-white/95">
                  <p className="font-bold text-white">{edu.institution}</p>
                  <p className="text-[9.5px] text-white/70 italic">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </p>
                  <p className="text-[9px] text-white/60">
                    {edu.startYear} - {edu.endYear}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    const mainPaneSections = sectionOrder.filter(
      (key) => !["skills", "education"].includes(key)
    );

    const mainContent = (
      <div className="flex flex-col gap-4">
        {mainPaneSections.map((sectionKey) => renderSectionByKey(sectionKey))}
      </div>
    );

    return (
      <div className="w-full h-full flex min-h-[1123px]">
        {sidebarLeft ? (
          <>
            {/* Sidebar */}
            <div 
              className="w-[30%] p-6 flex flex-col" 
              style={{ backgroundColor: primaryColor }}
            >
              {sidebarContent}
            </div>
            {/* Main Pane */}
            <div className="w-[70%] p-8 bg-white text-slate-800">
              {mainContent}
            </div>
          </>
        ) : (
          <>
            {/* Main Pane */}
            <div className="w-[70%] p-8 bg-white text-slate-800">
              {mainContent}
            </div>
            {/* Sidebar */}
            <div 
              className="w-[30%] p-6 flex flex-col" 
              style={{ backgroundColor: primaryColor }}
            >
              {sidebarContent}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderTopHeaderBlockLayout = () => {
    return (
      <div className="w-full flex flex-col">
        {/* Banner header block */}
        <div 
          className="w-full p-8 text-center text-white flex flex-col items-center justify-center mb-6"
          style={{ backgroundColor: primaryColor }}
        >
          <h1 className={`${styleSettings.titleSize} font-bold tracking-wide uppercase`}>
            {personalInfo.name || "YOUR NAME"}
          </h1>
          {personalInfo.title && (
            <p className="text-xs font-semibold tracking-widest uppercase mt-1 opacity-90">
              {personalInfo.title}
            </p>
          )}
          
          <div className="text-[10px] opacity-90 flex flex-wrap justify-center gap-2 mt-3 text-white border-t border-white/20 pt-3 w-full max-w-lg">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && (personalInfo.email || personalInfo.location || personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && <span className="opacity-45">|</span>}
            
            {personalInfo.email && <span className="underline">{personalInfo.email}</span>}
            {personalInfo.email && (personalInfo.location || personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && <span className="opacity-45">|</span>}
            
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && (personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && <span className="opacity-45">|</span>}
            
            {personalInfo.linkedin && <span className="underline">{personalInfo.linkedin}</span>}
            {personalInfo.linkedin && (personalInfo.github || personalInfo.portfolio) && <span className="opacity-45">|</span>}
            
            {personalInfo.github && <span className="underline">{personalInfo.github}</span>}
            {personalInfo.github && personalInfo.portfolio && <span className="opacity-45">|</span>}
            
            {personalInfo.portfolio && <span className="underline">{personalInfo.portfolio}</span>}
          </div>
        </div>

        {/* Content columns below the banner */}
        <div className={styleSettings.padding}>
          {sectionOrder.map((sectionKey) => renderSectionByKey(sectionKey))}
        </div>
      </div>
    );
  };

  const renderEvenSplitLayout = () => {
    // Left column: summary, experience, projects
    // Right column: education, skills, certifications, leadership
    const leftSections = sectionOrder.filter((key) => ["summary", "experience", "projects"].includes(key));
    const rightSections = sectionOrder.filter((key) => ["education", "skills", "certifications", "leadership"].includes(key));

    return (
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`${styleSettings.titleSize} font-bold tracking-wide uppercase`} style={{ color: primaryColor }}>
            {personalInfo.name || "YOUR NAME"}
          </h1>
          {renderContactsHeader(false)}
          {personalInfo.title && (
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mt-1">
              {personalInfo.title}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {leftSections.map((sectionKey) => renderSectionByKey(sectionKey))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {rightSections.map((sectionKey) => renderSectionByKey(sectionKey))}
          </div>
        </div>
      </div>
    );
  };

  const renderLeftBorderAccentLayout = () => {
    return (
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="text-left">
            <h1 className={`${styleSettings.titleSize} font-bold tracking-wide uppercase`} style={{ color: primaryColor }}>
              {personalInfo.name || "YOUR NAME"}
            </h1>
            {personalInfo.title && (
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mt-1">
                {personalInfo.title}
              </p>
            )}
          </div>
          <div className="text-right text-[10px] text-slate-600 flex flex-col gap-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div className="underline">{personalInfo.linkedin}</div>}
            {personalInfo.github && <div className="underline">{personalInfo.github}</div>}
            {personalInfo.portfolio && <div className="underline">{personalInfo.portfolio}</div>}
          </div>
        </div>

        {/* Content container with a vertical accent line running on the left */}
        <div className="w-full relative pl-6 border-l-2" style={{ borderColor: primaryColor }}>
          {sectionOrder.map((sectionKey) => renderSectionByKey(sectionKey))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-[794px] min-h-[1123px] bg-white text-black box-border relative print-preview-canvas overflow-hidden ${styleSettings.fontSize} ${styleSettings.lineHeight} ${getBorderClass(borderStyle)}`}
      style={{ fontFamily: getFontFamily(fontFamily) }}
    >
      {layoutType === "single-column" && (
        <div className={styleSettings.padding}>{renderSingleColumnLayout()}</div>
      )}
      {layoutType === "two-column-left" && renderTwoColumnLayout(true)}
      {layoutType === "two-column-right" && renderTwoColumnLayout(false)}
      {layoutType === "top-header-block" && renderTopHeaderBlockLayout()}
      {layoutType === "even-split" && (
        <div className={styleSettings.padding}>{renderEvenSplitLayout()}</div>
      )}
      {layoutType === "left-border-accent" && (
        <div className={styleSettings.padding}>{renderLeftBorderAccentLayout()}</div>
      )}
    </div>
  );
};

export default DynamicTemplate;
