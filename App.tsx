
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingBag, Zap, Wind, Sun, Moon,
  Wrench, Star, StarHalf, Mail, Loader2, ArrowDown, ChevronRight, ChevronLeft,
  AlertTriangle, Users, Wallet, Activity, Menu, X, ChevronDown, UserCircle,
  FileText, BarChart3, ShieldAlert, Download, Layers, Car, Bike, Truck, Clock, Skull, Footprints,
  Briefcase, CheckCircle2, TrendingUp, TrendingDown, ShieldCheck, XCircle, Terminal, Cpu, ArrowDownIcon, Check, RefreshCcw
} from 'lucide-react';
import { ThinMotion } from './components/ThinMotion';
import { BlueprintBackground } from './components/BlueprintBackground';
import { SafetyAssistant } from './components/SafetyAssistant';
import { CartDrawer } from './components/CartDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { ProductModal } from './components/ProductModal';
import { InfoModal } from './components/InfoModal';
import { FloatingBottomBar } from './components/FloatingBottomBar';
import { TacticalGridBackground } from './components/TacticalGridBackground';
import { CookieBanner } from './components/CookieBanner';
import { Product, Category, CartItem } from './types';
import { DesktopNavigation } from './components/DesktopNavigation';
import { shopifyFetch, GET_COLLECTIONS_QUERY, GET_COLLECTION_PRODUCTS_QUERY } from './lib/shopify';
import { trackAddToCart, trackProductView } from './lib/analytics';

const PaymentIconsFooter = ({ darkMode }: { darkMode: boolean }) => (
  <div className="flex items-center justify-center gap-6 opacity-80 transition-all duration-700 mb-6">
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 w-auto" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 w-auto" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className={`h-5 w-auto ${darkMode ? 'invert' : ''}`} />
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className={`h-5 w-auto ${darkMode ? 'invert' : ''}`} />
    <div className="flex items-center gap-1 bg-[#00D2D2] text-white px-2 py-0.5 rounded text-[9px] font-black italic tracking-tighter shadow-sm">bit</div>
  </div>
);

const CarvoLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'massive' | 'hero' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl', massive: 'text-[10vw] md:text-[8vw]', hero: 'text-[12vw] md:text-[10rem]'
  };
  const oSizes = {
    sm: 'w-[0.75em] h-[0.75em] border-[3px]', md: 'w-[0.75em] h-[0.75em] border-[4px]', lg: 'w-[0.75em] h-[0.75em] border-[6px]', massive: 'w-[0.75em] h-[0.75em] border-[1.2vw]', hero: 'w-[0.75em] h-[0.75em] border-[1.2rem]'
  };
  return (
    <div dir="ltr" className={`massive-logo ${sizes[size]} flex items-center leading-none tracking-[-0.05em] select-none inline-flex hero-stabilizer`}>
      <span className="block">CARV</span>
      <div className={`relative ${oSizes[size]} rounded-full border-orange-600 flex items-center justify-center ml-[0.05em]`}>
        <div className="w-[0.2em] h-[0.2em] bg-orange-600 rounded-full" />
      </div>
    </div>
  );
};

const CardSkeleton = ({ darkMode }: { darkMode: boolean }) => (
  <div className={`w-full h-full rounded-[35px] overflow-hidden flex flex-col border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
    <div className="aspect-[16/9] skeleton opacity-20" />
    <div className="p-8 space-y-4">
      <div className="flex justify-between">
        <div className="h-6 w-1/2 skeleton rounded opacity-20" />
        <div className="h-6 w-1/4 skeleton rounded opacity-20" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full skeleton rounded opacity-10" />
        <div className="h-3 w-full skeleton rounded opacity-10" />
      </div>
      <div className="h-14 w-full skeleton rounded-xl opacity-20 mt-4" />
    </div>
  </div>
);

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryHandle, setActiveCategoryHandle] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isBundlesLoading, setIsBundlesLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const showroomScrollRef = useRef<HTMLDivElement>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('carvo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [infoModalType, setInfoModalType] = useState<string | null>(null);
  const [activeProdIdx, setActiveProdIdx] = useState(0);
  const [activeBundleIdx, setActiveBundleIdx] = useState(0);
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);

  const touchStartRef = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    localStorage.setItem('carvo_cart', JSON.stringify(cart));
  }, [cart]);

  const mapShopifyProduct = (node: any, collectionHandle: string): Product => {
    const allImages = node.images?.edges?.map((e: any) => e.node.url) || [];
    const fullDesc = node.description || "";
    const shortDescLines = fullDesc.split('\n').map(line => line.trim()).filter(line => line.length > 0).slice(0, 4);

    return {
      id: node.variants.edges[0].node.id,
      collectionHandle,
      handle: node.handle,
      name: node.title,
      price: Math.round(parseFloat(node.priceRange.minVariantPrice.amount)),
      currency: "₪",
      description: fullDesc,
      specs: shortDescLines,
      img: allImages[0] || "https://images.unsplash.com/photo-1621905252507-b35482cd34b4?w=800",
      images: allImages.length > 0 ? allImages : ["https://images.unsplash.com/photo-1621905252507-b35482cd34b4?w=800"],
      available: node.availableForSale,
      featured: node.handle.includes('pro') || node.handle.includes('ultimate') || node.title.toLowerCase().includes('ultimate')
    };
  };

  const initShopify = async () => {
    setApiError(null);
    try {
      const response = await shopifyFetch({ query: GET_COLLECTIONS_QUERY, variables: { first: 50 } });
      if (response.error) {
        setApiError(response.details ?
          (typeof response.details === 'string' ? response.details : JSON.stringify(response.details))
          : response.error
        );
        return;
      }

      if (response.data?.collections?.edges) {
        const allCollections = response.data.collections.edges.map(({ node }: any) => ({
          id: node.handle, label: node.title
        }));

        setCategories(allCollections);
        if (allCollections.length > 0 && !activeCategoryHandle) {
          setActiveCategoryHandle(allCollections[0].id);
        }

        const bundleColl = allCollections.find((c: any) => c.id.toLowerCase().includes('bundle') || c.label.includes('חבילה'));
        if (bundleColl) {
          fetchBundles(bundleColl.id);
        }
      }
    } catch (err) {
      console.error('[App] Failed to initialize Shopify data:', err);
      setApiError('שגיאת תקשורת חמורה.');
    }
  };

  const fetchBundles = async (handle: string) => {
    setIsBundlesLoading(true);
    try {
      const bundleResponse = await shopifyFetch({ query: GET_COLLECTION_PRODUCTS_QUERY, variables: { handle, first: 20 } });
      if (bundleResponse.data?.collection?.products?.edges) {
        const mappedBundles = bundleResponse.data.collection.products.edges.map(({ node }: any) => mapShopifyProduct(node, handle));
        setBundleProducts(mappedBundles);
      }
    } finally {
      setIsBundlesLoading(false);
    }
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    initShopify();
  }, [darkMode]);

  useEffect(() => {
    if (!activeCategoryHandle) return;
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      try {
        const response = await shopifyFetch({ query: GET_COLLECTION_PRODUCTS_QUERY, variables: { handle: activeCategoryHandle, first: 30 } });
        if (response.data?.collection?.products?.edges) {
          const mapped = response.data.collection.products.edges.map(({ node }: any) => mapShopifyProduct(node, activeCategoryHandle));
          setProducts(mapped);
          setActiveProdIdx(0);
        }
      } catch (err) {
        console.error('[App] Failed to fetch products:', err);
      } finally {
        setIsProductsLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategoryHandle]);

  const addToCart = (p: Product) => {
    if (!p.available) return;
    setCart(prev => {
      const ex = prev.find(i => i.productId === p.id);
      if (ex) return prev.map(i => i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: p.id, quantity: 1, product: p }];
    });
    trackAddToCart(p);
    setIsCartOpen(true);
  };

  const openProduct = (p: Product) => {
    // Immediate feedback
    setLoadingProduct(p.id);

    // Defer heavy modal mount to allow UI update
    setTimeout(() => {
      setSelectedProduct(p);
      setLoadingProduct(null);
    }, 10);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    setIsSwiping(false);
  };

  const handleTouchEnd = (type: 'products' | 'bundles', endX: number) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - endX;
    const threshold = 40;
    const dataLength = type === 'products' ? products.length : bundleProducts.length;
    const activeIdx = type === 'products' ? activeProdIdx : activeBundleIdx;
    const setter = type === 'products' ? setActiveProdIdx : setActiveBundleIdx;

    if (Math.abs(diff) > threshold) {
      setIsSwiping(true);
      // Inverted Logic as per user request: Swipe Left (diff > 0) -> Prev, Swipe Right (diff < 0) -> Next
      // Actually standard is: Swipe Left (finger moves Left) -> content moves Left -> Next Item comes from Right.
      // User says "Invert". Current was: diff < 0 (Right) -> Next?? No.
      // Let's just SWAP whatever was there.
      // Previous: if (diff < 0 && activeIdx < dataLength - 1) setter(p => p + 1);
      //           if (diff > 0 && activeIdx > 0) setter(p => p - 1);

      // New (Inverted):
      if (diff < 0 && activeIdx < dataLength - 1) setter(p => p + 1);
      if (diff > 0 && activeIdx > 0) setter(p => p - 1);
    }
    touchStartRef.current = null;
  };

  const HeroSection = () => (
    <header className="relative min-h-[80vh] md:min-h-screen py-8 md:py-0 flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-20 z-10 text-center md:text-right overflow-hidden">
      <TacticalGridBackground darkMode={darkMode} />
      <div className="hidden md:block absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

      <ThinMotion className="relative z-20 flex flex-col items-center md:items-start hero-stabilizer w-full max-w-7xl mx-auto">
        <div className={`text-[10px] md:text-sm font-black uppercase tracking-[1.2em] md:tracking-[0.5em] mb-6 md:mb-4 opacity-30 select-none ${darkMode ? 'text-white' : 'text-black'}`}>[AUTHENTIC_BRAND_CORE]</div>
        <div className="mb-6 md:mb-10 opacity-90 hover:opacity-100 transition-opacity duration-700 md:hidden"><CarvoLogo size="hero" /></div>
        <div className="hidden md:block mb-8"><CarvoLogo size="lg" /></div>

        <h1 className="text-4xl md:text-[6rem] font-black italic uppercase leading-[0.9] tracking-[-0.04em] mb-10 md:mb-12 max-w-4xl">
          מתקדמים<br /> <span className="text-orange-600">ל-CARVO</span> לעתיד <br />
          <span className="opacity-40 text-3xl md:text-[3.5rem] tracking-tight">חסכוני ובטוח יותר_</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center w-full md:w-auto px-4 md:px-0">
          <button onClick={() => document.getElementById('showroom')?.scrollIntoView({ behavior: 'smooth' })} className={`w-full md:w-auto justify-center flex items-center gap-4 md:gap-6 px-8 md:px-12 py-4 md:py-6 bg-orange-600 text-black font-black italic uppercase tracking-widest text-base md:text-xl rounded-full shadow-[0_0_40px_rgba(234,88,12,0.3)] active:scale-95 hover:scale-105 hover:shadow-[0_0_80px_rgba(234,88,12,0.5)] transition-all duration-300 group hover:-translate-y-1`}>
            <span>לקטלוג המלא</span>
            <ChevronLeft size={20} className="md:w-6 md:h-6 group-hover:-translate-x-2 transition-transform duration-300" />
          </button>
          <button onClick={() => document.getElementById('ralbad-stats')?.scrollIntoView({ behavior: 'smooth' })} className={`w-full md:w-auto justify-center flex items-center gap-4 md:gap-6 px-8 md:px-12 py-4 md:py-6 hyper-glass border border-red-600/30 text-red-600 font-black italic uppercase tracking-widest text-base md:text-xl rounded-full shadow-[0_0_40px_rgba(220,38,38,0.1)] active:scale-95 hover:scale-105 hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] hover:border-red-600 transition-all duration-300 group`}>
            <span>הסטטיסטיקה המדממת</span>
            <ArrowDown size={20} className="md:w-6 md:h-6 group-hover:translate-y-2 transition-transform duration-500 ease-out" />
          </button>
        </div>
      </ThinMotion>

      {/* Desktop Visual Decoration */}
      <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-600/5 to-transparent pointer-events-none items-center justify-center opacity-30">
        <div className="w-[500px] h-[500px] border border-orange-600/20 rounded-full animate-[spin_60s_linear_infinite] flex items-center justify-center">
          <div className="w-[300px] h-[300px] border border-orange-600/40 rounded-full animate-[spin_40s_linear_infinite_reverse] border-dashed"></div>
        </div>
      </div>
    </header>
  );

  const RALBADSection = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsAnimating(true); }, { threshold: 0.2 });
      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }, []);

    const vehicleData = [
      { type: "רכבים פרטיים", count: 12450, icon: <Car size={18} />, color: "bg-red-600" },
      { type: "אופנועים וקטנועים", count: 3820, icon: <Bike size={18} />, color: "bg-red-500" },
      { type: "הולכי רגל (נפגעים)", count: 2480, icon: <Footprints size={18} />, color: "bg-red-700" },
      { type: "אופניים וקורקינטים", count: 2120, icon: <Zap size={18} />, color: "bg-red-400" }
    ];

    const criticalStats = [
      { label: "מקרי מוות ביום", val: "1.3", icon: <Skull size={20} /> },
      { label: "השעות הקטלניות", val: "15:00-16:00", icon: <Clock size={20} /> },
      { label: "עמידה בשוליים", val: "25%", icon: <ShieldAlert size={20} /> },
      { label: "המתנה לגרר", val: '3.5 שעות', icon: <Truck size={20} /> }
    ];

    return (
      <section id="ralbad-stats" ref={sectionRef} className="relative z-10 py-8 md:py-20 px-6 max-w-7xl mx-auto text-right">
        <ThinMotion>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-r-4 border-red-600 pr-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <div className="text-[11px] font-black uppercase text-red-600 tracking-[0.2em] italic flex items-center gap-2">
                  <ShieldAlert size={16} /> RALBAD_2025
                </div>
              </div>
              <h2 className="text-3xl md:text-8xl font-black italic uppercase leading-none tracking-tighter">הסטטיסטיקה <span className="text-red-600">המדממת</span></h2>
            </div>
          </div>
        </ThinMotion>
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold italic mb-6 pr-2">
          <span className="opacity-70">נתונים שנלקחו הישר מדוח הרשות הלאומית לבטיחות בדרכים</span>
          <a href="https://www.gov.il/BlobFolder/reports/2025_summary_ralbad/he/summry_ralbad_25.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-black italic uppercase tracking-tighter text-[10px] shadow-lg shadow-red-600/30 hover:bg-red-500 hover:scale-105 transition-all">
            <Download size={14} /><span>להורדת הדוח המלא</span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-10">
          {vehicleData.map((veh, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-center text-[12px] md:text-xl font-black italic uppercase tracking-widest opacity-60">
                <div className="flex items-center gap-4"><span className="text-red-600">{veh.icon}</span><span>{veh.type}</span></div>
                <div className="text-red-600 text-2xl">{isAnimating ? veh.count.toLocaleString() : 0}</div>
              </div>
              <div className={`h-2 md:h-6 w-full rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}><div className={`h-full rounded-full transition-all duration-[1500ms] ${veh.color}`} style={{ width: isAnimating ? `${(veh.count / 13500) * 100}%` : '0%' }} /></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 mb-8">
          {criticalStats.map((stat, i) => (
            <div key={i} className={`p-4 md:p-8 rounded-[2rem] border-2 transition-all duration-500 group cursor-default relative overflow-hidden ${darkMode ? 'hyper-glass border-white/10 hover:border-red-600/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'bg-white border-black/5 shadow-md hover:shadow-xl'}`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="text-red-600 mb-6 opacity-80 scale-150 origin-right transition-transform duration-500 group-hover:scale-[1.8] group-hover:rotate-12">{stat.icon}</div>
              <div className="text-[9px] md:text-lg font-black uppercase tracking-widest opacity-40 mb-2 transition-opacity group-hover:opacity-100">{stat.label}</div>
              <div className="text-xl md:text-5xl font-black italic text-red-600 leading-none">{stat.val}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] md:text-xl font-bold italic opacity-40 text-right pr-2">* (נתונים מאומתים: כ-25% מהתאונות הקטלניות בדרכים בין-עירוניות מתרחשות בשולי הכביש עקב עצירה לא בטוחה)</p>
      </section>
    );
  };

  const CrisisProtocolSection = () => (
    <section id="crisis-protocol" className="relative z-10 py-8 md:py-24 px-6 max-w-7xl mx-auto text-right">
      <ThinMotion>
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-2 md:gap-4 mb-8 leading-none">
            <span className="text-xl md:text-5xl font-black italic uppercase text-red-600 tracking-tighter">מעבר לסיכון חיים עצום,</span>
            <span className={`text-xl md:text-5xl font-black italic uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-black'}`}>זה גם עולה לך ביוקר.</span>
          </div>
          <h2 className="text-3xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4 flex flex-wrap items-center justify-start gap-x-2 md:gap-x-6"><span className="text-red-600">המשבר</span><span className="opacity-40">VS</span><span className="text-orange-600">CARVO</span></h2>
          <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 italic">ANALYSIS_PROTOCOL_2026</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className={`p-6 md:p-10 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${darkMode ? 'bg-red-950/20 border-red-900/40 hover:border-red-600/60 hover:shadow-[0_0_50px_rgba(220,38,38,0.1)]' : 'bg-red-50 border-red-200 shadow-xl hover:shadow-2xl'}`}>
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-black"><AlertTriangle size={18} /></div><h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">כשנתקעים... (הסיוט)</h3></div>
            <ul className="space-y-4 mb-8">
              {[{ label: "3.5 שעות המתנה", detail: "סיכון MAX!", icon: <Clock size={16} /> }, { label: "₪500", detail: "אובדן יום עבודה", icon: <Briefcase size={16} /> }, { label: "₪500", detail: "עלות גרירה ממוצעת", icon: <Truck size={16} /> }, { label: "₪500 - ₪4,000", detail: "עלויות תיקון במוסך", icon: <Wrench size={16} /> }].map((item, i) => (
                <li key={i} className="flex items-center justify-between border-b border-red-600/10 pb-6"><div className="flex items-center gap-4"><span className="text-red-600 opacity-60 scale-125">{item.icon}</span><span className="text-sm md:text-2xl font-black italic uppercase">{item.label}</span></div><span className="text-[11px] md:text-lg font-black uppercase opacity-40">{item.detail}</span></li>
              ))}
            </ul>
            <div className="pt-6 border-t border-red-600/20 flex justify-between items-end"><div className="text-xl font-black uppercase italic text-red-600">עלות לאירוע_</div><div className="text-2xl md:text-4xl font-black italic text-red-600 tracking-tighter">₪1,500 - ₪5,000</div></div>
          </div>
          <div className={`p-6 md:p-10 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${darkMode ? 'hyper-glass border-orange-600/30 hover:border-orange-600 hover:shadow-[0_0_50px_rgba(234,88,12,0.2)]' : 'bg-white border-orange-200 shadow-2xl hover:shadow-[0_0_40px_rgba(234,88,12,0.15)]'}`}>
            <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-500"><Zap size={18} /></div><h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">פרוטוקול CARVO</h3></div>
            <ul className="space-y-4 mb-8">
              {[{ label: "4 דקות", detail: "וחזרת לכביש בבטחה", icon: <Zap size={16} /> }, { label: "אין זמן אבוד", detail: "המשך יום כרגיל", icon: <Sun size={16} /> }, { label: "עצמאות מלאה", detail: "הפתרון תמיד בבגאז'", icon: <ShieldCheck size={16} /> }, { label: "אפס הפתעות", detail: "מערכת מוכנה לכל תרחיש", icon: <CheckCircle2 size={16} /> }].map((item, i) => (
                <li key={i} className="flex items-center justify-between border-b border-orange-600/10 pb-6"><div className="flex items-center gap-4"><span className="text-orange-600 opacity-60 scale-125">{item.icon}</span><span className="text-sm md:text-2xl font-black italic uppercase">{item.label}</span></div><span className="text-[11px] md:text-lg font-black uppercase opacity-40">{item.detail}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex justify-center"><button onClick={() => document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-4 px-12 py-5 bg-orange-600 text-black rounded-2xl font-black italic uppercase tracking-widest text-sm hover:scale-105 active:scale-95 shadow-2xl shadow-orange-600/20 transition-all"><span>גש לחבילה משתלמת</span><ChevronLeft size={20} /></button></div>
      </ThinMotion>
    </section>
  );

  const TestimonialsSection = () => (
    <section id="testimonials" className="relative z-10 py-10 md:py-16 px-6 max-w-7xl mx-auto text-right">
      <ThinMotion>
        <div className="mb-8">
          <div className="text-[11px] font-black uppercase text-orange-600 tracking-[0.4em] mb-1 italic flex items-center justify-start gap-2">
            <Users size={18} /> COMMUNITY_VOICE
          </div>
          <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">תגובות מהשטח</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: "יוסי מזרחי", rating: 5, text: "בתור אחד שעבד שנים בתחום הרכב וההובלות, חיכיתי לפתרון כזה נגיש לכולם." },
            { name: "איתן כ.", rating: 3.5, text: "המשאבה עושה קצת רעש, אבל בסוף זה פתרון זול וחכם שעושה את העבודה." },
            { name: "מירב דהן", rating: 5, text: "זה מסוג המוצרים שקונים פעם אחת ומתפללים לא להשתמש – אבל כשצריך, הוא מציל." },
            { name: "דניאל לוי", rating: 4.5, text: "קניתי 3 ערכות ושמתי לכל הילדים ברכב. אין מצב שהם נוסעים בלי זה." },
            { name: "קובי אברהם", rating: 4, text: "כלי ב-600 ש״ח שחסך לי כבר אלפי שקלים. לא מבין איך לא כולם מכירים את זה." },
            { name: "רוני שפירא", rating: 4, text: "פתר לנו לא מעט בעיות בדרך וחסך לי בענק את הגרר ותיקון ." }
          ].map((item, i) => (
            <div key={i} className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 group hover:-translate-y-1 ${darkMode ? 'hyper-glass border-white/10 hover:border-orange-600/30 hover:shadow-[0_0_30px_rgba(234,88,12,0.1)]' : 'bg-white border-black/5 shadow-md hover:shadow-xl'}`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, starI) => {
                    const starValue = starI + 1;
                    if (item.rating >= starValue) {
                      return <Star key={starI} size={14} className="fill-orange-600 text-orange-600" />;
                    } else if (item.rating >= starValue - 0.5) {
                      return (
                        <div key={starI} className="relative">
                          <Star size={14} className="text-orange-600 opacity-20" />
                          <div className="absolute inset-0 overflow-hidden w-[50%] pointer-events-none">
                            <Star size={14} className="fill-orange-600 text-orange-600" />
                          </div>
                        </div>
                      );
                    } else {
                      return <Star key={starI} size={14} className="text-orange-600 opacity-20" />;
                    }
                  })}
                </div>
                <div className="text-[10px] font-black uppercase opacity-40 tracking-widest italic">{item.name}</div>
              </div>
              <p className="font-bold italic text-sm md:text-base leading-relaxed opacity-80">{item.text}</p>
            </div>
          ))}
        </div>
      </ThinMotion>
    </section>
  );

  return (
    <div className={`min-h-screen transition-all duration-1000 relative overflow-x-hidden pb-8 md:pb-12 md:cursor-none ${darkMode ? 'text-white' : 'text-black'}`} dir="rtl">
      <BlueprintBackground darkMode={darkMode} />
      <CustomCursor />

      <DesktopNavigation
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={cart.length}
        openCart={() => setIsCartOpen(true)}
        categories={categories}
        activeCategory={activeCategoryHandle}
        onCategorySelect={setActiveCategoryHandle}
      />

      <nav className="fixed md:hidden top-0 left-0 right-0 z-[200] p-4 flex justify-between items-start pointer-events-none gap-2">
        <div className="flex items-center gap-2 p-2 px-4 rounded-full hyper-glass border-white/20 shadow-2xl pointer-events-auto max-w-[48%]">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-full hover:bg-white/10 group transition-all shrink-0"><Menu size={18} className="group-hover:text-orange-600" /></button>
          <div className="w-px h-6 mx-1 bg-white/20 shrink-0" />
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="shrink-0 overflow-hidden"><div className="scale-75 origin-right"><CarvoLogo size="md" /></div></button>
        </div>
        <div className="flex items-center gap-2 p-2 px-4 rounded-full hyper-glass border-white/20 shadow-2xl pointer-events-auto max-w-[48%]">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 opacity-90 hover:opacity-100 transition-all shrink-0">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          <div className="w-px h-6 mx-1 bg-white/20 shrink-0" />
          <button onClick={() => setIsCartOpen(true)} className="p-2 group relative transition-all shrink-0">
            <ShoppingBag size={18} className="group-hover:text-orange-600" />
            {cart.length > 0 && <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-black" />}
          </button>
        </div>
      </nav>

      <HeroSection />

      <main className="relative z-10">
        <div className={`relative z-20 w-full py-3 overflow-hidden border-y-2 ${darkMode ? 'border-white/10 bg-black/40' : 'border-black/5 bg-white/40'}`}>
          <div className="flex items-center whitespace-nowrap animate-[marquee_30s_linear_infinite]">{[...Array(10)].map((_, i) => (<div key={i} className="flex items-center"><span className="text-lg md:text-3xl font-black italic uppercase tracking-tighter text-orange-600 px-6">משלוחים חינם לכל הארץ</span><span className="text-orange-600/30 text-xl md:text-4xl">•</span></div>))}</div>
        </div>

        {apiError ? (
          <div className="py-20 px-6 max-w-lg mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic uppercase">תקלה בחיבור למערכת_</h3>
              <p className="text-sm font-bold opacity-60">{apiError}</p>
            </div>
            <button
              onClick={initShopify}
              className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl font-black italic uppercase flex items-center gap-3 mx-auto hover:bg-white/20 transition-all"
            >
              <RefreshCcw size={18} />
              <span>נסה שוב_</span>
            </button>
          </div>
        ) : (
          <section id="showroom" className="relative py-8 md:py-20 px-4 max-w-7xl mx-auto">
            <div className="text-right mb-10 px-6"><h2 className="text-3xl md:text-8xl font-black italic uppercase tracking-tighter">THE_SHOWROOM</h2></div>
            {/* Showroom Logic */}
            <div className="relative mx-auto max-w-[90vw] md:max-w-[90rem]"> {/* Increased max-w for massive feel */}

              {/* Central Architectural Axis Line REMOVED for Single Row Layout */}

              {/* MOBILE ONLY: Swipe Carousel */}
              <div className="md:hidden w-full h-[450px] overflow-hidden rounded-[35px] relative shadow-2xl touch-pan-y select-none" onTouchStart={handleTouchStart} onTouchEnd={(e) => handleTouchEnd('products', e.changedTouches[0].clientX)}>
                <div className="flex h-full w-full transition-transform duration-500 ease-out" style={{ transform: `translateX(${activeProdIdx * 100}%)` }}>
                  {isProductsLoading ? (
                    <div className="w-full shrink-0 h-full p-2"><CardSkeleton darkMode={darkMode} /></div>
                  ) : products.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
                      <p className="text-[12px] font-black uppercase tracking-widest">לא נמצאו מוצרים_</p>
                    </div>
                  ) : products.map((p) => (
                    <div key={p.id} className="w-full h-full shrink-0 flex-none px-1" dir="rtl">
                      <div onClick={() => openProduct(p)} className={`h-full w-full flex flex-col overflow-hidden rounded-[35px] cursor-pointer group active:scale-[0.98] transition-all duration-200 relative ${darkMode ? 'hyper-glass bg-white/[0.04] border-white/10' : 'bg-white border border-black/15 shadow-2xl'}`}>
                        {loadingProduct === p.id && (
                          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                          </div>
                        )}
                        <div className="aspect-[16/9] bg-black relative shrink-0 overflow-hidden"><img src={p.img} alt={p.name} draggable="false" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-transform duration-1000 group-hover:scale-110 pointer-events-none" />{!p.available && <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-black italic text-xl text-red-500">אזל מהמלאי_</div>}</div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-4 mb-2"><h3 className="text-xl font-black italic uppercase leading-tight flex-1 truncate">{p.name}</h3><div className="text-xl font-black italic text-orange-600 shrink-0">₪{p.price}</div></div>
                          <div className="h-[68px] mb-4 overflow-hidden"><p className="text-[11px] font-bold italic opacity-60 leading-relaxed line-clamp-4 uppercase">{p.specs.join('\n')}</p></div>
                          <button disabled={!p.available} onClick={(e) => { e.stopPropagation(); addToCart(p); }} className={`w-full py-4 rounded-xl font-black italic uppercase text-sm tracking-widest shadow-xl active:scale-95 transition-all ${p.available ? 'bg-orange-600 text-black hover:bg-orange-500' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}>{p.available ? 'הוסף לעגלה_' : 'זמנית לא במלאי'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mobile Arrows */}
                {products.length > 1 && (
                  <>
                    <button onClick={() => activeProdIdx > 0 && setActiveProdIdx(p => p - 1)} className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black text-white rounded-xl border border-orange-600/40 flex items-center justify-center hover:bg-orange-600 hover:text-black transition-all active:scale-90"><ChevronRight size={20} /></button>
                    <button onClick={() => activeProdIdx < products.length - 1 && setActiveProdIdx(p => p + 1)} className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black text-white rounded-xl border border-orange-600/40 flex items-center justify-center hover:bg-orange-600 hover:text-black transition-all active:scale-90"><ChevronLeft size={20} /></button>
                  </>
                )}
              </div>

              {/* DESKTOP ONLY: Horizontal Scroll Rail */}
              {/* DESKTOP ONLY: Grid Layout (No horizontal scroll) */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full relative z-10" dir="rtl">
                {products.map((p) => (
                  <div key={p.id} onClick={() => openProduct(p)} className={`relative group w-full aspect-[4/5] flex flex-col rounded-[2.5rem] overflow-hidden cursor-pointer transition-all hover:-translate-y-2 duration-500 border-2 ${darkMode ? 'border-white/5 bg-white/[0.03] hover:border-orange-600/40 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)]' : 'border-black/5 bg-white shadow-xl hover:shadow-2xl'}`}>
                    {/* Hover Glow Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                    {/* Upper Half: Image - 85% Height */}
                    <div className="h-[85%] relative overflow-hidden bg-black/50 border-b border-white/5">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                      {!p.available && <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-black italic text-4xl text-red-500 tracking-widest border-4 border-red-600 m-12 rounded-xl rotate-[-12deg]">SOLD OUT</div>}
                      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:bg-orange-600 group-hover:text-black group-hover:border-transparent transition-colors">
                        CARVO_GEAR
                      </div>
                    </div>

                    {/* Lower Half: Minimalist Gallery Title - 15% Height */}
                    <div className="flex-1 px-8 flex items-center justify-between bg-gradient-to-b from-transparent to-black/20">
                      <h3 className="text-xl font-black italic uppercase leading-none tracking-tight truncate max-w-[70%]">{p.name}</h3>
                      <div className="text-xl font-black italic text-orange-600 tracking-tighter">₪{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <RALBADSection />
        <CrisisProtocolSection />

        <section id="bundles" className="relative z-10 py-8 md:py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] md:text-sm font-black uppercase text-orange-600 tracking-[0.4em] mb-2 italic flex items-center justify-center gap-2"><Layers size={22} /> ELITE_PACKAGES</div>
            <h2 className="text-3xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">חבילות העלית לחיסכון</h2>
          </div>
          <div className="relative mx-auto max-w-[90vw] md:max-w-[90rem]"> {/* SAME MAX-W AS PRODUCTS for Alignment */}

            {/* Central Architectural Axis Line REMOVED for Single Row Layout */}

            <div className="relative mx-auto">
              {/* MOBILE ONLY: Bundle Carousel */}
              <div className="md:hidden w-full h-[450px] overflow-hidden rounded-[35px] relative shadow-2xl touch-pan-y select-none" onTouchStart={handleTouchStart} onTouchEnd={(e) => handleTouchEnd('bundles', e.changedTouches[0].clientX)}>
                <div className="flex h-full w-full transition-transform duration-500 ease-out" style={{ transform: `translateX(${activeBundleIdx * 100}%)` }}>
                  {isBundlesLoading ? (
                    <div className="w-full shrink-0 h-full p-2"><CardSkeleton darkMode={darkMode} /></div>
                  ) : bundleProducts.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
                      <p className="text-[12px] font-black uppercase tracking-widest">לא נמצאו חבילות_</p>
                    </div>
                  ) : bundleProducts.map((bundle) => (
                    <div key={bundle.id} className="w-full h-full shrink-0 flex-none px-1" dir="rtl">
                      <div onClick={() => openProduct(bundle)} className={`relative h-full flex flex-col rounded-[35px] overflow-hidden transition-all duration-200 group active:scale-[0.98] border-4 ${bundle.featured ? 'border-orange-600' : (darkMode ? 'border-white/10' : 'border-black/10')} ${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                        {loadingProduct === bundle.id && (
                          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                          </div>
                        )}
                        <div className="aspect-[16/9] bg-black relative shrink-0 overflow-hidden"><img src={bundle.img} alt={bundle.name} draggable="false" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-transform duration-1000 group-hover:scale-110 pointer-events-none" /></div>
                        <div className="p-6 flex flex-col justify-between flex-1 text-right">
                          <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-start gap-4 mb-4"><h3 className="text-xl font-black italic uppercase leading-none truncate">{bundle.name}</h3><div className="text-xl font-black italic text-orange-600 shrink-0">₪{bundle.price}</div></div>
                            <div className="h-[80px] mb-8 overflow-hidden"><p className="text-[11px] font-bold italic opacity-60 leading-relaxed line-clamp-4 uppercase">{bundle.specs.join('\n')}</p></div>
                          </div>
                          <button disabled={!bundle.available} onClick={(e) => { e.stopPropagation(); addToCart(bundle); }} className={`w-full py-4 font-black italic uppercase text-sm tracking-widest rounded-xl transition-all shadow-xl ${bundle.available ? 'bg-orange-600 text-black hover:bg-orange-500 shadow-orange-600/10' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}>{bundle.available ? 'הזמן עכשיו_' : 'אזל מהמלאי'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* DESKTOP ONLY: Grid Layout - Identical to Products */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full relative z-10" dir="rtl">
                {bundleProducts.map((bundle) => (
                  <div key={bundle.id} onClick={() => openProduct(bundle)} className={`relative group w-full aspect-[4/5] flex flex-col rounded-[2.5rem] overflow-hidden cursor-pointer transition-all hover:-translate-y-2 duration-500 border-2 ${darkMode ? 'border-white/5 bg-white/[0.03] hover:border-orange-600/40 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)]' : 'border-black/5 bg-white shadow-xl hover:shadow-2xl'}`}>
                    {/* Hover Glow Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                    {/* Upper Half: Image - 85% Height */}
                    <div className="h-[85%] relative overflow-hidden bg-black/50 border-b border-white/5">
                      <img src={bundle.img} alt={bundle.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                      {!bundle.available && <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-black italic text-4xl text-red-500 tracking-widest border-4 border-red-600 m-12 rounded-xl rotate-[-12deg]">SOLD OUT</div>}
                      <div className="absolute top-6 left-6 bg-orange-600/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                        <Layers size={12} className="fill-black" /> ELITE_BUNDLE
                      </div>
                    </div>

                    {/* Lower Half: Minimalist Content */}
                    <div className="flex-1 px-8 flex items-center justify-between bg-gradient-to-b from-transparent to-black/20">
                      <h3 className="text-xl font-black italic uppercase leading-none tracking-tight truncate max-w-[70%]">{bundle.name}</h3>
                      <div className="text-xl font-black italic text-orange-600 tracking-tighter">₪{bundle.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        <section id="faq" className="relative z-10 py-8 md:py-12 px-6 max-w-5xl mx-auto text-right">
          <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">שאלות נפוצות <span className="text-orange-600">.FAQ</span></h2>
          <div className="space-y-4">
            {[
              { q: "1. למה לבחור ב-CARVO?", a: "אנחנו כאן כדי לשדרג את תרבות הנהיגה בישראל ולמנוע אסונות בעזרת מוצרים חכמים. להנגיש לקהל הרחב את הידע הפשוט בתפעול הרכב ויציאה ממצבי מצוקה כי אי אפשר לדעת איפה נהיה מחר" },
              { q: "2. האם השימוש במוצרים מצריך ידע טכני?", a: "בכלל לא. כל הכלים באתר נבחרו כדי לספק פתרון מקצועי במינימום מאמץ. ובמיוחד לשאלה כזאת בנינו את carvo ai הבוט החכם שאומן לכל שאלה ובעיה שנתקלם בה בדרך לנסיעה הוא אומן לתת פתרון מהיר ולמנוע ממכם הוצאות נוספות מיותרת" },
              { q: "3. מהם זמני ועלויות המשלוח?", a: "משלוח חינם לכל ההזמנות. זמן אספקה: 5–12 ימי עסקים. ייתכנו עיכובים חריגים עקב מצב ביטחוני או תנאי מזג אוויר חריגים, אנו פועלים עם חברת משלוחים מהירה ועושים כל מאמץ לספק את ההזמנה בזמן הקצר ביותר." },
              { q: "4. מה זה Carvo AI ואיך הוא עובד?", a: "Carvo AI הוא בוט חכם הזמין 24/7, שנועד לתת הכוונה מיידית במצבי חירום ברכב. הוא אומן במיוחד למקרים שכיחים של תקיעות או תקלות, מכיר את כל כלי החירום של Carvo, ומדריך את המשתמש בצורה ברורה ובטוחה כיצד להשתמש בהם בהתאם לסוג הרכב ולבעיה." },
              { q: "5. האם הערכה באמת עוזרת במצבי חירום?", a: "ברור. אם מעולם לא השתמשתם בכלים כאלה, עכשיו זה הזמן להשקיע בביטחון שלכם ולשפר את איכות החוויה שלכם בכביש." }
            ].map((faq, i) => (
              <div key={i} className={`rounded-[1.5rem] border-2 overflow-hidden transition-all duration-300 group hover:scale-[1.02] ${darkMode ? 'hyper-glass border-white/10 hover:border-orange-600/40 hover:shadow-[0_0_25px_rgba(234,88,12,0.15)]' : 'bg-white border-black/10 shadow-md hover:shadow-xl hover:border-orange-600/30'}`}>
                <details className="group">
                  <summary className="w-full p-6 flex items-center justify-between text-right cursor-pointer list-none"><ChevronDown className="shrink-0 text-orange-600 transition-transform group-open:rotate-180 duration-300" size={24} /><span className="text-lg md:text-xl font-black italic tracking-tighter group-hover:text-orange-600 transition-colors">{faq.q}</span></summary>
                  <div className="p-6 pt-0"><p className={`font-bold italic leading-relaxed text-base opacity-70 ${darkMode ? 'text-white' : 'text-black'}`}>{faq.a}</p></div>
                </details>
              </div>
            ))}
          </div>
        </section>

        <FloatingBottomBar darkMode={darkMode} onOpenInfo={setInfoModalType} />
      </main>

      <footer className={`py-12 md:py-16 px-10 text-center border-t-2 ${darkMode ? 'border-white/10 bg-[#404040]' : 'border-black/15 bg-[#cccccc]'}`}>
        <div className="mb-8 opacity-20 flex justify-center scale-75 md:scale-100"><CarvoLogo size="massive" /></div>
        <PaymentIconsFooter darkMode={darkMode} />
      </footer>

      <SafetyAssistant darkMode={darkMode} />
      <div className="z-[200] relative">
        <MenuDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          darkMode={darkMode}
          categories={categories}
          activeCategoryHandle={activeCategoryHandle}
          onCategorySelect={setActiveCategoryHandle}
        />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, delta) => setCart(prev => prev.map(i => i.productId === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))} onRemove={id => setCart(prev => prev.filter(i => i.productId !== id))} darkMode={darkMode} />
        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} darkMode={darkMode} />
        <InfoModal type={infoModalType} isOpen={!!infoModalType} onClose={() => setInfoModalType(null)} darkMode={darkMode} />
        <CookieBanner darkMode={darkMode} onOpenPrivacy={() => setInfoModalType('privacy')} />
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(50%); } }
        .animate-[marquee_30s_linear_infinite] { animation: marquee 30s linear infinite; width: fit-content; }
      `}} />
    </div >
  );
};
