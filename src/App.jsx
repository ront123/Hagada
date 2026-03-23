import React, { useState, useEffect, useRef } from 'react';
import haggadahData from './data/haggadahData';

/* ─── Haggadah Card Component ─── */
const HaggadahCard = ({ section, isDarkMode, index }) => {
  const [showSpicy, setShowSpicy] = useState(false);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      id={section.id}
      className={`rounded-3xl overflow-hidden mb-14 transition-all duration-700 scroll-mt-24 ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
      } ${isDarkMode ? 'glass-dark animate-glow' : 'glass-light shadow-xl'}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image */}
      <div className="image-overlay relative">
        <img
          src={section.image}
          alt={section.title}
          className="w-full h-64 sm:h-80 object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-4 right-6 z-10">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md ${
            isDarkMode ? 'bg-black/50 text-gold-300' : 'bg-white/70 text-gold-800'
          }`}>
            {section.number}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 text-right" style={{ direction: 'rtl' }}>
        <h2 className={`text-3xl sm:text-4xl font-bold mb-1 ${
          isDarkMode ? 'text-gradient-gold' : 'text-gold-800'
        }`} style={{ fontFamily: 'var(--font-hebrew)' }}>
          {section.title}
        </h2>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gold-500/70' : 'text-gold-600'}`}>
          {section.subtitle}
        </p>

        <div className={`text-lg sm:text-xl leading-loose whitespace-pre-line mb-8 ${
          isDarkMode ? 'text-parchment-200' : 'text-parchment-900'
        }`} style={{ fontFamily: 'var(--font-hebrew)', fontWeight: 400 }}>
          {section.text}
        </div>

        {/* Spicy Button */}
        <div className={`border-t pt-6 ${isDarkMode ? 'border-gold-800/30' : 'border-gold-200'}`}>
          <button
            onClick={() => setShowSpicy(!showSpicy)}
            id={`spicy-btn-${section.id}`}
            className={`px-7 py-3 rounded-full font-bold text-base transition-all duration-300 cursor-pointer ${
              showSpicy
                ? 'bg-gradient-to-l from-gold-600 to-gold-500 text-white shadow-lg shadow-gold-500/30 scale-105'
                : isDarkMode
                  ? 'bg-gold-900/30 text-gold-300 hover:bg-gold-800/50 border border-gold-700/30'
                  : 'bg-gold-100 text-gold-800 hover:bg-gold-200 border border-gold-300'
            }`}
          >
            {showSpicy ? '✖ סגור' : '💡 פירוש פיקנטי'}
          </button>
        </div>

        {/* Spicy Commentary */}
        {showSpicy && (
          <div className={`mt-6 p-5 sm:p-6 rounded-2xl animate-slide-down ${
            isDarkMode
              ? 'bg-gradient-to-bl from-gold-900/40 to-wine-900/20 border border-gold-700/20 text-parchment-100'
              : 'bg-gradient-to-bl from-gold-50 to-wine-50 border border-gold-200 text-parchment-900'
          }`} style={{ direction: 'rtl', borderRight: '4px solid var(--color-gold-500)' }}>
            <p className="text-lg leading-relaxed">{section.spicyComment}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Navigation Component ─── */
const SederNav = ({ isDarkMode, activeSection }) => {
  const navItems = haggadahData.map(s => ({ id: s.id, title: s.title, number: s.number }));

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`hidden lg:block fixed left-4 xl:left-8 w-56 top-1/2 -translate-y-1/2 z-40 p-3 rounded-2xl max-h-[80vh] overflow-y-auto ${
      isDarkMode ? 'glass-dark' : 'glass-light shadow-lg'
    }`} style={{ scrollbarWidth: 'thin' }}>
      <ul className="flex flex-col gap-1.5">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollTo(item.id)}
              className={`w-full text-right px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeSection === item.id
                  ? 'nav-active'
                  : isDarkMode
                    ? 'text-parchment-300 hover:bg-gold-900/30'
                    : 'text-parchment-800 hover:bg-gold-100'
              }`}
              style={{ fontFamily: 'var(--font-hebrew)' }}
            >
              <span className="opacity-50 text-xs ml-1">{item.number}</span>
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

/* ─── Mobile Nav ─── */
const MobileNav = ({ isDarkMode, isOpen, setIsOpen }) => {
  const scrollTo = (id) => {
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-fade-in" onClick={() => setIsOpen(false)}>
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-md`} />
      <div
        className={`absolute top-16 left-4 right-4 p-4 rounded-2xl max-h-[70vh] overflow-y-auto ${
          isDarkMode ? 'glass-dark' : 'glass-light shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ direction: 'rtl' }}
      >
        <h3 className={`text-xl font-bold mb-3 px-2 ${isDarkMode ? 'text-gold-400' : 'text-gold-700'}`}
          style={{ fontFamily: 'var(--font-hebrew)' }}>
          סדר ההגדה
        </h3>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {haggadahData.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  isDarkMode
                    ? 'text-parchment-200 hover:bg-gold-900/40'
                    : 'text-parchment-800 hover:bg-gold-100'
                }`}
                style={{ fontFamily: 'var(--font-hebrew)' }}
              >
                <span className="opacity-40 text-xs ml-1">{s.number}</span>
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ─── Progress Bar ─── */
const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60]">
      <div
        className="h-full bg-gradient-to-l from-gold-400 via-gold-500 to-wine-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

/* ─── Main App ─── */
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('kadesh');

  /* Track active section */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    haggadahData.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      isDarkMode ? 'hero-gradient-dark text-white' : 'hero-gradient-light text-parchment-900'
    }`}>
      <ProgressBar />

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b flex justify-between items-center px-5 sm:px-10 py-4 ${
        isDarkMode ? 'bg-[#0a0a1a]/80 border-gold-900/20' : 'bg-parchment-50/80 border-gold-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            id="theme-toggle"
            className={`p-2.5 rounded-full text-xl transition-all cursor-pointer ${
              isDarkMode ? 'bg-gold-900/30 hover:bg-gold-800/50' : 'bg-gold-100 hover:bg-gold-200'
            }`}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            id="mobile-nav-toggle"
            className={`lg:hidden p-2.5 rounded-full text-xl transition-all cursor-pointer ${
              isDarkMode ? 'bg-gold-900/30 hover:bg-gold-800/50' : 'bg-gold-100 hover:bg-gold-200'
            }`}
          >
            {mobileNavOpen ? '✖' : '☰'}
          </button>
        </div>
        <h1
          className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isDarkMode ? 'text-gradient-gold' : 'text-gold-700'
          }`}
          style={{ fontFamily: 'var(--font-hebrew)' }}
        >
          הגדה של פסח 2026
        </h1>
      </header>

      {/* Mobile Nav */}
      <MobileNav isDarkMode={isDarkMode} isOpen={mobileNavOpen} setIsOpen={setMobileNavOpen} />

      {/* Desktop Side Nav */}
      <SederNav isDarkMode={isDarkMode} activeSection={activeSection} />

      {/* Hero Section */}
      <section className="text-center py-16 sm:py-24 px-6" style={{ direction: 'rtl' }}>
        <p className={`text-lg mb-4 ${isDarkMode ? 'text-gold-500' : 'text-gold-600'}`}>
          פסח תשפ״ו • 2026
        </p>
        <h2
          className={`text-5xl sm:text-7xl font-black mb-6 ${isDarkMode ? 'text-gradient-gold' : 'text-gold-800'}`}
          style={{ fontFamily: 'var(--font-hebrew)' }}
        >
          הַגָּדָה שֶׁל פֶּסַח
        </h2>
        <p className={`text-xl max-w-xl mx-auto leading-relaxed ${isDarkMode ? 'text-parchment-300' : 'text-parchment-700'}`}>
          לקרוא, לשיר, לשאול ולספר
        </p>
        <div className={`mt-10 w-24 h-px mx-auto ${isDarkMode ? 'bg-gold-700' : 'bg-gold-300'}`} />
      </section>

      {/* Cards */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 lg:pl-[260px] xl:pl-[300px]">
        {haggadahData.map((section, index) => (
          <HaggadahCard
            key={section.id}
            section={section}
            isDarkMode={isDarkMode}
            index={index}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className={`text-center py-16 border-t ${
        isDarkMode ? 'border-gold-900/20' : 'border-gold-200'
      }`}>
        <p className={`text-2xl mb-3 font-bold ${isDarkMode ? 'text-gradient-gold' : 'text-gold-700'}`}
          style={{ fontFamily: 'var(--font-hebrew)' }}>
          לְשָׁנָה הַבָּאָה בִּירוּשָׁלָיִם!
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-parchment-500' : 'text-parchment-600'}`}>
          נבנה באהבה • פסח תשפ״ו
        </p>
      </footer>
    </div>
  );
}