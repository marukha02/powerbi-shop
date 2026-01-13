'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportUrl?: string;
}

export default function LiveDemoModal({ isOpen, onClose, reportUrl }: LiveDemoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 glass rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Live Demo</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="h-full overflow-hidden">
              {reportUrl ? (
                <iframe
                  src={reportUrl}
                  className="w-full h-full border-0"
                  title="Power BI Report"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  <div className="text-center">
                    <p className="text-lg mb-2">Power BI Report Preview</p>
                    <p className="text-sm">Replace this iframe with your Power BI "Publish to Web" URL</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}








