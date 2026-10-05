"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Spotlight() {
  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      animate={{
        background: `radial-gradient(
          500px circle at ${position.x}% ${position.y}%,
          rgba(125, 91, 166, 0.18),
          transparent 70%
        )`,
      }}
      transition={{
        duration: 0.15,
        ease: "linear",
      }}
    />
  );
}