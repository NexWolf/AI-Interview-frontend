"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Bot, Zap, Cpu } from "lucide-react";

interface SplashScreenProps {
  message?: string;
  subMessage?: string;
  showStatusPill?: boolean;
}

const LOADING_STATUSES = [
  "Initializing intelligent interview engine...",
  "Calibrating real-time voice & speech models...",
  "Synthesizing customized evaluation matrix...",
  "Preparing your personalized AI session...",
];

export function SplashScreen({
  message = "AI INTERVIEW COACH",
  subMessage,
  showStatusPill = true,
}: SplashScreenProps) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background text-foreground select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-center radial ambient glow */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-b from-primary/30 via-accent/20 to-transparent blur-[120px]"
        />

        {/* Bottom subtle ambient glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-gradient-to-t from-primary/20 via-purple-600/15 to-transparent blur-[110px]"
        />

        {/* Subtle grid pattern for high-tech aesthetic */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Central Logo Container with Multi-Layer Glow */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outermost pulsing ring */}
          <motion.div
            animate={{
              scale: [1, 1.45, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-36 h-36 rounded-full bg-primary/20 blur-xl"
          />

          {/* Rotating dashed accent orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-28 h-28 rounded-full border border-dashed border-primary/30 dark:border-primary/40 pointer-events-none"
          />

          {/* Inner reverse rotating subtle ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-24 h-24 rounded-full border border-dotted border-accent/40 dark:border-accent/30 pointer-events-none"
          />

          {/* Premium Logo Shield */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-20 h-20 rounded-2xl p-[1.5px] bg-gradient-to-b from-primary via-accent to-purple-800 shadow-[0_0_35px_rgba(97,54,191,0.45)] dark:shadow-[0_0_45px_rgba(159,132,217,0.35)]"
          >
            <div className="w-full h-full rounded-[14px] bg-card/90 dark:bg-card/70 backdrop-blur-md flex items-center justify-center relative overflow-hidden border border-white/10">
              {/* Subtle internal shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

              {/* AI Brain / Sparkles Center Icon */}
              <div className="relative flex items-center justify-center text-primary">
                <Brain className="w-9 h-9 drop-shadow-[0_2px_10px_rgba(97,54,191,0.5)] transition-transform" />
                <motion.div
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-1 -right-1 text-accent"
                >
                  <Sparkles className="w-4 h-4 fill-accent" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Brand Title */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {message}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            {subMessage || "Next-Generation Intelligent Practice Platform"}
          </p>
        </motion.div>

        {/* Futuristic Glowing Progress Bar */}
        <motion.div
          initial={{ scaleX: 0.8, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-56 sm:w-64 mt-6"
        >
          <div className="h-1.5 w-full bg-muted/60 dark:bg-muted/30 rounded-full overflow-hidden relative p-[1px] border border-border/50">
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1/2 h-full rounded-full bg-gradient-to-r from-transparent via-primary to-accent shadow-[0_0_12px_rgba(97,54,191,0.8)]"
            />
          </div>
        </motion.div>

        {/* Dynamic Status Text with Smooth Fade Transition */}
        <div className="h-6 mt-4 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusIndex}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] sm:text-xs text-muted-foreground/80 tracking-wide font-medium flex items-center gap-1.5"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {LOADING_STATUSES[statusIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Live System Indicator Pill */}
        {showStatusPill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              AI Models Online
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SplashScreen;
