'use client';

import { Download, Mail, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SuccessContentProps {
  variant: 'no-session' | 'error' | 'success';
  productName?: string;
  downloadUrl?: string;
}

export default function SuccessContent({
  variant,
  productName,
  downloadUrl,
}: SuccessContentProps) {
  if (variant === 'no-session') {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Session Not Found</h1>
            <p className="text-white/60 mb-6">
              We couldn't find your checkout session. Please contact support if you completed a payment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'error') {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Error Loading Session</h1>
            <p className="text-white/60 mb-6">
              There was an error retrieving your checkout information. Please contact support.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // success
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="mb-6"
          >
            <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto" />
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-xl text-white/60 mb-2">Thank you for your purchase</p>
          <p className="text-lg text-white/40 mb-8">{productName}</p>

          {downloadUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href={downloadUrl}
                download
                className="inline-flex items-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-lg font-medium hover:bg-white/90 transition-colors text-lg"
              >
                <Download className="w-5 h-5" />
                Download Template
              </a>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href="mailto:support@example.com"
                className="inline-flex items-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-lg font-medium hover:bg-white/90 transition-colors text-lg"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </a>
              <p className="text-white/60 mt-4 text-sm">
                We couldn't find a download link for your purchase. Please contact support for assistance.
              </p>
            </motion.div>
          )}

          <div className="mt-8 pt-8 border-t border-white/10">
            <Link
              href="/"
              className="text-white/60 hover:text-white transition-colors"
            >
              ← Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}




