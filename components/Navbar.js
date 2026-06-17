import React, { useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

// Dynamic Icon Renderer
export function CategoryIcon({ name, size = 14, className = "" }) {
  const IconComponent = Icons[name] || Icons.Utensils;
  return <IconComponent size={size} className={className} />;
}

export default function Navbar({ categories, activeCategoryId, onCategorySelect, language }) {
  const containerRef = useRef(null);

  // Auto scroll active category chip into view in the horizontal bar
  useEffect(() => {
    if (activeCategoryId && containerRef.current) {
      const activeChip = containerRef.current.querySelector(`[data-id="${activeCategoryId}"]`);
      if (activeChip) {
        const container = containerRef.current;
        const containerScrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const chipLeft = activeChip.offsetLeft;
        const chipWidth = activeChip.clientWidth;

        // Smooth scroll to keep chip centered in horizontal scroll
        container.scrollTo({
          left: chipLeft - containerWidth / 2 + chipWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategoryId]);

  return (
    <div className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm transition-all duration-300">
      <div className="max-w-md mx-auto">
        {/* Horizontal scroll container */}
        <div
          ref={containerRef}
          className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-none select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            const nameKey = language === 'en' ? 'name_en' : language === 'ar' ? 'name_ar' : 'name';
            const displayName = category[nameKey] || category.name;
            return (
              <button
                key={category.id}
                data-id={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 transform border active:scale-95 ${
                  isActive
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-md shadow-neutral-900/10 scale-105'
                    : 'bg-neutral-50/50 border-neutral-200/80 text-neutral-600 hover:bg-neutral-100/50 hover:text-neutral-900'
                }`}
              >
                <CategoryIcon name={category.icon} size={13} className={isActive ? 'text-red-500' : 'text-neutral-400'} />
                {displayName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
