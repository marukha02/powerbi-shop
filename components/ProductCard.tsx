'use client';

import { useState } from 'react';
import { Eye, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { createCheckoutSession } from '@/app/actions/stripe';
import LiveDemoModal from './LiveDemoModal';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  demoUrl?: string;
  stripePriceId?: string;
  stripeProductId?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);
    try {
      await createCheckoutSession(
        product.id, 
        product.price, 
        product.title,
        product.stripePriceId,
        product.stripeProductId
      );
    } catch (error: any) {
      // Next.js redirect() throws a special error that should not be caught
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        // Let the redirect happen, don't show error
        return;
      }
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
      >
        <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden relative">
          {product.image && product.image.startsWith('http') ? (
            <Image 
              src={product.image} 
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="text-4xl font-bold text-white/20">{product.title.charAt(0)}</div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
          <p className="text-2xl font-bold text-white mb-4">${product.price.toFixed(2)}</p>
          <div className="flex gap-3">
            <button
              onClick={handleBuy}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-zinc-950 px-4 py-2.5 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              {isLoading ? 'Processing...' : 'Buy'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 glass px-4 py-2.5 rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Live Demo
            </button>
          </div>
        </div>
      </motion.div>
      <LiveDemoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportUrl={product.demoUrl}
      />
    </>
  );
}


