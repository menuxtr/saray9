import React from 'react';

export default function Card({ name, description, price, originalPrice, image, language }) {
  // Format price as Currency
  const formatPrice = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="bg-white border border-neutral-100/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
      {/* Left Column: Product Details */}
      <div className="flex-1 flex flex-col justify-between min-h-[90px]">
        <div>
          <h4 className="text-base font-semibold text-neutral-900 tracking-wide mb-1 leading-tight">
            {name}
          </h4>
          {description && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-auto flex-wrap">
          <span className="text-sm font-bold text-neutral-950 font-sans tracking-tight">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 font-sans line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] font-extrabold bg-red-50 border border-red-100 text-red-600 px-2 py-0.5 rounded-md tracking-wider">
              {language === 'en' ? `${discountPercent}% OFF` : language === 'ar' ? `خصم %${discountPercent}` : `%${discountPercent} İndirim`}
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Square Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex-shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl border border-neutral-100 shadow-inner"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 border border-neutral-100">
            <span className="text-[10px] uppercase font-bold">{language === 'en' ? 'No Image' : language === 'ar' ? 'لا توجد صورة' : 'Görsel Yok'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
