import React, { useMemo, useState } from 'react';
import { ArrowLeft, Clock, MapPin, MessageSquare, ShoppingBag, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCommerce } from '../../hooks/useCommerce';
import type { MarketplaceProduct } from '../../types';
import {
  getCategoryLabel,
  getCategoryListings,
  getMarketplaceCategoryTab,
  marketplaceCategories
} from './marketplaceData';

interface MarketplaceCategoryPageProps {
  categoryId: string;
  onNavigate?: (tab: string) => void;
  onSignInClick?: () => void;
}

const categoryDescriptions: Record<string, string> = {
  all: 'Browse the full marketplace catalog across services, goods, and student offers.',
  services: 'Explore expert services for assignments, research, design, and technical support.',
  goods: 'See physical marketplace goods and student-ready essentials available right now.',
  'assignment-help': 'Assignment-focused help from verified experts with clear delivery timelines.',
  research: 'Research, thesis, proposal, and manuscript support gathered in one place.',
  design: 'Presentation, slide, and design support for academic and project delivery.',
  coding: 'Programming, tutorials, debugging, and data support listings for technical work.',
  books: 'Books and academic materials available for purchase from marketplace sellers.',
  gadgets: 'Student tech, laptops, and related devices listed in the marketplace.'
};

export const MarketplaceCategoryPage: React.FC<MarketplaceCategoryPageProps> = ({
  categoryId,
  onNavigate,
  onSignInClick
}) => {
  const { user } = useAuth();
  const { addToCart } = useCommerce();
  const [currentPage, setCurrentPage] = useState(1);

  const listings = useMemo(() => getCategoryListings(categoryId), [categoryId]);
  const categoryLabel = getCategoryLabel(categoryId);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(listings.length / itemsPerPage));
  const paginatedListings = listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const promptSignIn = () => {
    onSignInClick?.();
  };

  const handleAddToCart = (item: MarketplaceProduct) => {
    if (!user) {
      promptSignIn();
      return;
    }

    addToCart(item);
    onNavigate?.('cart');
  };

  const handleConnect = () => {
    if (!user) {
      promptSignIn();
      return;
    }

    onNavigate?.('messages');
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  return (
    <div className="space-y-6">
      <div className="glass-panel neo-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onNavigate?.('marketplace')}
              className="inline-flex items-center gap-2 text-sm text-cyan-700 hover:text-cyan-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-violet-500/80">Category Page</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                {categoryLabel}
              </h1>
              <p className="mt-2 max-w-3xl text-slate-600">
                {categoryDescriptions[categoryId] || 'Browse curated listings for this marketplace category.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="neo-card border border-slate-200 bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Items</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{listings.length}</p>
            </div>
            <div className="neo-card border border-slate-200 bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pages</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{totalPages}</p>
            </div>
            <div className="neo-card border border-slate-200 bg-white/80 px-4 py-3 col-span-2 sm:col-span-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
              <p className="mt-1 text-base font-semibold text-slate-900">Category populated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel neo-card p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          {marketplaceCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onNavigate?.(getMarketplaceCategoryTab(category.id))}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                category.id === categoryId
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_12px_24px_rgba(96,165,250,0.22)]'
                  : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel neo-card p-4 md:p-5">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{categoryLabel} Listings</h2>
            <p className="text-sm text-slate-600">Page {currentPage} of {totalPages}</p>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="glass-panel border border-dashed border-slate-200 p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No items in this category yet</h3>
            <p className="text-slate-600">Choose another category or return to the main marketplace.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paginatedListings.map((item) => (
                <div key={item.id} className="glass-panel neo-card overflow-hidden floating-card">
                  <div className="relative h-48 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-r ${item.imageAccent || 'from-violet-500 to-cyan-400'}`} />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.imageAccent || 'from-violet-500 to-cyan-400'} via-black/10 to-transparent`} />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
                      <span className="inline-flex items-center bg-slate-100 text-slate-700 px-2.5 py-1 text-xs font-semibold">
                        {item.itemType === 'service' ? 'Service' : 'Goods'}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">Featured</span>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <p className="text-sm text-white/80 mb-1">{item.sellerName}</p>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{item.delivery}</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">{item.itemType === 'service' ? 'Starting at' : 'Price'}</p>
                        <p className="text-2xl font-bold text-slate-900">₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-medium hover:from-violet-500 hover:to-cyan-400 transition-all neon-button"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleConnect}
                          className="px-4 py-2 border border-slate-200 bg-white/80 text-slate-700 font-medium hover:bg-white transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-200 bg-white/80 text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[40px] px-3 py-2 border transition-colors ${
                        currentPage === page
                          ? 'border-violet-500 bg-gradient-to-r from-violet-500 to-cyan-400 text-white'
                          : 'border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-200 bg-white/80 text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
