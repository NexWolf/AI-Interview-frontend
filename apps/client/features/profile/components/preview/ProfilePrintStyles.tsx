"use client";

import React from "react";

/**
 * Print stylesheet to format PDF and browser printing cleanly for the profile preview.
 */
export const ProfilePrintStyles: React.FC = () => {
  return (
    <style jsx global>{`
      @media print {
        /* Hide navigation, headers, sidebars, and export buttons */
        header,
        aside,
        nav,
        .no-print {
          display: none !important;
        }
        body {
          background: #ffffff !important;
          color: #0f172a !important;
          margin: 0 !important;
          padding: 10mm !important;
        }
        .print-full-width {
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .bg-card,
        .bg-background {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        .border {
          border-color: #cbd5e1 !important;
        }
      }
    `}</style>
  );
};

export default ProfilePrintStyles;
