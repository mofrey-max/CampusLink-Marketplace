import type { MarketplaceProduct } from '../../types';

const marketplaceImageBase = '/marketplace-images';

export const marketplaceImages = {
  assignment: `${marketplaceImageBase}/statistics-support.jpg`,
  research: `${marketplaceImageBase}/research-support.jpg`,
  design: `${marketplaceImageBase}/presentation-design.jpg`,
  coding: `${marketplaceImageBase}/coding-support.jpg`,
  books: `${marketplaceImageBase}/books-materials.jpg`,
  gadgets: `${marketplaceImageBase}/student-laptop.jpg`,
  accommodation: `${marketplaceImageBase}/student-accommodation.jpg`,
  essentials: `${marketplaceImageBase}/student-essentials.jpg`
} as const;

export const marketplaceCategories = [
  { id: 'all', label: 'All listings' },
  { id: 'services', label: 'Services' },
  { id: 'goods', label: 'Goods' },
  { id: 'assignment-help', label: 'Assignment Help' },
  { id: 'research', label: 'Research Support' },
  { id: 'design', label: 'Design & Presentation' },
  { id: 'coding', label: 'Coding & Data' },
  { id: 'books', label: 'Books & Materials' },
  { id: 'gadgets', label: 'Gadgets' }
] as const;

export type MarketplaceCategoryId = (typeof marketplaceCategories)[number]['id'];

export const marketplaceItems = [
  {
    id: 1,
    title: 'Statistics Assignment Support',
    kind: 'Service',
    category: 'assignment-help',
    expert: 'Dr. Sarah Chen',
    rating: 4.9,
    reviews: 127,
    price: '₦8,500',
    delivery: '24 hours',
    location: 'Abuja, Nigeria',
    description: 'Get guided support for statistics, regression, hypothesis testing, and SPSS or R analysis.',
    gradient: 'from-purple-600 to-blue-600',
    imageUrl: marketplaceImages.assignment
  },
  {
    id: 2,
    title: 'Research Proposal Review',
    kind: 'Service',
    category: 'research',
    expert: 'Prof. Michael Adeyemi',
    rating: 4.8,
    reviews: 84,
    price: '₦12,000',
    delivery: '2 days',
    location: 'Lagos, Nigeria',
    description: 'Improve your topic, methodology, and literature structure before submission.',
    gradient: 'from-slate-800 to-purple-700',
    imageUrl: marketplaceImages.research
  },
  {
    id: 3,
    title: 'PowerPoint and Defense Deck Design',
    kind: 'Service',
    category: 'design',
    expert: 'Grace Okafor',
    rating: 4.7,
    reviews: 52,
    price: '₦6,500',
    delivery: '18 hours',
    location: 'Remote',
    description: 'Turn rough notes into a polished academic presentation with strong visuals and structure.',
    gradient: 'from-fuchsia-600 to-pink-500',
    imageUrl: marketplaceImages.design
  },
  {
    id: 4,
    title: 'Python Data Analysis Session',
    kind: 'Service',
    category: 'coding',
    expert: 'Emmanuel Peters',
    rating: 4.9,
    reviews: 91,
    price: '₦10,000',
    delivery: 'Same day',
    location: 'Remote',
    description: 'Book a one-on-one expert session for pandas, visualization, notebooks, and project debugging.',
    gradient: 'from-cyan-600 to-blue-600',
    imageUrl: marketplaceImages.coding
  },
  {
    id: 7,
    title: 'Programming Assignment Support',
    kind: 'Service',
    category: 'coding',
    expert: 'Daniel Okoro',
    rating: 4.8,
    reviews: 73,
    price: '₦9,500',
    delivery: '24 hours',
    location: 'Remote',
    description: 'Get guided help with programming assignments in Python, JavaScript, Java, and related coursework tasks.',
    gradient: 'from-indigo-600 to-cyan-500',
    imageUrl: marketplaceImages.coding
  },
  {
    id: 8,
    title: 'Programming Tutorial Sessions',
    kind: 'Service',
    category: 'coding',
    expert: 'Amina Yusuf',
    rating: 4.9,
    reviews: 64,
    price: '₦7,000',
    delivery: 'Same day booking',
    location: 'Remote',
    description: 'Interactive tutorial sessions for beginners and intermediate students covering coding concepts, syntax, and practical exercises.',
    gradient: 'from-violet-600 to-blue-500',
    imageUrl: marketplaceImages.coding
  },
  {
    id: 9,
    title: 'Python Programming Tutorial',
    kind: 'Service',
    category: 'coding',
    expert: 'Samuel Eze',
    rating: 4.9,
    reviews: 88,
    price: '₦8,000',
    delivery: 'Same day booking',
    location: 'Remote',
    description: 'Learn Python programming with hands-on tutorials covering basics, functions, data structures, and problem solving.',
    gradient: 'from-emerald-600 to-teal-500',
    imageUrl: marketplaceImages.coding
  },
  {
    id: 10,
    title: 'PhD Thesis Work Support',
    kind: 'Service',
    category: 'research',
    expert: 'Dr. Helen Bassey',
    rating: 4.9,
    reviews: 58,
    price: '₦25,000',
    delivery: '3 days',
    location: 'Remote',
    description: 'Professional support for PhD thesis structure, chapter development, methodology refinement, literature review, and academic editing.',
    gradient: 'from-slate-700 to-violet-700',
    imageUrl: marketplaceImages.research
  },
  {
    id: 11,
    title: 'Journal Writing and Manuscript Support',
    kind: 'Service',
    category: 'research',
    expert: 'Prof. Ifeoma Nnaji',
    rating: 4.8,
    reviews: 49,
    price: '₦18,500',
    delivery: '48 hours',
    location: 'Remote',
    description: 'Get help with journal article writing, manuscript formatting, academic language improvement, citations, and submission readiness.',
    gradient: 'from-fuchsia-700 to-rose-600',
    imageUrl: marketplaceImages.research
  },
  {
    id: 5,
    title: 'Clean Medical Textbook Bundle',
    kind: 'Goods',
    category: 'books',
    expert: 'Adaobi James',
    rating: 4.6,
    reviews: 18,
    price: '₦18,000',
    delivery: 'Pickup or dispatch',
    location: 'Lagos, Nigeria',
    description: 'Well-kept anatomy and physiology textbooks, ideal for first and second year medical students.',
    gradient: 'from-amber-500 to-orange-500',
    imageUrl: marketplaceImages.books
  },
  {
    id: 6,
    title: 'Student Laptop with Charger',
    kind: 'Goods',
    category: 'gadgets',
    expert: 'Tobi Aluko',
    rating: 4.7,
    reviews: 11,
    price: '₦145,000',
    delivery: 'Same day meetup',
    location: 'Ibadan, Nigeria',
    description: 'Reliable laptop for coursework, browsing, and presentations. Suitable for light coding and research work.',
    gradient: 'from-emerald-500 to-teal-600',
    imageUrl: marketplaceImages.gadgets
  }
] as const;

export const expertProfiles = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    specialty: 'Statistics and Data Science',
    rate: '₦4,500/hr',
    rating: 4.9,
    sessions: 210,
    badge: 'Top rated'
  },
  {
    id: 2,
    name: 'Prof. Michael Adeyemi',
    specialty: 'Research Methodology',
    rate: '₦6,000/hr',
    rating: 4.8,
    sessions: 163,
    badge: 'Research expert'
  },
  {
    id: 3,
    name: 'Grace Okafor',
    specialty: 'Presentation Design',
    rate: '₦3,500/hr',
    rating: 4.7,
    sessions: 94,
    badge: 'Fast delivery'
  }
] as const;

export const storefrontLinks = [
  'Campus Essentials',
  'Expert Services',
  'Study Tech',
  'Hot Deals',
  'Verified Sellers',
  'Bulk Offers'
] as const;

export const categoryRail = [
  { label: 'Assignment Help', hint: 'Academic support' },
  { label: 'Research Review', hint: 'Proposal and thesis' },
  { label: 'Design Services', hint: 'Slides and branding' },
  { label: 'Books & Materials', hint: 'Course resources' },
  { label: 'Laptops & Gadgets', hint: 'Student tech' },
  { label: 'Tutors & Experts', hint: 'One-on-one guidance' },
  { label: 'Hostel Essentials', hint: 'Daily student needs' },
  { label: 'Trending Offers', hint: 'Popular right now' }
] as const;

export const searchPrompts = [
  'Search assignment help',
  'Search research proposal review',
  'Search laptops and gadgets',
  'Search presentation design experts'
] as const;

export const promoAds = [
  {
    message: 'Verified experts for assignments, design, and coding support.',
    label: 'Expert Help',
    visualTitle: '24h Support'
  },
  {
    message: 'Trending campus deals on gadgets, books, and hostel essentials.',
    label: 'Hot Deals',
    visualTitle: 'Campus Picks'
  },
  {
    message: 'Buy services fast and connect directly with trusted student sellers.',
    label: 'Trusted Sellers',
    visualTitle: 'Direct Connect'
  },
  {
    message: 'Discover marketplace listings built for real campus needs.',
    label: 'Marketplace',
    visualTitle: 'Student Ready'
  }
] as const;

export const studentNeedItems = [
  {
    id: 'student-need-1',
    title: 'Bed Space',
    subtitle: 'Shared hostel and private room options',
    price: 'From ₦65,000',
    tag: 'Housing',
    sellerName: 'Campus Housing Desk',
    location: 'Yola, Adamawa',
    delivery: 'Inspection booking',
    imageUrl: marketplaceImages.accommodation
  },
  {
    id: 'student-need-2',
    title: 'Off-Campus Rentals',
    subtitle: 'Rooms, self-contain, and student apartments',
    price: 'From ₦120,000',
    tag: 'Accommodation',
    sellerName: 'Treyfa Student Realtors',
    location: 'Around campus',
    delivery: 'Viewing same day',
    imageUrl: marketplaceImages.accommodation
  },
  {
    id: 'student-need-3',
    title: 'Campus Office Supplies',
    subtitle: 'Files, chairs, lamps, and study desk items',
    price: 'From ₦4,500',
    tag: 'Supplies',
    sellerName: 'Office Hub',
    location: 'Campus market',
    delivery: 'Pickup or dispatch',
    imageUrl: marketplaceImages.essentials
  },
  {
    id: 'student-need-4',
    title: 'Student Utensils',
    subtitle: 'Pots, plates, kettles, and kitchen basics',
    price: 'From ₦7,000',
    tag: 'Essentials',
    sellerName: 'Hostel Essentials Store',
    location: 'Campus plaza',
    delivery: 'Dispatch available',
    imageUrl: marketplaceImages.essentials
  }
] as const;

export const parsePrice = (price: string) => Number(price.replace(/[^\d]/g, '')) || 0;

export const toMarketplaceProduct = (item: {
  id: number | string;
  title: string;
  expert?: string;
  sellerName?: string;
  kind?: string;
  category: string;
  description?: string;
  subtitle?: string;
  location: string;
  delivery: string;
  price: string;
  gradient?: string;
  imageUrl?: string;
}): MarketplaceProduct => ({
  id: String(item.id),
  title: item.title,
  sellerName: item.expert || item.sellerName || 'CampusLink Seller',
  sellerType: item.expert ? 'expert' : 'student',
  itemType: item.kind === 'Goods' ? 'goods' : 'service',
  category: item.category,
  description: item.description || item.subtitle || '',
  location: item.location,
  delivery: item.delivery,
  price: parsePrice(item.price),
  imageAccent: item.gradient,
  imageUrl: item.imageUrl
});

export const transformedStudentNeedProducts = studentNeedItems.map((item) =>
  toMarketplaceProduct({
    ...item,
    kind: 'Goods',
    category: 'goods',
    gradient: 'from-slate-700 to-slate-900'
  })
);

export const getCategoryLabel = (categoryId: string) =>
  marketplaceCategories.find((category) => category.id === categoryId)?.label || 'Category';

export const getMarketplaceCategoryTab = (categoryId: string) => `marketplace-category-${categoryId}`;

export const getMarketplaceCategoryIdFromTab = (tab: string) =>
  tab.startsWith('marketplace-category-') ? tab.replace('marketplace-category-', '') : null;

export const isMarketplaceCategoryTab = (tab: string) => Boolean(getMarketplaceCategoryIdFromTab(tab));

export const getCategoryListings = (categoryId: string): MarketplaceProduct[] => {
  const marketplaceProducts = marketplaceItems.map((item) => toMarketplaceProduct(item));

  switch (categoryId) {
    case 'all':
      return [...marketplaceProducts, ...transformedStudentNeedProducts];
    case 'services':
      return marketplaceProducts.filter((item) => item.itemType === 'service');
    case 'goods':
      return [...marketplaceProducts.filter((item) => item.itemType === 'goods'), ...transformedStudentNeedProducts];
    default:
      return marketplaceProducts.filter((item) => item.category === categoryId);
  }
};

export const categoryRailToCategoryId: Record<string, MarketplaceCategoryId> = {
  'Assignment Help': 'assignment-help',
  'Research Review': 'research',
  'Design Services': 'design',
  'Books & Materials': 'books',
  'Laptops & Gadgets': 'gadgets',
  'Tutors & Experts': 'services',
  'Hostel Essentials': 'goods',
  'Trending Offers': 'all'
};
