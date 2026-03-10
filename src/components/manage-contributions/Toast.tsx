/** @format */
"use client";

import { motion } from "framer-motion";

interface Props {
  message: string;
}

export default function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg z-50"
    >
      {message}
    </motion.div>
  );
}