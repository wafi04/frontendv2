"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
interface HeaderDashboardProps {
  title: string;
  desc?: string;
  children?: ReactNode;
}
export function HeaderDashboard(props: HeaderDashboardProps) {
  return (
    <section className="flex items-center justify-between p-4">
      <div className="flex flex-col gap-3">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-primary"
        >
          {props.title}
        </motion.h1>
        <p className="text-md text-white">{props.desc}</p>
      </div>
      {props.children}
    </section>
  );
}
