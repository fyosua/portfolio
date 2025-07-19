"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";

export interface TimelineItem {
  id?: number | string;
  title: string;
  content: React.ReactNode;
}

// Animation variants, now used by both mobile and desktop
const itemVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
};

export const Timeline = ({ items }: { items: TimelineItem[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative w-full max-w-5xl mx-auto py-12">
      {/* --- DESKTOP TIMELINE (Animation Added) --- */}
      <div className="hidden md:block">
        <motion.div
          style={{ height }}
          className="absolute left-52 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-t from-primary via-primary/80 to-transparent"
        />
        <div className="absolute left-52 top-0 h-full w-px -translate-x-1/2 bg-muted-foreground/30" />
        <div className="space-y-16">
          {items.map((item) => (
            // 1. This container is now a motion.div with animation props
            <motion.div
              key={item.id || item.title}
              className="relative flex gap-10"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="w-48 shrink-0">
                <div className="sticky top-28 h-fit">
                  <div className="relative flex items-center justify-end">
                    <h3 className="text-lg font-bold text-muted-foreground text-right whitespace-nowrap pr-12">
                      {item.title}
                    </h3>
                    <div className="absolute left-[calc(100%+theme(spacing.2))] top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 z-10">{item.content}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- MOBILE TIMELINE (Unchanged) --- */}
      <div className="md:hidden">
        <motion.div
          style={{ height }}
          className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-t from-primary via-primary/80 to-transparent"
        />
        <div className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-muted-foreground/30" />
        <div className="space-y-8 pl-10">
          {items.map((item) => (
            <motion.div
              key={item.id || item.title}
              className="relative"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="absolute -left-6 top-1 h-4 w-4 -translate-x-1/2">
                <div className="h-full w-full rounded-full bg-primary ring-4 ring-background" />
              </div>
                <h3 className="text-xl mb-4 font-bold text-muted-foreground">{item.title}</h3>
              <div>{item.content}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};