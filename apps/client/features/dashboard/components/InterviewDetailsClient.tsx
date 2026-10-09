"use client";

import React from "react";
import { MyInterviewsList } from "./interview-details/list/MyInterviewsList";
import { InterviewReportView } from "./interview-details/report/InterviewReportView";

export interface InterviewDetailsClientProps {
  id?: string;
}

/**
 * InterviewDetailsClient
 * Clean entry point and dispatcher between MyInterviewsList and InterviewReportView.
 * Follows Single Responsibility and Feature-Based modular architecture.
 */
export default function InterviewDetailsClient({ id }: InterviewDetailsClientProps) {
  if (!id) {
    return <MyInterviewsList />;
  }

  return <InterviewReportView interviewId={id} />;
}
