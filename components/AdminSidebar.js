import React, { useState } from 'react';
import { LayoutDashboard, Utensils, LogOut, Menu, X, Layers, Settings, Flame } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, onLogout, username }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'products', name: 'Ürün Yönetimi', icon: Utensils },
    { id: 'categories', name: 'Kategori Yönetimi', icon: Layers },
    { id: 'campaigns', name: 'Kampanya Yönetimi', icon: Flame },
  ];

  if (username === 'admin') {
    menuItems.push({ id: 'settings', name: 'Sistem Ayarları', icon: Settings });
  }

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 w-full flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-900">
        <div className="flex items-center">
          <span className="text-base font-bold text-white tracking-wide font-armstrong">MenuX</span>
        </div>
        
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-neutral-950 border-r border-neutral-900 flex flex-col justify-between transform transition-transform duration-300 md:transform-none md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-neutral-900">
            <div>
              <h1 className="text-base font-bold text-white tracking-wide leading-none mb-1 font-armstrong">
                MenuX
              </h1>
              <p className="text-[10px] text-neutral-500 font-semibold tracking-wide uppercase">
                Yönetim Paneli
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-red-600/10 border border-red-600/20 text-red-500'
                      : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Logout Button */}
        <div className="p-4 border-t border-neutral-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide text-neutral-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 hover:text-red-400 transition-all duration-200 text-left"
          >
            <LogOut size={16} />
            Güvenli Çıkış
          </button>
        </div>
      </aside>
    </>
  );
}
