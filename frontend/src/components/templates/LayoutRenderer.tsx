import React from "react";
import JakeTemplate from "./JakeTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ElegantTemplate from "./ElegantTemplate";
import type { resume } from "../../types/models";

interface Props {
  templateId: string;
  data: resume;
}

export const LayoutRenderer: React.FC<Props> = ({ templateId, data }) => {
  const tid = templateId?.toLowerCase() || "";

  if (tid.includes("jake") || tid.includes("classic")) {
    return <JakeTemplate data={data} />;
  }
  if (tid.includes("modern") || tid.includes("blue")) {
    return <ModernTemplate data={data} />;
  }
  if (tid.includes("minimal") || tid.includes("clean")) {
    return <MinimalTemplate data={data} />;
  }
  if (tid.includes("elegant") || tid.includes("column")) {
    return <ElegantTemplate data={data} />;
  }
  
  // Default fallback
  return <JakeTemplate data={data} />;
};

export default LayoutRenderer;
