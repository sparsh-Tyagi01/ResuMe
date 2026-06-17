import React, { useState, useEffect } from "react";
import JakeTemplate from "./JakeTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ElegantTemplate from "./ElegantTemplate";
import DynamicTemplate from "./DynamicTemplate";
import type { TemplateConfig } from "./DynamicTemplate";
import { axiosInstance } from "../../lib/axios";
import type { resume } from "../../types/models";

interface Props {
  templateId: string;
  data: resume;
}

// Global module-level cache for template configurations
let templatesCache: TemplateConfig[] | null = null;
let activeFetchPromise: Promise<TemplateConfig[]> | null = null;

const fetchAllTemplates = async (): Promise<TemplateConfig[]> => {
  if (templatesCache) return templatesCache;
  if (activeFetchPromise) return activeFetchPromise;

  activeFetchPromise = axiosInstance.get("/template")
    .then((res) => {
      templatesCache = res.data?.data || [];
      activeFetchPromise = null;
      return templatesCache!;
    })
    .catch((err) => {
      console.error("LayoutRenderer: Error fetching templates:", err);
      activeFetchPromise = null;
      return [];
    });

  return activeFetchPromise;
};

export const LayoutRenderer: React.FC<Props> = ({ templateId, data }) => {
  const tid = templateId?.toLowerCase() || "";
  const [config, setConfig] = useState<TemplateConfig | null>(null);

  useEffect(() => {
    const isBuiltin = 
      tid.includes("jake") ||
      tid.includes("classic") ||
      tid.includes("modern") ||
      tid.includes("blue") ||
      tid.includes("minimal") ||
      tid.includes("clean") ||
      tid.includes("elegant") ||
      tid.includes("column");

    if (!isBuiltin) {
      fetchAllTemplates().then((list) => {
        const found = list.find((t) => t.id === tid);
        if (found) {
          setConfig(found);
        }
      });
    }
  }, [tid]);

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

  // Render dynamic template if config is loaded
  if (config) {
    return <DynamicTemplate data={data} config={config} />;
  }

  // Fallback while configuration is loading or if not found
  return <JakeTemplate data={data} />;
};

export default LayoutRenderer;
