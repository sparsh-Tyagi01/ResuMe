import { useEffect, useState } from "react";
import type { template } from "../types/models";
import { axiosInstance } from "../lib/axios";
import { ArrowRight, Check } from "lucide-react";
import { useTemplate } from "../context/templateContext";

const Templates = () => {
  const [template, setTemplate] = useState<template[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const { setSelectedtemplate } = useTemplate()

  useEffect(() => {
    async function getTemplate() {
      const res = await axiosInstance.get("/template/all");
      if (res.status == 200) {
        setTemplate(res.data);
      }
    }
    getTemplate();
  }, []);


  const handleSelect = () => {
    const temp= template.find((t) => t._id === selectedId);
    if (temp) {
      setSelectedtemplate(temp);
    }
  };

  const getTemplateGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-purple-500",
      "from-gray-600 to-gray-800",
      "from-purple-500 to-pink-500",
      "from-green-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-blue-500",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-slate-100">
      <div className="w-[90vw] min-h-[80vh] bg-white rounded-2xl flex flex-col items-center my-10">
        <div className="w-[85vw] mt-4">
          <h1 className="text-4xl font-bold text-black/80">
            Choose Your Template
          </h1>
          <p className="text-black/60">
            Select a professional template that matches your style and industry
          </p>
        </div>

        <div className="w-[85vw] mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {template.map((t, index) => (
            <button
              key={t._id}
              onClick={() => setSelectedId(t._id)}
              className={`relative p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
                selectedId === t._id
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {selectedId === t._id && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`w-full h-48 rounded-lg mb-4 bg-gradient-to-br ${getTemplateGradient(
                  index
                )} flex items-center justify-center`}
              >
                <img src={t.previewUrl} alt={t.name} className="h-48 rounded-lg"/>
              </div>

              <div className="text-center">
                <h3 className="text-lg text-gray-900 mb-2">{t.name}</h3>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSelect}
            disabled={!selectedId}
            className="flex items-center gap-2 mb-4 px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            Continue to Editor
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Templates;
