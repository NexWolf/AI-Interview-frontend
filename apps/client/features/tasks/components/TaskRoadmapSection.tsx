"use client";

import React from "react";
import {
  Layers,
  Flag,
  CheckCircle2,
  Code2,
  Target,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { AgentRoadmap } from "../types/task.types";

interface TaskRoadmapSectionProps {
  roadmap: AgentRoadmap;
}

export function TaskRoadmapSection({ roadmap }: TaskRoadmapSectionProps) {
  return (
    <div className="space-y-6">
      {/* Project Overview Card */}
      <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                مشروع البورتفوليو التطبيقي
              </span>
              <h2 className="text-lg sm:text-xl font-black text-foreground mt-0.5">
                {roadmap.projectName}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {roadmap.projectDescription}
        </p>

        {/* Goal & Deliverable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Target className="w-4 h-4 text-primary" />
              <span>الهدف التعليمي الأساسي:</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {roadmap.goal}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>المخرج النهائي المتوقع (Deliverable):</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {roadmap.expectedDeliverable}
            </p>
          </div>
        </div>

        {/* Tech Stack Pills */}
        {roadmap.technologyStack?.length > 0 && (
          <div className="pt-2">
            <div className="text-xs font-bold text-muted-foreground mb-2">
              التقنيات والأدوات المستخدمة في هذا المشروع:
            </div>
            <div className="flex flex-wrap gap-2">
              {roadmap.technologyStack.map((tech, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-muted/40 text-xs font-mono font-medium text-foreground"
                >
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Milestones Timeline */}
      <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <Flag className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            المراحل الرئيسية للمشروع (Project Milestones)
          </h3>
        </div>

        <div className="relative border-r-2 border-primary/30 mr-4 pr-6 space-y-8">
          {roadmap.milestones?.map((milestone) => (
            <div key={milestone.order} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -right-[33px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    المرحلة {milestone.order}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    {milestone.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {milestone.description}
                </p>

                {milestone.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {milestone.skills.map((skill, si) => (
                      <span
                        key={si}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
