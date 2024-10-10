"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export default function LoLOProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progress + 10);
    }, 500);

    if (progress >= 100) {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full max-w-md space-y-4 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-[#C8AA6E] rounded-sm opacity-50"></div>
        {/* <div className="absolute inset-[1px] bg-[#010A13] rounded-[1px]"></div> */}
        <Progress value={progress} className="h-3 w-full bg-[#0A1428] relative z-10" />
      </div>
    </div>
  );
}
