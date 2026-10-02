import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  MessageSquare,
  Menu,
  Plus,
  Search,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCommerce } from '../../hooks/useCommerce';
import { SiteFooter } from '../Footer/SiteFooter';
import { VerificationBanner } from '../Auth/VerificationBanner';
import type { MarketplaceProduct } from '../../types';
import {
  categoryRail,
  categoryRailToCategoryId,
  expertProfiles,
  marketplaceCategories,
  marketplaceItems,
  parsePrice,
  promoAds,
  searchPrompts,
  storefrontLinks,
  studentNeedItems,
  toMarketplaceProduct,
  getMarketplaceCategoryTab
} from './marketplaceData';

interface MarketplaceProps {
  onNavigate?: (tab: string) => void;
  onSignInClick?: () => void;
  onRegisterClick?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onNavigate, onSignInClick, onRegisterClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSlide, setActiveSlide] = useState(0);
  const [showBrowseCategoriesModal, setShowBrowseCategoriesModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchPromptIndex, setSearchPromptIndex] = useState(0);
  const [visiblePromptWords, setVisiblePromptWords] = useState(1);
  const [promoAdIndex, setPromoAdIndex] = useState(0);
  const [promoTypingIndex, setPromoTypingIndex] = useState(0);
  const [isPromoAdSliding, setIsPromoAdSliding] = useState(false);
  const [trendingPage, setTrendingPage] = useState(1);
  const [studentItemsPage, setStudentItemsPage] = useState(1);
  const [featuredExpertsPage, setFeaturedExpertsPage] = useState(1);
  const { user } = useAuth();
  const { addToCart, cartCount } = useCommerce();

  const isVerifiedStudent = user?.userType === 'student' && user.isVerified;
  const isUnverifiedStudent = user?.userType === 'student' && !user.isVerified;
  const isPublicView = !user;

  const heroSlides = [
    {
      eyebrow: 'Marketplace spotlight',
      title: 'Buy trusted academic services with clear pricing',
      description: 'Discover vetted experts, compare turnaround time, and purchase support for assignments, research, design, and coding.',
      statLabel: 'Active service offers',
      statValue: '128+',
      accent: 'from-purple-600 via-indigo-600 to-blue-600'
    },
    {
      eyebrow: 'Trending now',
      title: 'Students are booking fast-turnaround expert help',
      description: 'From statistics and proposal reviews to pitch decks and data cleaning, the most requested support is already listed.',
      statLabel: 'Booked this week',
      statValue: '46',
      accent: 'from-slate-900 via-purple-800 to-indigo-700'
    },
    {
      eyebrow: 'Sell on CampusLink',
      title: 'Verified students can list goods or services from their account',
      description: 'Offer textbooks, gadgets, templates, tutoring, or study support directly from your student profile once verified.',
      statLabel: 'Verified student sellers',
      statValue: '32',
      accent: 'from-emerald-600 via-teal-600 to-cyan-600'
    }
  ];

  const categories = marketplaceCategories;

  const semanticSynonyms: Record<string, string[]> = {
    assignment: ['homework', 'coursework', 'project'],
    help: ['support', 'assist', 'tutor', 'guidance'],
    research: ['thesis', 'proposal', 'literature', 'methodology'],
    proposal: ['topic', 'methodology', 'outline'],
    presentation: ['slides', 'ppt', 'powerpoint', 'defense', 'deck'],
    design: ['graphics', 'branding', 'ui', 'visual'],
    coding: ['programming', 'python', 'javascript', 'debugging', 'data'],
    statistics: ['stats', 'regression', 'spss', 'r', 'analysis'],
    laptop: ['computer', 'pc', 'notebook'],
    gadgets: ['devices', 'tech', 'electronics'],
    books: ['textbook', 'materials', 'handouts', 'notes'],
    accommodation: ['housing', 'hostel', 'bed', 'rent', 'room', 'off-campus'],
    hostel: ['bed', 'room', 'essentials'],
    utensils: ['kitchen', 'pots', 'plates', 'kettle']
  };

  const stopWords = new Set(['the', 'a', 'an', 'to', 'for', 'and', 'or', 'with', 'in', 'on', 'at', 'of', 'by']);

  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .replace(/[’'"]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const tokenize = (value: string) =>
    normalizeText(value)
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length > 1 && !stopWords.has(token));

  const expandQueryTokens = (tokens: string[]) => {
    const expanded = new Set(tokens);
    tokens.forEach((token) => {
      const synonyms = semanticSynonyms[token];
      if (!synonyms) return;
      synonyms.forEach((synonym) => expanded.add(synonym));
    });
    return Array.from(expanded);
  };

  const tokenVariants = (token: string) => {
    const variants = new Set([token]);
    if (token.endsWith('s') && token.length > 3) variants.add(token.slice(0, -1));
    if (!token.endsWith('s')) variants.add(`${token}s`);
    return Array.from(variants);
  };

  const toTrigrams = (value: string) => {
    const padded = `  ${value} `;
    const grams: string[] = [];
    for (let i = 0; i < padded.length - 2; i += 1) {
      grams.push(padded.slice(i, i + 3));
    }
    return grams;
  };

  const trigramSimilarity = (a: string, b: string) => {
    const gramsA = toTrigrams(a);
    const gramsB = toTrigrams(b);
    if (gramsA.length === 0 || gramsB.length === 0) return 0;
    const setB = new Map<string, number>();
    gramsB.forEach((gram) => setB.set(gram, (setB.get(gram) || 0) + 1));
    let matches = 0;
    gramsA.forEach((gram) => {
      const count = setB.get(gram) || 0;
      if (count > 0) {
        matches += 1;
        setB.set(gram, count - 1);
      }
    });
    return (2 * matches) / (gramsA.length + gramsB.length);
  };

  const semanticScore = (item: {
    title: string;
    expert?: string;
    description?: string;
    category: string;
    kind?: string;
  }, query: string) => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return 0;

    const queryTokens = expandQueryTokens(tokenize(normalizedQuery));
    const searchableTitle = normalizeText(item.title);
    const searchableDescription = normalizeText(item.description || '');
    const searchable = normalizeText(
      [
        item.title,
        item.expert,
        item.description,
        item.category,
        item.kind,
        categories.find((category) => category.id === item.category)?.label
      ]
        .filter(Boolean)
        .join(' ')
    );
    const searchableTokens = new Set(tokenize(searchable));

    let score = 0;
    let directMatches = 0;

    if (searchable.includes(normalizedQuery)) {
      score += 12;
      directMatches += 2;
    }

    queryTokens.forEach((token) => {
      const variants = tokenVariants(token);
      const titleTokenMatch = variants.some((variant) => searchableTitle.includes(variant));
      const descriptionTokenMatch = variants.some((variant) => searchableDescription.includes(variant));
      const tokenMatch = variants.some((variant) => searchableTokens.has(variant) || searchable.includes(variant));

      if (titleTokenMatch) {
        score += 4;
        directMatches += 1;
        return;
      }

      if (descriptionTokenMatch || tokenMatch) {
        score += 2;
        directMatches += 1;
      }
    });

    if (directMatches === 0) {
      const titleSim = trigramSimilarity(normalizedQuery, searchableTitle);
      const descSim = trigramSimilarity(normalizedQuery, searchableDescription);
      const bestSimilarity = Math.max(titleSim, descSim);
      if (bestSimilarity >= 0.55) {
        score += bestSimilarity * 4;
      }
    }

    return score;
  };


  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [heroSlides.length]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    const candidates = marketplaceItems
      .map((item) => ({
        ...item,
        _semanticScore: normalizedQuery.length > 0 ? semanticScore(item, normalizedQuery) : 0
      }))
      .filter((item) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          (selectedCategory === 'services' && item.kind === 'Service') ||
          (selectedCategory === 'goods' && item.kind === 'Goods') ||
          item.category === selectedCategory;

        if (!matchesCategory) return false;
        if (normalizedQuery.length === 0) return true;

        return item._semanticScore >= 3;
      })
      .sort((a, b) => (b._semanticScore || 0) - (a._semanticScore || 0));

    return candidates;
  }, [marketplaceItems, normalizedQuery, selectedCategory]);

  const modalSearchResults = useMemo(() => {
    if (normalizedQuery.length === 0) return [];

    const marketplaceSearchItems = marketplaceItems.map((item) => ({
      id: `market-${item.id}`,
      title: item.title,
      sellerName: item.expert,
      kind: item.kind,
      categoryLabel: categories.find((category) => category.id === item.category)?.label || 'Listing',
      location: item.location,
      delivery: item.delivery,
      price: item.price,
      actionLabel: item.kind === 'Service' ? 'Buy' : 'View',
      source: 'marketplace' as const,
      originalItem: item,
      score: semanticScore(item, normalizedQuery)
    }));

    const studentSearchItems = studentNeedItems.map((item) => ({
      id: `student-${item.id}`,
      title: item.title,
      sellerName: item.sellerName,
      kind: 'Goods',
      categoryLabel: item.tag,
      location: item.location,
      delivery: item.delivery,
      price: item.price,
      actionLabel: 'View',
      source: 'student-needs' as const,
      originalItem: {
        ...item,
        category: item.tag.toLowerCase(),
        kind: 'Goods',
        gradient: 'from-slate-700 to-slate-900',
        description: item.subtitle
      },
      score: semanticScore({
        title: item.title,
        expert: item.sellerName,
        description: `${item.subtitle} ${item.tag}`,
        category: item.tag.toLowerCase(),
        kind: 'Goods'
      }, normalizedQuery)
    }));

    return [...marketplaceSearchItems, ...studentSearchItems]
      .filter((item) => item.score >= 3)
      .sort((a, b) => b.score - a.score);
  }, [categories, marketplaceItems, normalizedQuery, studentNeedItems]);

  const currentSlide = heroSlides[activeSlide];
  const visibleBrowseCategories = categoryRail.slice(0, 4);
  const currentSearchPromptWords = searchPrompts[searchPromptIndex].split(' ');
  const animatedSearchPrompt = currentSearchPromptWords.slice(0, visiblePromptWords).join(' ');
  const currentPromoAd = promoAds[promoAdIndex];
  const animatedPromoAd = currentPromoAd.message.slice(0, promoTypingIndex);
  const TRENDING_ITEMS_PER_PAGE = 3;
  const STUDENT_ITEMS_PER_PAGE = 4;
  const FEATURED_EXPERTS_PER_PAGE = 3;
  const trendingTotalPages = Math.max(1, Math.ceil(filteredItems.length / TRENDING_ITEMS_PER_PAGE));
  const studentItemsTotalPages = Math.max(1, Math.ceil(studentNeedItems.length / STUDENT_ITEMS_PER_PAGE));
  const featuredExpertsTotalPages = Math.max(1, Math.ceil(expertProfiles.length / FEATURED_EXPERTS_PER_PAGE));
  const paginatedTrendingItems = filteredItems.slice(
    (trendingPage - 1) * TRENDING_ITEMS_PER_PAGE,
    trendingPage * TRENDING_ITEMS_PER_PAGE
  );
  const paginatedStudentItems = studentNeedItems.slice(
    (studentItemsPage - 1) * STUDENT_ITEMS_PER_PAGE,
    studentItemsPage * STUDENT_ITEMS_PER_PAGE
  );
  const paginatedExpertProfiles = expertProfiles.slice(
    (featuredExpertsPage - 1) * FEATURED_EXPERTS_PER_PAGE,
    featuredExpertsPage * FEATURED_EXPERTS_PER_PAGE
  );

  useEffect(() => {
    setTrendingPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (!showBrowseCategoriesModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowBrowseCategoriesModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBrowseCategoriesModal]);

  useEffect(() => {
    if (!showSearchModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal]);

  useEffect(() => {
    const isPromptComplete = visiblePromptWords >= currentSearchPromptWords.length;
    const timeoutId = window.setTimeout(() => {
      if (isPromptComplete) {
        setSearchPromptIndex((currentIndex) => (currentIndex + 1) % searchPrompts.length);
        setVisiblePromptWords(1);
        return;
      }

      setVisiblePromptWords((currentCount) => currentCount + 1);
    }, isPromptComplete ? 1200 : 320);

    return () => window.clearTimeout(timeoutId);
  }, [currentSearchPromptWords.length, searchPrompts.length, visiblePromptWords, searchPromptIndex]);

  useEffect(() => {
    let timeoutId: number;
    let slideTimeoutId: number | undefined;
    const isPromoComplete = promoTypingIndex >= currentPromoAd.message.length;

    if (isPromoComplete) {
      timeoutId = window.setTimeout(() => {
        setIsPromoAdSliding(true);
        slideTimeoutId = window.setTimeout(() => {
          setPromoAdIndex((currentIndex) => (currentIndex + 1) % promoAds.length);
          setPromoTypingIndex(0);
          setIsPromoAdSliding(false);
        }, 260);
      }, 1700);
    } else {
      timeoutId = window.setTimeout(() => {
        setPromoTypingIndex((currentCount) => currentCount + 1);
      }, 42);
    }

    return () => {
      window.clearTimeout(timeoutId);
      if (slideTimeoutId) window.clearTimeout(slideTimeoutId);
    };
  }, [currentPromoAd.message, promoAds.length, promoTypingIndex]);

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Page <span className="font-medium text-slate-900">{currentPage}</span> of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-slate-200 bg-white/80 text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] px-3 py-2 border transition-colors ${
                currentPage === page
                  ? 'border-violet-500 bg-gradient-to-r from-violet-500 to-cyan-400 text-white'
                  : 'border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-slate-200 bg-white/80 text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const promptSignIn = () => {
    onSignInClick?.();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddItemToCart = (item: Parameters<typeof toMarketplaceProduct>[0], navigateToCart = false) => {
    if (!user) {
      promptSignIn();
      return;
    }

    addToCart(toMarketplaceProduct(item));

    if (navigateToCart) {
      onNavigate?.('cart');
    }
  };

  const handleConnectExpert = () => {
    if (!user) {
      promptSignIn();
      return;
    }

    onNavigate?.('messages');
  };

  const handleSellAction = () => {
    if (!user) {
      onRegisterClick?.();
      return;
    }

    onNavigate?.('profile');
  };

  const handleAccountAction = () => {
    if (!user) {
      onSignInClick?.();
      return;
    }

    onNavigate?.('profile');
  };

  const handleCartAction = () => {
    if (!user) {
      onSignInClick?.();
      return;
    }

    onNavigate?.('cart');
  };

  const scrollToTrending = () => {
    scrollToSection('trending-goods-and-services');
  };

  const handleBrowseCategoryClick = (label: string) => {
    const categoryId = categoryRailToCategoryId[label] ?? 'all';
    setShowBrowseCategoriesModal(false);
    onNavigate?.(getMarketplaceCategoryTab(categoryId));
  };

  const handleStorefrontLinkClick = (link: string) => {
    switch (link) {
      case 'Campus Essentials':
        onNavigate?.(getMarketplaceCategoryTab('books'));
        return;
      case 'Expert Services':
        onNavigate?.(getMarketplaceCategoryTab('services'));
        return;
      case 'Study Tech':
        onNavigate?.(getMarketplaceCategoryTab('gadgets'));
        return;
      case 'Hot Deals':
        onNavigate?.(getMarketplaceCategoryTab('all'));
        return;
      case 'Verified Sellers':
        scrollToSection('featured-experts');
        return;
      case 'Bulk Offers':
        scrollToSection('student-items-for-sale');
        return;
      default:
        scrollToTrending();
    }
  };

  return (
    <div className="space-y-5 text-slate-900">
      {user && !user.isVerified && <VerificationBanner />}

      {showBrowseCategoriesModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/25 backdrop-blur-sm"
            onClick={() => setShowBrowseCategoriesModal(false)}
            aria-label="Close categories modal"
          />
          <div className="relative w-full max-w-2xl glass-panel-strong neo-card overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-200/70 bg-white/60">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Browse Categories</h3>
                <p className="text-sm text-slate-600">Pick a category without expanding the page layout.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowBrowseCategoriesModal(false)}
                className="px-3 py-2 border border-slate-200 bg-white/80 text-slate-600 hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {categoryRail.map((item) => (
                  <button
                    key={`modal-${item.label}`}
                    type="button"
                    onClick={() => handleBrowseCategoryClick(item.label)}
                    className="neo-card bg-white/75 border border-slate-200 p-4 text-left hover:bg-white transition-colors"
                  >
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-600 mt-1">{item.hint}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSearchModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/25 backdrop-blur-sm"
            onClick={() => setShowSearchModal(false)}
            aria-label="Close search modal"
          />
          <div className="relative w-full max-w-2xl glass-panel-strong neo-card overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-200/70 bg-white/60">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Search listings</h3>
                <p className="text-sm text-slate-600">Type to search without shifting the page layout.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="px-3 py-2 border border-slate-200 bg-white/80 text-slate-600 hover:bg-white transition-colors"
              >
                Done
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={animatedSearchPrompt}
                  className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-white/85 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none shadow-sm rounded-2xl"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-slate-600">
                  {searchQuery.trim().length > 0 ? (
                    <>
                      Showing results for <span className="font-semibold text-slate-900">“{searchQuery.trim()}”</span>
                    </>
                  ) : (
                    'Tip: Try “statistics”, “proposal”, “laptop”, or “presentation”.'
                  )}
                </p>
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-2 border border-slate-200 bg-white/80 text-slate-700 hover:bg-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {searchQuery.trim().length > 0 && (
                <div className="border border-slate-200 bg-white/70 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 bg-white/60 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      Results ({modalSearchResults.length})
                    </p>
                    {modalSearchResults.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearchModal(false);
                          scrollToTrending();
                        }}
                        className="text-sm font-medium text-cyan-700 hover:text-cyan-800 transition-colors"
                      >
                        View all
                      </button>
                    )}
                  </div>

                  {modalSearchResults.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-sm text-slate-600">No results found. Try another keyword.</p>
                    </div>
                  ) : (
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                      {modalSearchResults.slice(0, 6).map((item) => (
                        <button
                          key={`search-${item.id}`}
                          type="button"
                          onClick={() => {
                            setShowSearchModal(false);
                            handleAddItemToCart(item.originalItem, true);
                          }}
                          className="w-full text-left px-4 py-4 hover:bg-white transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              {'imageUrl' in item.originalItem && item.originalItem.imageUrl ? (
                                <img
                                  src={item.originalItem.imageUrl}
                                  alt={item.title}
                                  className="h-16 w-16 shrink-0 rounded-xl object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-slate-100" />
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                                <p className="text-sm text-slate-600 truncate">{item.sellerName}</p>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                                  <span className="inline-flex items-center bg-slate-100 text-slate-700 px-2 py-1 font-semibold">
                                    {item.kind}
                                  </span>
                                  <span className="inline-flex items-center bg-violet-50 text-violet-700 px-2 py-1 font-semibold">
                                    {item.categoryLabel}
                                  </span>
                                  <span className="inline-flex items-center">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    {item.location}
                                  </span>
                                  <span className="inline-flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    {item.delivery}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm text-slate-500">{item.kind === 'Service' ? 'Starting at' : 'Price'}</p>
                              <p className="text-lg font-bold text-slate-900">{item.price}</p>
                              <p className="text-xs text-cyan-700 mt-2 font-medium">{item.actionLabel}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-[50px] overflow-hidden border border-violet-200/70 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)_240px]">
          <div className="flex h-full items-center justify-center gap-2 border-r border-violet-200/60 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-3 text-white sm:px-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">CampusLink</span>
            <span className="text-sm font-black tracking-tight sm:text-base">Live Ads</span>
          </div>
          <div className="flex h-full items-center overflow-hidden bg-[linear-gradient(90deg,rgba(139,92,246,0.08),rgba(34,211,238,0.08))] px-3 sm:px-4 lg:pr-2">
            <span className="mr-3 hidden h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_12px_rgba(96,165,250,0.35)] sm:inline-flex" />
            <div className="min-w-0 overflow-hidden">
              <div
                className={`flex items-center gap-1 transition-all duration-300 ${
                  isPromoAdSliding ? '-translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
                }`}
              >
                <p className="truncate bg-gradient-to-r from-violet-700 via-fuchsia-600 to-cyan-600 bg-clip-text text-sm font-semibold text-transparent sm:text-[15px]">
                  {animatedPromoAd}
                </p>
                <span className="shrink-0 text-cyan-500 animate-pulse">|</span>
              </div>
            </div>
          </div>
          <div className="relative hidden h-full overflow-hidden bg-[linear-gradient(90deg,rgba(139,92,246,0.08),rgba(34,211,238,0.08))] pl-0 pr-2 text-white lg:flex">
            <div className="absolute inset-0 opacity-35">
              <div className="absolute -left-3 top-1 h-8 w-8 rounded-full bg-white/35 blur-sm" style={{ animation: 'drift 4.8s ease-in-out infinite' }} />
              <div className="absolute right-5 top-0 h-6 w-6 rounded-full bg-cyan-200/75 blur-[1px]" style={{ animation: 'floatY 2.8s ease-in-out infinite' }} />
              <div className="absolute bottom-1 left-10 h-5 w-20 rounded-full bg-white/20" style={{ animation: 'shimmer 2.6s linear infinite', backgroundSize: '200% 100%' }} />
            </div>

            <div
              className={`relative z-10 flex h-full w-full items-center gap-2 transition-all duration-300 ${
                isPromoAdSliding ? 'translate-x-3 opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              <div className="min-w-0 flex-1 pl-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-600/75">{currentPromoAd.label}</p>
                <p className="truncate bg-gradient-to-r from-violet-700 via-fuchsia-600 to-cyan-600 bg-clip-text text-sm font-black text-transparent">{currentPromoAd.visualTitle}</p>
              </div>

              <div className="flex h-full min-w-0 flex-1 items-center gap-1">
                <div
                  className="relative h-[34px] flex-1 overflow-hidden rounded-lg border border-white/35 bg-white/20 backdrop-blur-sm shadow-[0_8px_16px_rgba(15,23,42,0.16)]"
                  style={{ animation: 'floatY 2.6s ease-in-out infinite' }}
                >
                  <div className="absolute inset-x-2 top-1.5 h-1.5 rounded-full bg-white/85" />
                  <div className="absolute inset-x-2 top-5 h-2.5 rounded-sm bg-gradient-to-r from-violet-500/90 to-cyan-300/90" />
                </div>
                <div
                  className="relative h-[38px] flex-1 overflow-hidden rounded-xl border border-white/35 bg-white/28 backdrop-blur-sm shadow-[0_10px_18px_rgba(15,23,42,0.18)]"
                  style={{ animation: 'drift 5.2s ease-in-out infinite' }}
                >
                  <div className="absolute inset-x-2 top-2 h-2 rounded-full bg-white/90" />
                  <div className="absolute inset-x-2 top-5.5 h-3 rounded-md bg-slate-900/15" />
                </div>
                <div
                  className="relative h-[34px] w-[42px] overflow-hidden rounded-lg border border-white/35 bg-white/18 backdrop-blur-sm shadow-[0_10px_18px_rgba(15,23,42,0.18)]"
                  style={{ animation: 'floatY 2.2s ease-in-out infinite' }}
                >
                  <div className="absolute inset-x-1.5 top-1.5 h-1.5 rounded-full bg-white/85" />
                  <div className="absolute inset-x-1.5 bottom-1.5 h-4 rounded-md bg-gradient-to-b from-white/65 to-white/20" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setShowBrowseCategoriesModal(true)}
              className="inline-flex items-center justify-center border border-slate-200 bg-slate-50 p-2.5 text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open categories"
            >
              <Menu className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.('marketplace')}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 text-base font-black text-white glow-ring shadow-[0_8px_20px_rgba(104,82,255,0.28)]">
                CL
              </div>
              <div className="leading-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-500/80">Student Commerce</p>
                <p className="mt-1 text-3xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent sm:text-[2.2rem]">CampusLink</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleAccountAction}
              className="inline-flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors sm:h-14 sm:w-14"
              aria-label={user ? 'Open profile' : 'Sign in'}
            >
              <User className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>
            <button
              type="button"
              onClick={handleCartAction}
              className="relative inline-flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors sm:h-14 sm:w-14"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8" />
              {user && cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center bg-gradient-to-r from-violet-600 to-cyan-500 px-1 text-[11px] font-semibold text-white shadow-[0_0_18px_rgba(96,165,250,0.45)]">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-[#fbfbfc] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
            {storefrontLinks.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => handleStorefrontLinkClick(link)}
                className="text-slate-700 hover:text-cyan-700 transition-colors"
              >
                {link}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="inline-flex w-[220px] sm:w-[280px] lg:w-[320px] flex-shrink-0 items-center gap-3 px-4 py-2 border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-colors shadow-sm overflow-hidden"
              aria-label="Open search modal"
            >
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className={`${searchQuery.trim().length > 0 ? 'text-slate-900' : 'text-slate-400'} flex items-center gap-1 min-w-0`}>
                <span className="truncate">{searchQuery.trim().length > 0 ? searchQuery : animatedSearchPrompt}</span>
                {searchQuery.trim().length === 0 && (
                  <span className="text-cyan-500 animate-pulse">|</span>
                )}
              </span>
            </button>

            {isPublicView && (
              <>
                <button
                  type="button"
                  onClick={onSignInClick}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-medium hover:from-violet-500 hover:to-cyan-400 transition-all neon-button"
                >
                  Create account
                </button>
              </>
            )}

            {isVerifiedStudent && (
              <button
                type="button"
                onClick={handleSellAction}
                className="px-4 py-2 font-medium flex items-center gap-2 transition-all bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400 neon-button"
                title="Add a new marketplace listing from your student account"
              >
                <Plus className="w-4 h-4" />
                <span>Add Listing</span>
              </button>
            )}

            {isUnverifiedStudent && (
              <button
                type="button"
                className="px-4 py-2 font-medium flex items-center gap-2 transition-all bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                disabled
                title="Only verified student accounts can add marketplace listings"
              >
                <Plus className="w-4 h-4" />
                <span>Verify to Add Listing</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[260px_minmax(0,1.2fr)_300px] gap-4">
        <div className="glass-panel neo-card overflow-hidden h-[450px] sm:h-[470px] lg:h-[490px] flex flex-col">
          <div className="px-5 py-4 bg-white/60 border-b border-slate-200 text-slate-900">
            <h2 className="font-semibold">Browse Categories</h2>
          </div>
          <div className="flex-1 divide-y divide-white/10">
            {visibleBrowseCategories.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleBrowseCategoryClick(item.label)}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.hint}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-300/70" />
              </button>
            ))}
            {categoryRail.length > 4 && (
              <button
                type="button"
                onClick={() => setShowBrowseCategoriesModal(true)}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 bg-slate-50/80"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {`More categories (${categoryRail.length - 4})`}
                  </p>
                  <p className="text-sm text-slate-500">
                    Open all categories in a modal overlay
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-cyan-300/70" />
              </button>
            )}
          </div>
        </div>

        <div
          className={`relative h-[450px] sm:h-[470px] lg:h-[490px] overflow-hidden bg-gradient-to-r ${currentSlide.accent} text-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] neo-card`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02)_35%,rgba(255,255,255,0.08))]" />
          <div className="absolute -top-8 right-16 w-32 h-32 rounded-full bg-white/10 blur-2xl floating-card" />
          <div className="absolute bottom-10 left-14 w-28 h-28 rounded-full bg-cyan-300/10 blur-2xl floating-card" style={{ animationDelay: '-2.4s' }} />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/10 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/10 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent" />
          <div className="relative h-full p-5 sm:p-6 lg:p-8">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex w-fit items-center gap-2 bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white/90 border border-white/10 backdrop-blur-sm glow-ring">
                  <Sparkles className="w-4 h-4" />
                  {currentSlide.eyebrow}
                </div>
                <div className="inline-flex w-fit items-center gap-2 bg-black/15 px-4 py-2 text-xs sm:text-sm font-medium text-white border border-white/10 backdrop-blur-sm">
                  <ShoppingBag className="w-4 h-4" />
                  Sell on Marketplace
                </div>
              </div>
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{currentSlide.title}</h2>
                <p className="mt-3 text-white/85 text-sm sm:text-base lg:text-lg max-w-xl">{currentSlide.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToTrending}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-gray-900 text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors shadow-sm neon-button"
                >
                  Explore Marketplace
                </button>
                <button
                  onClick={handleConnectExpert}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 border border-white/25 bg-white/10 text-white text-sm sm:text-base font-semibold hover:bg-white/15 transition-colors backdrop-blur-sm"
                >
                  Connect to Expert
                </button>
                <button
                  onClick={handleSellAction}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 border border-white/25 bg-black/15 text-white text-sm sm:text-base font-semibold hover:bg-black/20 transition-colors backdrop-blur-sm"
                >
                  Sell on Marketplace
                </button>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div className="bg-white/30 backdrop-blur-sm border border-white/30 p-4 sm:p-5 w-[260px] max-w-full shrink-0 rounded-none shadow-[0_14px_34px_rgba(131,148,184,0.18)]">
                  <p className="text-xs sm:text-sm text-white/70">{currentSlide.statLabel}</p>
                  <p className="text-3xl sm:text-4xl font-bold mt-1">{currentSlide.statValue}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.title}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`h-2.5 transition-all ${activeSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/40'}`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)}
                      className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)}
                      className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 h-[450px] sm:h-[470px] lg:h-[490px]">
          <div className="glass-panel neo-card p-5 h-full flex flex-col overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300 mb-2">Sell on CampusLink</p>
            <h3 className="text-xl font-semibold text-slate-900">Sell on the marketplace</h3>
            <p className="text-sm text-slate-600 mt-2">Verified students can list study goods or approved services directly from their account.</p>
            <div className="mt-4 space-y-3 flex-1">
              <div className="bg-white/70 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-900 font-medium mb-1">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Verified student status required
                </div>
                <p className="text-sm text-slate-600">Verification protects buyers and keeps seller listings trustworthy.</p>
              </div>
              <div className="bg-white/70 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-900 font-medium mb-1">
                  <Plus className="w-4 h-4 text-purple-600" />
                  Add listing from your account
                </div>
                <p className="text-sm text-slate-600">Once verified, your student profile can publish goods or service offers to the storefront.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel neo-card p-4 md:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="flex items-center text-sm text-slate-500 px-3">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </div>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onNavigate?.(getMarketplaceCategoryTab(category.id))}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_12px_24px_rgba(96,165,250,0.22)]'
                    : 'bg-white/70 text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="neo-card bg-white/70 border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-purple-300 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">Buy a service</span>
            </div>
            <p className="text-sm text-slate-600">Choose a ready-made service with a clear price, scope, and delivery window.</p>
          </div>
          <div className="neo-card bg-white/70 border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold">Connect to an expert</span>
            </div>
            <p className="text-sm text-slate-600">Start a conversation when you need a custom solution or one-on-one guidance.</p>
          </div>
          <div className="neo-card bg-white/70 border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-emerald-300 mb-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold">Sell from your account</span>
            </div>
            <p className="text-sm text-slate-600">Verified students can publish listings for goods or study services directly from their account.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel neo-card p-4 md:p-5">
        <div id="trending-goods-and-services" className="flex items-center justify-between mb-4 scroll-mt-24">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Trending goods and services</h2>
            <p className="text-sm text-slate-600">{filteredItems.length} results matching your search</p>
          </div>
          {filteredItems.length > TRENDING_ITEMS_PER_PAGE && (
            <p className="text-sm text-slate-500">Paginated listings</p>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="glass-panel border border-dashed border-slate-200 p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No listings found</h3>
            <p className="text-slate-600">Try another keyword or switch to a different marketplace category.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedTrendingItems.map((item, index) => (
              <div
                key={item.id}
                className="glass-panel neo-card overflow-hidden floating-card"
                style={{ animationDelay: `${index * 0.35}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} via-black/15 to-transparent`} />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-white">
                    <span className="inline-flex items-center bg-white/20 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm">
                      {item.kind === 'Service' ? <Briefcase className="w-3.5 h-3.5 mr-1" /> : <ShoppingBag className="w-3.5 h-3.5 mr-1" />}
                      {item.kind}
                    </span>
                    <span className="inline-flex items-center bg-black/15 px-3 py-1 text-[11px] font-semibold">
                      <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                      {item.rating}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-xs text-white/80">{item.expert}</p>
                    <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center bg-violet-50 text-violet-700 px-3 py-1 text-[11px] font-semibold">
                      {categories.find((category) => category.id === item.category)?.label || 'Listing'}
                    </span>
                    <span className="inline-flex items-center bg-amber-50 text-amber-700 px-3 py-1 text-[11px] font-semibold">
                      {item.reviews} reviews
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 min-h-[48px]">{item.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-3">
                    <span className="inline-flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {item.location}
                    </span>
                    <span className="inline-flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {item.delivery}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-xs text-slate-500">{item.kind === 'Service' ? 'Starting at' : 'Price'}</p>
                      <p className="text-xl font-bold text-slate-900">{item.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddItemToCart(item, true)}
                        className="px-3 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-medium hover:from-violet-500 hover:to-cyan-400 transition-all neon-button"
                      >
                        {item.kind === 'Service' ? 'Buy' : 'View'}
                      </button>
                      <button
                        onClick={item.kind === 'Service' ? handleConnectExpert : () => handleAddItemToCart(item)}
                        className="px-3 py-2 border border-slate-200 bg-white/80 text-slate-700 text-sm font-medium hover:bg-white transition-colors"
                      >
                        {item.kind === 'Service' ? 'Expert' : 'Seller'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {renderPagination(trendingPage, trendingTotalPages, setTrendingPage)}
      </div>

      <div id="student-items-for-sale" className="glass-panel neo-card p-4 md:p-5 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Student items for sale</h2>
            <p className="text-sm text-slate-600">Browse practical listings like bed space, off-campus options, office supplies, and utensils.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {paginatedStudentItems.map((item) => (
            <div key={item.title} className="neo-card border border-slate-200 bg-white/75 p-4 shadow-sm">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="mb-4 h-40 w-full rounded-2xl object-cover border border-slate-200"
              />
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                  {item.tag}
                </span>
                <ShoppingBag className="w-4 h-4 text-cyan-300/70" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 mt-2 min-h-[40px]">{item.subtitle}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-base font-bold text-slate-900">{item.price}</p>
                <button
                  onClick={() => handleAddItemToCart({
                    ...item,
                    category: item.tag.toLowerCase(),
                    kind: 'Goods',
                    gradient: 'from-slate-700 to-slate-900'
                  }, true)}
                  className="text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
        {renderPagination(studentItemsPage, studentItemsTotalPages, setStudentItemsPage)}
      </div>

      <div id="featured-experts" className="glass-panel neo-card p-5 scroll-mt-24">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Featured experts</h2>
        <p className="text-sm text-slate-600 mb-4">Reach out directly for custom support beyond fixed service packages.</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedExpertProfiles.map((expert) => (
            <div key={expert.id} className="neo-card border border-slate-200 p-4 bg-white/75">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{expert.name}</h3>
                  <p className="text-sm text-slate-600">{expert.specialty}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700">
                  {expert.badge}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <span className="inline-flex items-center">
                  <Star className="w-4 h-4 mr-1 text-amber-500 fill-current" />
                  {expert.rating}
                </span>
                <span>{expert.sessions} sessions</span>
                <span className="font-semibold text-slate-900">{expert.rate}</span>
              </div>
              <button
                onClick={handleConnectExpert}
                className="w-full px-4 py-2 border border-slate-200 bg-white/80 text-cyan-700 font-medium hover:bg-white transition-colors"
              >
                Message Expert
              </button>
            </div>
          ))}
        </div>
        {renderPagination(featuredExpertsPage, featuredExpertsTotalPages, setFeaturedExpertsPage)}
      </div>

      <SiteFooter onNavigate={onNavigate} />

    </div>
  );
};
