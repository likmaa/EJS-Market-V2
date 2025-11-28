'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

interface FilterOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
  }) => void;
  categoryOptions: FilterOption[];
  brandOptions: FilterOption[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: { min: number; max: number };
  maxPrice: number;
}

export function MobileFiltersModal({
  isOpen,
  onClose,
  onApply,
  categoryOptions,
  brandOptions,
  selectedCategories: initialCategories,
  selectedBrands: initialBrands,
  priceRange: initialPriceRange,
  maxPrice,
}: MobileFiltersModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [activeTab, setActiveTab] = useState<'category' | 'brand' | 'price'>('category');

  // Réinitialiser les états quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setSelectedCategories(initialCategories);
      setSelectedBrands(initialBrands);
      setPriceRange(initialPriceRange);
    }
  }, [isOpen, initialCategories, initialBrands, initialPriceRange]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleBrand = (id: string) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: maxPrice });
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + 
    (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <DialogBackdrop
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
          />

          <div className="fixed inset-0 flex items-end justify-center pointer-events-none">
            <DialogPanel className="relative w-full max-h-[90vh] pointer-events-auto">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="bg-white rounded-t-3xl shadow-2xl flex flex-col"
              >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 text-sm font-normal text-violet-electric">
                      ({activeFiltersCount})
                    </span>
                  )}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleReset}
                      className="text-sm text-violet-electric hover:underline font-medium"
                    >
                      Réinitialiser
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Fermer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('category')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'category'
                      ? 'text-violet-electric border-b-2 border-violet-electric'
                      : 'text-gray-500'
                  }`}
                >
                  Catégories
                </button>
                <button
                  onClick={() => setActiveTab('brand')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'brand'
                      ? 'text-violet-electric border-b-2 border-violet-electric'
                      : 'text-gray-500'
                  }`}
                >
                  Marques
                </button>
                <button
                  onClick={() => setActiveTab('price')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'price'
                      ? 'text-violet-electric border-b-2 border-violet-electric'
                      : 'text-gray-500'
                  }`}
                >
                  Prix
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Catégories */}
                {activeTab === 'category' && (
                  <div className="space-y-2">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => toggleCategory(option.id)}
                        className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                          selectedCategories.includes(option.id)
                            ? 'bg-violet-electric/10 text-violet-electric border-2 border-violet-electric'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {option.icon && (
                          <span className="flex-shrink-0">{option.icon}</span>
                        )}
                        <span className="flex-1 font-medium">{option.label}</span>
                        {selectedCategories.includes(option.id) && (
                          <svg className="w-5 h-5 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Marques */}
                {activeTab === 'brand' && (
                  <div className="space-y-2">
                    {brandOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => toggleBrand(option.id)}
                        className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between ${
                          selectedBrands.includes(option.id)
                            ? 'bg-violet-electric/10 text-violet-electric border-2 border-violet-electric'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium">{option.label}</span>
                        {selectedBrands.includes(option.id) && (
                          <svg className="w-5 h-5 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Prix */}
                {activeTab === 'price' && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Prix minimum</span>
                        <span className="text-sm font-bold text-violet-electric">
                          {priceRange.min} €
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-electric"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Prix maximum</span>
                        <span className="text-sm font-bold text-violet-electric">
                          {priceRange.max} €
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-electric"
                      />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">
                        Fourchette de prix
                      </p>
                      <p className="text-lg font-bold text-violet-electric mt-1">
                        {priceRange.min} € - {priceRange.max} €
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer avec bouton Appliquer */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <button
                  onClick={handleApply}
                  className="w-full py-3.5 bg-violet-electric text-white rounded-lg font-semibold text-base hover:bg-violet-700 transition-colors shadow-lg active:scale-98"
                >
                  Appliquer les filtres
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
              </motion.div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

