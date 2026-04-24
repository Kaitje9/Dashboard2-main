/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { TrendingDown, TrendingUp, Minus, Info } from "lucide-react";
import { HealthMetric } from "../types";
import { useState } from "react";

export function MetricCard({ metric }: { metric: HealthMetric }) {
  const [isHovered, setIsHovered] = useState(false);
  const isRecovery = metric.id === 'recovery';
  
  if (isRecovery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-brand-card rounded-[32px] p-8 border border-brand-border flex flex-col items-center justify-center relative overflow-hidden group cursor-help h-full"
        id={`metric-card-${metric.id}`}
      >
        <div className="absolute top-6 left-0 w-full flex justify-center px-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-muted font-black w-full text-center">{metric.label} LEVEL</span>
        </div>
        
        <div className="relative mt-4 flex items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="#1D1D20" strokeWidth="12" fill="transparent" />
            <motion.circle 
              cx="80" 
              cy="80" 
              r="70" 
              stroke="var(--color-brand-accent)" 
              strokeWidth="12" 
              fill="transparent" 
              strokeDasharray="440" 
              initial={{ strokeDashoffset: 440 }}
              animate={{ strokeDashoffset: 440 - (440 * (Number(metric.value) / 100)) }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-extralight text-white tracking-tighter">{metric.value}<span className="text-2xl opacity-40 ml-1">%</span></span>
          </div>
        </div>

        <div className="mt-8 bg-brand-accent/10 px-6 py-2 rounded-2xl border border-brand-accent/20">
          <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.1em]">System Primed</span>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="absolute inset-0 bg-brand-bg/80 p-8 flex flex-col justify-center text-center z-20"
            >
              <h4 className="text-brand-accent text-xs font-black uppercase mb-3 tracking-widest">{metric.label} Insight</h4>
              <p className="text-sm text-brand-text leading-relaxed mb-4">{metric.description}</p>
              <div className="text-[10px] text-brand-muted uppercase font-bold italic">"{metric.insight}"</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-brand-card rounded-2xl p-6 border border-brand-border flex justify-between items-center group transition-all hover:bg-[#1A1A1D] hover:border-brand-accent/20 cursor-help relative overflow-hidden"
      id={`metric-card-${metric.id}`}
    >
      <div className="flex flex-col gap-1 z-10">
        <span className="text-[10px] uppercase font-black tracking-[0.15em] text-brand-muted">{metric.label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-light text-white tracking-tight">{metric.value}</span>
          <span className="text-xs text-brand-muted font-mono">{metric.unit}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 z-10">
        <div className={`p-2.5 rounded-xl transition-all group-hover:scale-110 ${
          metric.id === 'sleep' ? 'bg-[#3E92F9]/10 text-[#3E92F9]' : 
          metric.id === 'strain' ? 'bg-brand-accent/10 text-brand-accent' : 
          'bg-brand-muted/10 text-brand-muted'
        }`}>
          {metric.trend === 'up' && <TrendingUp className="w-5 h-5" />}
          {metric.trend === 'down' && <TrendingDown className="w-5 h-5" />}
          {metric.trend === 'stable' && <Minus className="w-5 h-5" />}
        </div>
        <span className={`text-[10px] font-black tracking-tighter ${metric.change >= 0 ? 'text-brand-accent' : 'text-[#F93E3E]'}`}>
          {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}%
        </span>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-0 bg-[#1A1A1D] p-5 flex flex-col justify-center border-l-4 border-brand-accent z-20"
          >
            <p className="text-[11px] text-brand-text font-medium leading-tight">{metric.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
