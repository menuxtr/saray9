'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Utensils, ChevronDown } from 'lucide-react';
import Navbar, { CategoryIcon } from '@/components/Navbar';
import Card from '@/components/Card';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [settings, setSettings] = useState({ 
    welcomeLogo: '', 
    welcomeDesc: '', 
    welcomeDesc_en: '', 
    welcomeDesc_ar: '' 
  });
  
  // Multi-Language State
  const [language, setLanguage] = useState('tr'); // 'tr', 'en', 'ar'
  
  // Campaign Carousel Index
  const [currentCampaignIndex, setCurrentCampaignIndex] = useState(0);

  const menuSectionRef = useRef(null);

  // Fetch categories, products, settings, and campaigns on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [catsRes, prodsRes, settingsRes, campaignsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
          fetch('/api/settings'),
          fetch('/api/campaigns')
        ]);
        const cats = await catsRes.json();
        const prods = await prodsRes.json();
        const settingsData = await settingsRes.json();
        const campaignsData = await campaignsRes.json();

        setCategories(cats);
        setProducts(prods);
        setSettings(settingsData);
        setCampaigns(campaignsData || []);
        
        if (cats.length > 0) {
          setActiveCategoryId(cats[0].id);
        }
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter Active Campaigns (tarihe duyarlı)
  const todayStr = new Date().toISOString().split('T')[0];
  const activeCampaigns = campaigns.filter(c => {
    const isDateActive = (!c.startDate || todayStr >= c.startDate) && (!c.endDate || todayStr <= c.endDate);
    return c.isActive && isDateActive;
  });

  // Campaign Carousel Auto-rotation
  useEffect(() => {
    if (activeCampaigns.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentCampaignIndex((prev) => (prev + 1) % activeCampaigns.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeCampaigns.length]);

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling || categories.length === 0) return;

      const scrollPosition = window.scrollY + 140; // Offset for sticky navbar
      
      // Find which category section is currently in viewport
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const el = document.getElementById(`category-sec-${category.id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategoryId(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, isScrolling]);

  const handleCategorySelect = (categoryId) => {
    setIsScrolling(true);
    setActiveCategoryId(categoryId);

    // Scroll to the category element
    const el = document.getElementById(`category-sec-${categoryId}`);
    if (el) {
      const offset = 100; // Offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Unlock scroll listener after animation finishes
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  };

  const handleWelcomeCategoryClick = (categoryId) => {
    // First scroll to the menu section
    if (menuSectionRef.current) {
      menuSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // Then active category after scroll completes
    setTimeout(() => {
      handleCategorySelect(categoryId);
    }, 400);
  };

  // Helper function to resolve translated fields with TR fallback
  const getTranslation = (item, field, currentLang) => {
    if (!item) return '';
    if (currentLang === 'en') {
      return item[`${field}_en`] || item[field] || '';
    }
    if (currentLang === 'ar') {
      return item[`${field}_ar`] || item[field] || '';
    }
    return item[field] || '';
  };

  // Static Localized Labels
  const labels = {
    tr: {
      welcomeDescFallback: "Eşsiz lezzetlerimizle hazırlanan menümüze hoş geldiniz.",
      exploreMenu: "Menüyü İncele",
      menuTitle: "Menü",
      menuSubtitle: "Kategorileri seçin veya arama yapın",
      activeBadge: "Ürün Aktif",
      searchPlaceholder: "Ürün veya açıklama ara...",
      clearSearch: "Temizle",
      noResultsTitle: "Ürün Bulunamadı",
      noResultsDesc: "Aramanıza uygun herhangi bir yemek veya içecek bulunamadı. Lütfen kelimeleri kontrol edin.",
      loadingText: "Menü Yükleniyor...",
      footerRights: "HD STUDIO © 2026 - TÜM HAKLARI SAKLIDIR",
      campaignTitle: "ÖZEL KAMPANYALARIMIZ"
    },
    en: {
      welcomeDescFallback: "Welcome to our menu prepared with unique flavors.",
      exploreMenu: "Explore the Menu",
      menuTitle: "Menu",
      menuSubtitle: "Select categories or search",
      activeBadge: "Products Active",
      searchPlaceholder: "Search dishes or description...",
      clearSearch: "Clear",
      noResultsTitle: "No Products Found",
      noResultsDesc: "No dish or drink was found matching your search. Please check your keywords.",
      loadingText: "Loading Menu...",
      footerRights: "HD STUDIO © 2026 - ALL RIGHTS RESERVED",
      campaignTitle: "SPECIAL OFFERS"
    },
    ar: {
      welcomeDescFallback: "مرحبًا بكم في قائmetna المحضرة بالنكهات الفريدة.",
      exploreMenu: "تصفح القائمة",
      menuTitle: "القائمة",
      menuSubtitle: "اختر الفئات أو ابحث",
      activeBadge: "منتجات نشطة",
      searchPlaceholder: "ابحث عن الأطباق أو الوصف...",
      clearSearch: "مسح",
      noResultsTitle: "لم يتم العثور على منتجات",
      noResultsDesc: "لم يتم العثور على أي طبق أو مشروب يطابق بحثك. يرجى التحقق من الكلمات الرئيسية.",
      loadingText: "جاري تحميل القائمة...",
      footerRights: "HD STUDIO © 2026 - جميع الحقوق محفوظة",
      campaignTitle: "العروض الخاصة"
    }
  };

  const t = labels[language] || labels.tr;

  // Filter products by search query, supporting multilingual searching
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    const name = (product.name || '').toLowerCase();
    const nameEn = (product.name_en || '').toLowerCase();
    const nameAr = (product.name_ar || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const descEn = (product.description_en || '').toLowerCase();
    const descAr = (product.description_ar || '').toLowerCase();

    return name.includes(query) ||
           nameEn.includes(query) ||
           nameAr.includes(query) ||
           desc.includes(query) ||
           descEn.includes(query) ||
           descAr.includes(query);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
        <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wider text-neutral-400">{t.loadingText}</span>
      </div>
    );
  }

  const arrowSymbol = language === 'ar' ? '←' : '→';

  return (
    <div className="flex flex-col min-h-screen bg-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* 1. WELCOME SCREEN */}
      <section className="relative flex flex-col justify-between min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white px-6 py-12">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Language Pill Switcher at Top */}
        <div className="flex justify-center gap-1.5 z-20">
          {[
            { code: 'tr', label: 'TR', flag: '🇹🇷' },
            { code: 'en', label: 'EN', flag: '🇬🇧' },
            { code: 'ar', label: 'AR', flag: '🇸🇦' }
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setCurrentCampaignIndex(0); // Reset campaign index on change
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border backdrop-blur-md ${
                language === lang.code
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20 scale-105'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <span className="mr-1">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>

        {/* Logo Placer Container */}
        <div className="flex flex-col items-center justify-center flex-grow py-8 max-w-md mx-auto w-full">
          <a 
            href="https://www.instagram.com/saraydoner9" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative mb-6 block cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          >
            
            {/* Dynamic Logo Box */}
            {settings.welcomeLogo ? (
              <div className="relative w-44 h-44 flex items-center justify-center select-none overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={settings.welcomeLogo} 
                  alt="Logo" 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
            ) : (
              <div className="relative w-44 h-44 bg-black border border-neutral-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none shadow-2xl">
                <h2 className="text-xl font-black text-white tracking-widest mb-1 font-sans">
                  SARAY
                </h2>
                <span className="h-[2px] w-12 bg-red-600 mb-2" />
                <h3 className="text-sm font-bold text-red-500 tracking-[0.25em] uppercase leading-none">
                  DÖNER
                </h3>
                <p className="text-[9px] text-neutral-500 font-semibold tracking-wider mt-3 uppercase">
                  EST. 1998
                </p>
              </div>
            )}
          </a>

          <p className="text-sm text-neutral-400 text-center max-w-xs leading-relaxed mb-8">
            {getTranslation(settings, 'welcomeDesc', language) || t.welcomeDescFallback}
          </p>

          {/* Campaigns sliding Carousel */}
          {activeCampaigns.length > 0 && (
            <div className="w-full max-w-md mx-auto mb-10 overflow-hidden relative">
              <h4 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center mb-3">
                {t.campaignTitle}
              </h4>
              
              <div className="relative">
                {/* Slides Container */}
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ 
                    transform: `translateX(-${currentCampaignIndex * 100}%)`,
                    direction: 'ltr' // Force LTR for layout translation math
                  }}
                >
                  {activeCampaigns.map((camp) => (
                    <div key={camp.id} className="w-full flex-shrink-0 px-2 select-none">
                      <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-4 flex gap-4 items-center backdrop-blur-md shadow-xl h-28">
                        {camp.image && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                          <h5 className="text-xs font-extrabold text-white truncate">
                            {getTranslation(camp, 'title', language)}
                          </h5>
                          <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mt-1">
                            {getTranslation(camp, 'description', language)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dots navigation if multiple campaigns */}
                {activeCampaigns.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {activeCampaigns.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentCampaignIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentCampaignIndex === idx ? 'w-4 bg-red-500' : 'w-1.5 bg-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Grid/List */}
          <div className="w-full space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleWelcomeCategoryClick(category.id)}
                className="w-full flex items-center justify-between px-6 py-6 bg-neutral-950/65 backdrop-blur-md border border-neutral-800/80 hover:border-red-600/30 rounded-2xl group transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg active:scale-98"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-black transition-all duration-300">
                    <CategoryIcon name={category.icon} size={18} />
                  </div>
                  <span className="text-sm font-semibold tracking-wide text-neutral-200 group-hover:text-red-500 transition-colors duration-200">
                    {getTranslation(category, 'name', language)}
                  </span>
                </div>
                
                <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-red-500 group-hover:border-red-600/30 transition-all duration-300">
                  <span className="text-xs font-bold font-sans">{arrowSymbol}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full animate-bounce">
          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1.5">
            {t.exploreMenu}
          </span>
          <ChevronDown size={16} className="text-neutral-500" />
        </div>
      </section>

      {/* 2. DETAILED PRODUCT MENU */}
      <section 
        ref={menuSectionRef}
        className="w-full bg-neutral-50 flex-grow py-6"
      >
        <div className="max-w-md mx-auto px-4 pb-20">
          
          {/* Header Area */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-extrabold text-neutral-900 tracking-wide">
                {t.menuTitle}
              </h3>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                {t.menuSubtitle}
              </p>
            </div>
            
            {/* Quick stats / Badge */}
            <div className="bg-red-600/10 border border-red-600/20 text-red-600 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase">
              {products.length} {t.activeBadge}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-neutral-400`} size={18} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${language === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 bg-white border border-neutral-200/80 rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all duration-200 shadow-sm text-sm`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold`}
              >
                {t.clearSearch}
              </button>
            )}
          </div>

          {/* Sticky Category Bar Component */}
          {categories.length > 0 && !searchQuery && (
            <div className="mb-6 -mx-4">
              <Navbar 
                categories={categories} 
                activeCategoryId={activeCategoryId} 
                onCategorySelect={handleCategorySelect}
                language={language}
              />
            </div>
          )}

          {/* Products List Grouped by Category */}
          <div className="space-y-8 mt-4">
            {categories.map((category) => {
              // Get products under this category
              const categoryProducts = filteredProducts.filter(p => p.categoryId === category.id);
              
              if (categoryProducts.length === 0) return null;

              return (
                <div 
                  key={category.id} 
                  id={`category-sec-${category.id}`}
                  className="scroll-mt-24" // scroll margin top for sticky header offset
                >
                  {/* Category Title Header */}
                  <div className="flex items-center gap-2 mb-4 border-b border-neutral-200/50 pb-2">
                    <div className="p-1.5 rounded-lg bg-neutral-900 text-red-500 shadow-sm">
                      <CategoryIcon name={category.icon} size={15} />
                    </div>
                    <h3 className="text-md font-bold text-neutral-900 tracking-wide uppercase">
                      {getTranslation(category, 'name', language)}
                    </h3>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 gap-3">
                    {categoryProducts.map((product) => (
                      <Card
                        key={product.id}
                        name={getTranslation(product, 'name', language)}
                        description={getTranslation(product, 'description', language)}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.image}
                        language={language}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty state when no search matches */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                <Utensils size={36} className="text-neutral-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-neutral-700">{t.noResultsTitle}</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  {t.noResultsDesc}
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Footer Info */}
      <footer className="w-full bg-neutral-950 py-6 border-t border-neutral-900 text-center text-[10px] text-neutral-500 tracking-wider">
        <p className="mb-1">{t.footerRights}</p>
        <p className="text-neutral-600"><span className="font-armstrong font-bold">MenuX</span> powered by HD Studio</p>
      </footer>
    </div>
  );
}
