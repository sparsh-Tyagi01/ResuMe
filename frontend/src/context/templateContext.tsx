import { createContext, useContext, useState, type ReactNode } from "react";
import type { template } from "../types/models";

interface TemplateContexttype {
    selectedTemplate: template | null;
    setSelectedtemplate: (template: template) => void;
}

const TemplateContext = createContext<TemplateContexttype | undefined>(undefined)

export const TemplateProvider = ({children}: {children : ReactNode}) => {
    const [selectedTemplate, setSelectedtemplate] = useState<template | null>(null)

    return (
        <TemplateContext.Provider
        value={{selectedTemplate, setSelectedtemplate}}
        >
            {children}
        </TemplateContext.Provider>
    )
}

export const useTemplate = ()=> {
    const context = useContext(TemplateContext)
    if(!context){
        throw new Error("useTemplate must be used inside TemplateProvider")
    }
    return context
}