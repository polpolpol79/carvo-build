import React, { useState, useEffect, useRef } from 'react';
import {
    ShoppingBag, Sun, Moon,
    Loader2, ChevronRight, ChevronLeft,
    Menu, ShieldAlert, Layers, RefreshCcw, Home, MessageCircle
} from 'lucide-react';
import { BlueprintBackground } from './components/BlueprintBackground';
import { SafetyAssistant } from './components/SafetyAssistant';
import { CartDrawer } from './components/CartDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { ProductModal } from './components/ProductModal';
import { InfoModal } from './components/InfoModal';
import { FloatingBottomBar } from './components/FloatingBottomBar';
import { CookieBanner } from './components/CookieBanner';
import { Product, Category, CartItem } from './types';
import { DesktopNavigation } from './components/DesktopNavigation';
import { shopifyFetch, GET_COLLECTIONS_QUERY, GET_COLLECTION_PRODUCTS_QUERY } from './lib/shopify';
import { trackAddToCart } from './lib/analytics';
import { CheckoutPage } from './components/CheckoutPage';

// Extracted Components
import { CarvoLogo } from './components/CarvoLogo';
import { HeroSection } from './components/HeroSection';
import { RALBADSection } from './components/RALBADSection';
import { CrisisProtocolSection } from './components/CrisisProtocolSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { SEO } from './components/SEO';

const PaymentIconsFooter = ({ darkMode }: { darkMode: boolean }) => (
    <div className="flex items-center justify-center gap-6 opacity-80 transition-all duration-700 mb-6">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 w-auto" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 w-auto" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className={`h-5 w-auto ${darkMode ? 'invert' : ''}`} />
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className={`h-5 w-auto ${darkMode ? 'invert' : ''}`} />
        <div className="flex items-center gap-1 bg-[#00D2D2] text-white px-2 py-0.5 rounded text-[9px] font-black italic tracking-tighter shadow-sm">bit</div>
    </div>
);

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
    const [view, setView] = useState<'home' | 'checkout'>('home');
    const [darkMode, setDarkMode] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategoryHandle, setActiveCategoryHandle] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [isBundlesLoading, setIsBundlesLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

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
        setLoadingProduct(p.id);
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
            if (diff < 0 && activeIdx < dataLength - 1) setter(p => p + 1);
            if (diff > 0 && activeIdx > 0) setter(p => p - 1);
        }
        touchStartRef.current = null;
    };

    if (view === 'checkout') {
        return (
            <CheckoutPage
                cart={cart}
                total={cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}
                onBack={() => setView('home')}
                onProceed={(formData) => {
                    const cartString = cart.map(item => `${item.product.id.split('/').pop()}:${item.quantity}`).join(',');
                    const params = new URLSearchParams();
                    if (formData.email) params.append('checkout[email]', formData.email);
                    if (formData.firstName) params.append('checkout[shipping_address][first_name]', formData.firstName);
                    if (formData.lastName) params.append('checkout[shipping_address][last_name]', formData.lastName);
                    if (formData.phone) params.append('checkout[shipping_address][phone]', formData.phone);
                    if (formData.city) params.append('checkout[shipping_address][city]', formData.city);
                    if (formData.street) params.append('checkout[shipping_address][address1]', `${formData.street} ${formData.floor ? `קומה ${formData.floor}` : ''} ${formData.apt ? `דירה ${formData.apt}` : ''}`);
                    if (formData.notes) params.append('checkout[note]', formData.notes);

                    window.location.href = `https://carvo.co.il/cart/${cartString}?${params.toString()}`;
                }}
                darkMode={darkMode}
                onOpenTerms={() => setInfoModalType('terms')}
            />
        );
    }

    return (
        <div className={`min-h-screen transition-all duration-1000 relative overflow-x-hidden pb-8 md:pb-12 ${darkMode ? 'text-white' : 'text-black'}`} dir="rtl">
            <SEO />
            <BlueprintBackground darkMode={darkMode} />
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

            <HeroSection darkMode={darkMode} />

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
                        <div className="relative mx-auto max-w-[90vw] md:max-w-[90rem]">
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
                                {products.length > 1 && (
                                    <>
                                        <button onClick={() => activeProdIdx > 0 && setActiveProdIdx(p => p - 1)} className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black text-white rounded-xl border border-orange-600/40 flex items-center justify-center hover:bg-orange-600 hover:text-black transition-all active:scale-90"><ChevronRight size={20} /></button>
                                        <button onClick={() => activeProdIdx < products.length - 1 && setActiveProdIdx(p => p + 1)} className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black text-white rounded-xl border border-orange-600/40 flex items-center justify-center hover:bg-orange-600 hover:text-black transition-all active:scale-90"><ChevronLeft size={20} /></button>
                                    </>
                                )}
                            </div>

                            {/* DESKTOP ONLY: Grid Layout */}
                            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10" dir="rtl">
                                {products.map((p) => (
                                    <div key={p.id} onClick={() => openProduct(p)} className={`relative group w-full aspect-[4/5] flex flex-col rounded-[2.5rem] overflow-hidden cursor-pointer transition-all hover:-translate-y-2 duration-500 border-2 ${darkMode ? 'border-white/5 bg-white/[0.03] hover:border-orange-600/40 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)]' : 'border-black/5 bg-white shadow-xl hover:shadow-2xl'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                                        <div className="h-[85%] relative overflow-hidden bg-black/50 border-b border-white/5">
                                            <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                                            {!p.available && <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-black italic text-4xl text-red-500 tracking-widest border-4 border-red-600 m-12 rounded-xl rotate-[-12deg]">SOLD OUT</div>}
                                            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:bg-orange-600 group-hover:text-black group-hover:border-transparent transition-colors">
                                                CARVO_GEAR
                                            </div>
                                        </div>
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

                <RALBADSection darkMode={darkMode} />
                <CrisisProtocolSection darkMode={darkMode} />

                <section id="bundles" className="relative z-10 py-8 md:py-20 px-4 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="text-[11px] md:text-sm font-black uppercase text-orange-600 tracking-[0.4em] mb-2 italic flex items-center justify-center gap-2"><Layers size={22} /> ELITE_PACKAGES</div>
                        <h2 className="text-3xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">חבילות העלית לחיסכון</h2>
                    </div>
                    <div className="relative mx-auto max-w-[90vw] md:max-w-[90rem]">
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
                            {bundleProducts.length > 1 && (
                                <div className="md:hidden">
                                    <button onClick={() => activeBundleIdx > 0 && setActiveBundleIdx(p => p - 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black text-white rounded-xl border border-orange-600/40 flex items-center justify-center hover:bg-orange-600 hover:text-black transition-all active:scale-90"><ChevronRight size={20} /></button>
                                    <button onClick={() => activeBundleIdx < bundleProducts.length - 1 && setActiveBundleIdx(p => p + 1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black text-white rounded-xl border border-orange-600/40 flex items-center justify-center hover:bg-orange-600 hover:text-black transition-all active:scale-90"><ChevronLeft size={20} /></button>
                                </div>
                            )}
                            {/* DESKTOP ONLY: Grid Layout */}
                            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10" dir="rtl">
                                {bundleProducts.map((bundle) => (
                                    <div key={bundle.id} onClick={() => openProduct(bundle)} className={`relative group w-full aspect-[4/5] flex flex-col rounded-[2.5rem] overflow-hidden cursor-pointer transition-all hover:-translate-y-2 duration-500 border-2 ${darkMode ? 'border-white/5 bg-white/[0.03] hover:border-orange-600/40 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)]' : 'border-black/5 bg-white shadow-xl hover:shadow-2xl'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                                        <div className="h-[85%] relative overflow-hidden bg-black/50 border-b border-white/5">
                                            <img src={bundle.img} alt={bundle.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                                            {!bundle.available && <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-black italic text-4xl text-red-500 tracking-widest border-4 border-red-600 m-12 rounded-xl rotate-[-12deg]">SOLD OUT</div>}
                                            <div className="absolute top-6 left-6 bg-orange-600/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                                                <Layers size={12} className="fill-black" /> ELITE_BUNDLE
                                            </div>
                                        </div>
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

                <TestimonialsSection darkMode={darkMode} />
                <FAQSection darkMode={darkMode} />
                <FloatingBottomBar darkMode={darkMode} onOpenInfo={setInfoModalType} />
            </main>

            <footer className={`py-12 md:py-16 px-10 text-center border-t-2 ${darkMode ? 'border-white/10 bg-[#404040]' : 'border-black/15 bg-[#cccccc]'}`}>
                <div className="mb-8 opacity-20 flex justify-center scale-75 md:scale-100"><CarvoLogo size="massive" /></div>
                <PaymentIconsFooter darkMode={darkMode} />
            </footer>

            <SafetyAssistant darkMode={darkMode} />

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/972534547036"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-24 left-4 z-[190] p-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.8)] flex items-center justify-center animate-pulse"
                style={{ boxShadow: '0 0 20px rgba(37, 211, 102, 0.6)' }}
            >
                <MessageCircle size={28} fill="white" className="text-white" />
            </a>

            <div className="z-[200] relative">
                <MenuDrawer
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    darkMode={darkMode}
                    categories={categories}
                    activeCategoryHandle={activeCategoryHandle}
                    onCategorySelect={setActiveCategoryHandle}
                />
                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    items={cart}
                    onUpdateQuantity={(id, delta) => setCart(prev => prev.map(i => i.productId === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))}
                    onRemove={id => setCart(prev => prev.filter(i => i.productId !== id))}
                    darkMode={darkMode}
                    onOpenTerms={() => setInfoModalType('terms')}
                    onCheckout={() => {
                        setIsCartOpen(false);
                        setView('checkout');
                        window.scrollTo(0, 0);
                    }}
                />
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
