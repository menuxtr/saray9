'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, UploadCloud, Check, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import Modal from '@/components/Modal';
import FormInput from '@/components/FormInput';
import { CategoryIcon } from '@/components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUsername, setCurrentUsername] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'categories'

  // Data States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // null for create, object for edit
  const [currentProduct, setCurrentProduct] = useState(null); // null for create, object for edit
  const [currentCampaign, setCurrentCampaign] = useState(null); // null for create, object for edit

  // Campaigns Data State
  const [campaigns, setCampaigns] = useState([]);

  // Form States - Campaigns
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignTitleEn, setCampaignTitleEn] = useState('');
  const [campaignTitleAr, setCampaignTitleAr] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [campaignDescEn, setCampaignDescEn] = useState('');
  const [campaignDescAr, setCampaignDescAr] = useState('');
  const [campaignImage, setCampaignImage] = useState('');
  const [campaignPrice, setCampaignPrice] = useState('');
  const [campaignOriginalPrice, setCampaignOriginalPrice] = useState('');
  const [campaignStartDate, setCampaignStartDate] = useState('');
  const [campaignEndDate, setCampaignEndDate] = useState('');
  const [campaignIsActive, setCampaignIsActive] = useState(true);

  // Form States - Category
  const [categoryName, setCategoryName] = useState('');
  const [categoryNameEn, setCategoryNameEn] = useState('');
  const [categoryNameAr, setCategoryNameAr] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('Utensils');

  // Form States - Product
  const [productName, setProductName] = useState('');
  const [productNameEn, setProductNameEn] = useState('');
  const [productNameAr, setProductNameAr] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOriginalPrice, setProductOriginalPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productDescEn, setProductDescEn] = useState('');
  const [productDescAr, setProductDescAr] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [productImage, setProductImage] = useState('');

  // Form States - Bulk Price
  const [bulkCatId, setBulkCatId] = useState('all');
  const [bulkType, setBulkType] = useState('percent');
  const [bulkDirection, setBulkDirection] = useState('increase');
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');
  
  // File Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form States - Settings
  const [settingsLogo, setSettingsLogo] = useState('/menux500.png');
  const [welcomeDesc, setWelcomeDesc] = useState('');
  const [welcomeDescEn, setWelcomeDescEn] = useState('');
  const [welcomeDescAr, setWelcomeDescAr] = useState('');
  const [settingsUploading, setSettingsUploading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Category Explorer State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // User Management States
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userToChangePw, setUserToChangePw] = useState('');
  const [changePwVal, setChangePwVal] = useState('');
  const [userSuccessMessage, setUserSuccessMessage] = useState('');
  const [userErrorMessage, setUserErrorMessage] = useState('');

  // Icon options for categories
  const iconOptions = [
    { id: 'Utensils', name: 'Çatal Bıçak (Genel)' },
    { id: 'Beef', name: 'Et Resimleri / Döner' },
    { id: 'Flame', name: 'Alevli / İskender / Izgara' },
    { id: 'Cake', name: 'Pasta / Tatlı' },
    { id: 'CupSoda', name: 'Soğuk İçecek' },
    { id: 'Coffee', name: 'Sıcak İçecek / Kahve' },
    { id: 'Pizza', name: 'Pizza / Pide' },
    { id: 'Salad', name: 'Salata / Meze' },
  ];

  // 1. Authenticate check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/panel/login');
        } else {
          setAuthenticated(true);
          setCurrentUsername(data.username || '');
          fetchData();
        }
      } catch (err) {
        console.error(err);
        router.push('/panel/login');
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch products, categories, settings, campaigns and users
  async function fetchData() {
    setLoadingData(true);
    try {
      const [catsRes, prodsRes, settingsRes, usersRes, campaignsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/settings'),
        fetch('/api/users'),
        fetch('/api/campaigns')
      ]);
      const cats = await catsRes.json();
      const prods = await prodsRes.json();
      const settings = await settingsRes.json();
      const usersData = await usersRes.json();
      const campaignsData = await campaignsRes.json();
      
      setCategories(cats);
      setProducts(prods);
      setUsers(usersData);
      setCampaigns(campaignsData);
      
      if (settings) {
        setSettingsLogo(settings.welcomeLogo || '');
        setWelcomeDesc(settings.welcomeDesc || '');
        setWelcomeDescEn(settings.welcomeDesc_en || '');
        setWelcomeDescAr(settings.welcomeDesc_ar || '');
      }

      if (usersData.length > 0 && !userToChangePw) {
        setUserToChangePw(usersData[0].username);
      }
      
      if (cats.length > 0) {
        setProductCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Veri çekme hatası:', err);
    } finally {
      setLoadingData(false);
    }
  }

  // 3. Logout action
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/panel/login');
    } catch (err) {
      console.error(err);
    }
  };

  // 4. File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProductImage(data.filePath);
      } else {
        setUploadError(data.error || 'Yükleme başarısız.');
      }
    } catch (err) {
      setUploadError('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  // Settings Save Handler
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          welcomeLogo: settingsLogo, 
          welcomeDesc,
          welcomeDesc_en: welcomeDescEn,
          welcomeDesc_ar: welcomeDescAr
        }),
      });

      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Logo File Upload Handler
  const handleSettingsLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSettingsUploading(true);
    setSettingsError('');
    setSettingsSaved(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSettingsLogo(data.filePath);
      } else {
        setSettingsError(data.error || 'Yükleme başarısız.');
      }
    } catch (err) {
      setSettingsError('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setSettingsUploading(false);
    }
  };

  // 5. Category Form Submit (Add/Edit)
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      name: categoryName, 
      name_en: categoryNameEn, 
      name_ar: categoryNameAr, 
      icon: categoryIcon 
    };

    try {
      let url = '/api/categories';
      let method = 'POST';

      if (currentCategory) {
        url = `/api/categories/${currentCategory.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCategoryModalOpen(false);
        fetchData();
        // Reset
        setCategoryName('');
        setCategoryIcon('Utensils');
        setCurrentCategory(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Bu kategoriyi ve bağlı tüm ürünleri silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedCategoryId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Category Edit Modal
  const openCategoryEditModal = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryNameEn(category.name_en || '');
    setCategoryNameAr(category.name_ar || '');
    setCategoryIcon(category.icon);
    setIsCategoryModalOpen(true);
  };

  // Re-order Category Up/Down
  const handleMoveCategory = async (id, direction) => {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return;

    const newCategories = [...categories];
    if (direction === 'up' && index > 0) {
      const temp = newCategories[index];
      newCategories[index] = newCategories[index - 1];
      newCategories[index - 1] = temp;
    } else if (direction === 'down' && index < newCategories.length - 1) {
      const temp = newCategories[index];
      newCategories[index] = newCategories[index + 1];
      newCategories[index + 1] = temp;
    } else {
      return;
    }

    try {
      const orderedIds = newCategories.map(c => c.id);
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });

      if (res.ok) {
        setCategories(newCategories);
      }
    } catch (err) {
      console.error('Kategori sıralama hatası:', err);
    }
  };

  // Re-order Product Up/Down
  const handleMoveProduct = async (id, direction) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const categoryId = prod.categoryId;
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    
    const indexInCat = categoryProducts.findIndex(p => p.id === id);
    if (indexInCat === -1) return;

    let targetIndexInCat = -1;
    if (direction === 'up' && indexInCat > 0) {
      targetIndexInCat = indexInCat - 1;
    } else if (direction === 'down' && indexInCat < categoryProducts.length - 1) {
      targetIndexInCat = indexInCat + 1;
    } else {
      return;
    }

    const newCategoryProducts = [...categoryProducts];
    const temp = newCategoryProducts[indexInCat];
    newCategoryProducts[indexInCat] = newCategoryProducts[targetIndexInCat];
    newCategoryProducts[targetIndexInCat] = temp;

    const newProducts = [];
    let catProductIndex = 0;
    
    products.forEach(p => {
      if (p.categoryId === categoryId) {
        newProducts.push(newCategoryProducts[catProductIndex++]);
      } else {
        newProducts.push(p);
      }
    });

    try {
      const orderedIds = newProducts.map(p => p.id);
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });

      if (res.ok) {
        setProducts(newProducts);
      }
    } catch (err) {
      console.error('Ürün sıralama hatası:', err);
    }
  };

  // Create User Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserSuccessMessage('');
    setUserErrorMessage('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserSuccessMessage(`Kullanıcı (${newUsername}) başarıyla oluşturuldu.`);
        setNewUsername('');
        setNewPassword('');
        fetchData();
      } else {
        setUserErrorMessage(data.error || 'Kullanıcı oluşturulamadı.');
      }
    } catch (err) {
      setUserErrorMessage('Bağlantı hatası oluştu.');
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setUserSuccessMessage('');
    setUserErrorMessage('');

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userToChangePw, newPassword: changePwVal }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserSuccessMessage(`Kullanıcı (${userToChangePw}) şifresi güncellendi.`);
        setChangePwVal('');
      } else {
        setUserErrorMessage(data.error || 'Şifre güncellenemedi.');
      }
    } catch (err) {
      setUserErrorMessage('Bağlantı hatası oluştu.');
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (username) => {
    if (!window.confirm(`Kullanıcıyı (${username}) silmek istediğinize emin misiniz?`)) return;
    setUserSuccessMessage('');
    setUserErrorMessage('');

    try {
      const res = await fetch(`/api/users?username=${username}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setUserSuccessMessage(`Kullanıcı (${username}) silindi.`);
        fetchData();
      } else {
        setUserErrorMessage(data.error || 'Kullanıcı silinemedi.');
      }
    } catch (err) {
      setUserErrorMessage('Bağlantı hatası oluştu.');
    }
  };

  // 6. Product Form Submit (Add/Edit)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: productName,
      name_en: productNameEn,
      name_ar: productNameAr,
      price: parseFloat(productPrice),
      originalPrice: productOriginalPrice ? parseFloat(productOriginalPrice) : null,
      description: productDesc,
      description_en: productDescEn,
      description_ar: productDescAr,
      categoryId: productCategoryId,
      image: productImage,
    };

    try {
      let url = '/api/products';
      let method = 'POST';

      if (currentProduct) {
        url = `/api/products/${currentProduct.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        fetchData();
        // Reset
        setProductName('');
        setProductNameEn('');
        setProductNameAr('');
        setProductPrice('');
        setProductOriginalPrice('');
        setProductDesc('');
        setProductDescEn('');
        setProductDescAr('');
        setProductImage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Product Modal for Edit/Create
  const openProductModal = (product = null) => {
    setCurrentProduct(product);
    if (product) {
      setProductName(product.name);
      setProductNameEn(product.name_en || '');
      setProductNameAr(product.name_ar || '');
      setProductPrice(product.price);
      setProductOriginalPrice(product.originalPrice || '');
      setProductDesc(product.description || '');
      setProductDescEn(product.description_en || '');
      setProductDescAr(product.description_ar || '');
      setProductCategoryId(product.categoryId);
      setProductImage(product.image || '');
    } else {
      setProductName('');
      setProductNameEn('');
      setProductNameAr('');
      setProductPrice('');
      setProductOriginalPrice('');
      setProductDesc('');
      setProductDescEn('');
      setProductDescAr('');
      setProductCategoryId(categories[0]?.id || '');
      setProductImage('');
    }
    setUploadError('');
    setIsProductModalOpen(true);
  };

  // Open Category Modal
  const openCategoryModal = () => {
    setCurrentCategory(null);
    setCategoryName('');
    setCategoryNameEn('');
    setCategoryNameAr('');
    setCategoryIcon('Utensils');
    setIsCategoryModalOpen(true);
  };

  // Open Campaign Modal for Edit/Create
  const openCampaignModal = (campaign = null) => {
    setCurrentCampaign(campaign);
    if (campaign) {
      setCampaignTitle(campaign.title);
      setCampaignTitleEn(campaign.title_en || '');
      setCampaignTitleAr(campaign.title_ar || '');
      setCampaignDesc(campaign.description || '');
      setCampaignDescEn(campaign.description_en || '');
      setCampaignDescAr(campaign.description_ar || '');
      setCampaignImage(campaign.image || '');
      setCampaignPrice(campaign.price !== undefined && campaign.price !== null ? campaign.price.toString() : '');
      setCampaignOriginalPrice(campaign.originalPrice !== undefined && campaign.originalPrice !== null ? campaign.originalPrice.toString() : '');
      setCampaignStartDate(campaign.startDate || '');
      setCampaignEndDate(campaign.endDate || '');
      setCampaignIsActive(campaign.isActive !== undefined ? campaign.isActive : true);
    } else {
      setCampaignTitle('');
      setCampaignTitleEn('');
      setCampaignTitleAr('');
      setCampaignDesc('');
      setCampaignDescEn('');
      setCampaignDescAr('');
      setCampaignImage('');
      setCampaignPrice('');
      setCampaignOriginalPrice('');
      setCampaignStartDate('');
      setCampaignEndDate('');
      setCampaignIsActive(true);
    }
    setUploadError('');
    setIsCampaignModalOpen(true);
  };

  // Campaign Form Submit
  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: campaignTitle,
      title_en: campaignTitleEn,
      title_ar: campaignTitleAr,
      description: campaignDesc,
      description_en: campaignDescEn,
      description_ar: campaignDescAr,
      image: campaignImage,
      price: campaignPrice ? parseFloat(campaignPrice) : null,
      originalPrice: campaignOriginalPrice ? parseFloat(campaignOriginalPrice) : null,
      startDate: campaignStartDate,
      endDate: campaignEndDate,
      isActive: campaignIsActive,
    };

    try {
      let url = '/api/campaigns';
      let method = 'POST';

      if (currentCampaign) {
        url = `/api/campaigns/${currentCampaign.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCampaignModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Kampanya kaydetme hatası:', err);
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Kampanya silme hatası:', err);
    }
  };

  // Campaign Image Upload Handler
  const handleCampaignImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setCampaignImage(data.filePath);
      } else {
        setUploadError(data.error || 'Yükleme başarısız.');
      }
    } catch (err) {
      setUploadError('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  // Bulk Price Submit Handler
  const handleBulkPriceSubmit = async (e) => {
    e.preventDefault();
    setBulkMessage('');

    if (!bulkAmount || parseFloat(bulkAmount) <= 0) {
      setBulkMessage('Lütfen geçerli bir miktar girin.');
      return;
    }

    try {
      const res = await fetch('/api/products/bulk-price', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: bulkCatId,
          type: bulkType,
          direction: bulkDirection,
          amount: parseFloat(bulkAmount),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBulkMessage(`✓ Başarılı: ${data.message}`);
        setBulkAmount('');
        fetchData();
        setTimeout(() => setBulkMessage(''), 4000);
      } else {
        setBulkMessage(`⚠ Hata: ${data.error}`);
      }
    } catch (err) {
      setBulkMessage('⚠ Bağlantı hatası oluştu.');
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
        <div className="w-10 h-10 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-wider text-neutral-400">Oturum Kontrol Ediliyor...</span>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-950 text-white">
      {/* Sidebar Component */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} username={currentUsername} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        
        {/* Loading Indicator for Data */}
        {loadingData && (
          <div className="fixed top-4 right-4 bg-neutral-900 border border-neutral-800 text-red-500 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg z-50">
            <div className="w-3.5 h-3.5 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
            Senkronize ediliyor...
          </div>
        )}

        {/* Tab 1: Product Management */}
        {activeTab === 'products' && (
          <div>
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-extrabold tracking-wide text-white">
                  Ürün Listesi
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Menünüzdeki tüm yemekleri, tatlıları ve içecekleri ekleyin, güncelleyin veya silin.
                </p>
              </div>

              <button
                onClick={() => openProductModal(null)}
                disabled={categories.length === 0}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-transparent text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/10 active:scale-98 transition-all duration-200"
              >
                <Plus size={16} />
                Yeni Ürün Ekle
              </button>
            </div>

            {/* Warning if no categories */}
            {categories.length === 0 && (
              <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 text-xs font-medium mb-6">
                <AlertTriangle size={18} className="flex-shrink-0" />
                <span>Ürün eklemeden önce en az bir adet **kategori** oluşturmanız gerekmektedir. Lütfen yan menüden Kategori Yönetimine gidin.</span>
              </div>
            )}

            {/* Toplu Fiyat Güncelleme Kartı */}
            {categories.length > 0 && (
              <div className="bg-neutral-900/20 border border-neutral-900 rounded-3xl p-5 mb-8 shadow-lg">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
                  Toplu Fiyat Güncelleme Modülü
                </h3>
                <form onSubmit={handleBulkPriceSubmit} className="flex flex-wrap items-end gap-4">
                  <div className="flex-grow min-w-[150px]">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                      Kategori
                    </label>
                    <select
                      value={bulkCatId}
                      onChange={(e) => setBulkCatId(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-xl text-white text-xs focus:outline-none transition-all"
                    >
                      <option value="all">Tüm Kategoriler</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                      İşlem Türü
                    </label>
                    <select
                      value={bulkType}
                      onChange={(e) => setBulkType(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-xl text-white text-xs focus:outline-none transition-all"
                    >
                      <option value="percent">Yüzdesel (%)</option>
                      <option value="fixed">Sabit (TL)</option>
                    </select>
                  </div>

                  <div className="w-28">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                      Yön
                    </label>
                    <select
                      value={bulkDirection}
                      onChange={(e) => setBulkDirection(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-xl text-white text-xs focus:outline-none transition-all"
                    >
                      <option value="increase">Fiyat Arttır</option>
                      <option value="decrease">Fiyat Azalt</option>
                    </select>
                  </div>

                  <div className="w-24">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                      Miktar ({bulkType === 'percent' ? '%' : 'TL'})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder={bulkType === 'percent' ? '10' : '15'}
                      value={bulkAmount}
                      onChange={(e) => setBulkAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-xl text-white text-xs focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600/15 hover:bg-red-600 border border-red-600/25 text-red-500 hover:text-white text-xs font-bold rounded-xl transition-all active:scale-95"
                  >
                    Fiyatları Güncelle
                  </button>
                </form>

                {bulkMessage && (
                  <p className={`text-[10px] font-bold mt-3 ${bulkMessage.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                    {bulkMessage}
                  </p>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const category = categories.find(c => c.id === product.categoryId);
                return (
                  <div
                    key={product.id}
                    className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-800 transition-all duration-300 shadow-lg"
                  >
                    <div>
                      {/* Product Header */}
                      <div className="flex gap-3 mb-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex-shrink-0">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-neutral-500">
                              RESİM YOK
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {product.name}
                          </h4>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 bg-neutral-950 border border-neutral-800 rounded-md text-[10px] font-semibold text-neutral-400">
                            {category ? category.name : 'Kategorisiz'}
                          </span>
                        </div>
                      </div>

                      {/* Product description */}
                      {product.description && (
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Product Footer / Actions */}
                    <div className="flex items-center justify-between border-t border-neutral-900/60 pt-3 mt-auto">
                      <span className="text-sm font-bold text-red-500 tracking-tight">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openProductModal(product)}
                          className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all duration-200"
                          title="Düzenle"
                        >
                          <Edit2 size={13} />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 rounded-lg bg-neutral-950 border border-red-950 hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-all duration-200"
                          title="Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {products.length === 0 && !loadingData && (
                <div className="col-span-full text-center py-16 bg-neutral-900/20 border border-dashed border-neutral-900 rounded-3xl">
                  <p className="text-sm text-neutral-500">Kayıtlı ürün bulunmuyor. Eklemek için sağ üstteki butona tıklayın.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Category Management */}
        {activeTab === 'categories' && (
          <div>
            {selectedCategoryId === null ? (
              <div>
                {/* Header section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-wide text-white">
                      Kategori Listesi
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Kategorilere tıklayarak içindeki ürünleri görebilir, düzenleyebilir veya yeni ürün ekleyebilirsiniz.
                    </p>
                  </div>

                  <button
                    onClick={openCategoryModal}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/10 active:scale-98 transition-all duration-200"
                  >
                    <Plus size={16} />
                    Yeni Kategori Ekle
                  </button>
                </div>

                {/* Categories list table / grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      className="bg-neutral-900/40 border border-neutral-900 hover:border-red-600/30 rounded-2xl p-4 flex items-center justify-between shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                          <CategoryIcon name={category.icon} size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-wide">
                            {category.name}
                          </h4>
                          <p className="text-[9px] text-neutral-500 font-semibold tracking-wider mt-0.5 uppercase">
                            İncelemek İçin Tıklayın
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleMoveCategory(category.id, 'up')}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleMoveCategory(category.id, 'down')}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg">
                          {products.filter(p => p.categoryId === category.id).length} Ürün
                        </span>
                      </div>
                    </div>
                  ))}

                  {categories.length === 0 && !loadingData && (
                    <div className="col-span-full text-center py-16 bg-neutral-900/20 border border-dashed border-neutral-900 rounded-3xl">
                      <p className="text-sm text-neutral-500">Kayıtlı kategori bulunmuyor. Eklemek için sağ üstteki butona tıklayın.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // CATEGORY EXPLORER VIEW (kategoriye tıklayınca açılan ekran)
              <div>
                {/* Back Button & Category Details Header */}
                {(() => {
                  const category = categories.find(c => c.id === selectedCategoryId);
                  if (!category) return <button onClick={() => setSelectedCategoryId(null)}>Geri Dön</button>;

                  const categoryProducts = products.filter(p => p.categoryId === selectedCategoryId);

                  return (
                    <div className="space-y-6">
                      <button
                        onClick={() => setSelectedCategoryId(null)}
                        className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        ← Kategorilere Dön
                      </button>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900/20 border border-neutral-900 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                            <CategoryIcon name={category.icon} size={20} />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                              {category.name}
                            </h2>
                            <p className="text-xs text-neutral-400 mt-1">
                              {categoryProducts.length} aktif ürün listeleniyor
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openCategoryEditModal(category)}
                            className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-300 hover:text-white transition-all"
                          >
                            Kategoriyi Düzenle
                          </button>
                          
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="px-4 py-2.5 rounded-xl border border-red-950 hover:bg-red-500/10 text-xs font-bold text-red-500 hover:text-red-400 transition-all"
                          >
                            Kategoriyi Sil
                          </button>
                        </div>
                      </div>

                      {/* Products inside this category Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
                            Bu Kategoriye Ait Ürünler
                          </h3>

                          <button
                            onClick={() => {
                              openProductModal(null);
                              setProductCategoryId(selectedCategoryId);
                            }}
                            className="flex items-center gap-1 px-3.5 py-2 bg-red-600/15 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/25 rounded-xl text-xs font-bold transition-all active:scale-95"
                          >
                            <Plus size={14} />
                            Yeni Ürün Ekle
                          </button>
                        </div>

                        {/* Product listing grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categoryProducts.map((product) => (
                            <div
                              key={product.id}
                              className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-800 transition-all duration-300 shadow-lg"
                            >
                              <div>
                                <div className="flex gap-3 mb-3">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex-shrink-0">
                                    {product.image ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-neutral-500">
                                        RESİM YOK
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-white leading-snug">
                                      {product.name}
                                    </h4>
                                  </div>
                                </div>
                                {product.description && (
                                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                                    {product.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between border-t border-neutral-900/60 pt-3 mt-auto">
                                <span className="text-sm font-bold text-red-500 tracking-tight">
                                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleMoveProduct(product.id, 'up')}
                                    className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all duration-200"
                                    title="Yukarı Taşı"
                                  >
                                    <ArrowUp size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleMoveProduct(product.id, 'down')}
                                    className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all duration-200"
                                    title="Aşağı Taşı"
                                  >
                                    <ArrowDown size={13} />
                                  </button>
                                  <button
                                    onClick={() => openProductModal(product)}
                                    className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all duration-200"
                                    title="Düzenle"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="p-2 rounded-lg bg-neutral-950 border border-red-950 hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-all duration-200"
                                    title="Sil"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {categoryProducts.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-neutral-900/10 border border-dashed border-neutral-900 rounded-3xl">
                              <p className="text-xs text-neutral-500">Bu kategoride henüz ürün bulunmuyor.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Tab: Campaigns / Kampanya Yönetimi */}
        {activeTab === 'campaigns' && (
          <div>
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-extrabold tracking-wide text-white">
                  Kampanya Listesi
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Müşteri ekranında (logo altında) yer alacak tarihe bağlı aktif kampanyalarınızı yönetin.
                </p>
              </div>

              <button
                onClick={() => openCampaignModal(null)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg active:scale-98 transition-all duration-200"
              >
                <Plus size={16} />
                Yeni Kampanya Ekle
              </button>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => {
                const todayStr = new Date().toISOString().split('T')[0];
                const isDateActive = (!campaign.startDate || todayStr >= campaign.startDate) && (!campaign.endDate || todayStr <= campaign.endDate);
                const isCurrentlyActive = campaign.isActive && isDateActive;

                return (
                  <div
                    key={campaign.id}
                    className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-800 transition-all duration-300 shadow-lg"
                  >
                    <div>
                      {/* Campaign Header / Image */}
                      {campaign.image ? (
                        <div className="w-full h-32 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-3 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-[10px] font-bold text-neutral-500 mb-3">
                          GÖRSEL YOK
                        </div>
                      )}

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {campaign.title}
                      </h4>
                      {campaign.description && (
                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                          {campaign.description}
                        </p>
                      )}

                      {/* Dates & Status badges */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded-md text-[9px] font-semibold text-neutral-400">
                          {campaign.startDate || 'Süresiz'} / {campaign.endDate || 'Süresiz'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                          isCurrentlyActive
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                          {isCurrentlyActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-1.5 border-t border-neutral-900/60 pt-3 mt-4">
                      <button
                        onClick={() => openCampaignModal(campaign)}
                        className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all duration-200"
                        title="Düzenle"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="p-2 rounded-lg bg-neutral-950 border border-red-950 hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-all duration-200"
                        title="Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {campaigns.length === 0 && (
                <div className="col-span-full text-center py-16 bg-neutral-900/20 border border-dashed border-neutral-900 rounded-3xl">
                  <p className="text-sm text-neutral-500">Kayıtlı kampanya bulunmuyor. Eklemek için sağ üstteki butona tıklayın.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Settings / Ayar Yönetimi */}
        {activeTab === 'settings' && (
          currentUsername !== 'admin' ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle size={48} className="text-red-500 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-white tracking-wide">Erişim Yetkiniz Yok</h3>
              <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-normal">
                Bu sayfaya erişim yetkiniz bulunmamaktadır. Yalnızca birincil 'admin' kullanıcısı sistem ayarlarını değiştirebilir.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
            {/* Header */}
            <div>
              <h2 className="text-xl font-extrabold tracking-wide text-white">
                Ayar Yönetimi
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Menü karşılama arayüzünü tasarlayın ve sistem erişim yetkilerini (kullanıcı ekleme/çıkarma, şifre değiştirme) yönetin.
              </p>
            </div>

            {/* Notification alert */}
            {(userSuccessMessage || userErrorMessage) && (
              <div className={`p-4 rounded-xl border text-xs font-semibold max-w-xl ${
                userSuccessMessage 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {userSuccessMessage || userErrorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Section 1: Arayüz Ayarları (Logo Placer & Açıklama) */}
              <div className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <form onSubmit={handleSettingsSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-200 mb-4 border-b border-neutral-800 pb-2 uppercase tracking-wider">
                      Menü Hoş Geldiniz Ekranı Ayarları
                    </h3>
                    
                    {/* Welcome Logo Placer Image upload */}
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        Logo Placer Resmi (Karşılama Görseli)
                      </label>

                      {settingsLogo ? (
                        <div className="mb-4">
                          <div className="relative inline-flex items-center justify-center p-6 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden min-h-24">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={settingsLogo} 
                              alt="Karşılama Logosu" 
                              className="h-16 max-w-[200px] object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => setSettingsLogo('')}
                              className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 hover:bg-neutral-950 border border-neutral-800 rounded-md text-[9px] font-bold text-red-400 hover:text-red-300"
                            >
                              Kaldır
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative border-2 border-dashed border-neutral-800 hover:border-red-600/30 rounded-2xl transition-all p-5 text-center bg-neutral-950/20 mb-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSettingsLogoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          {settingsUploading ? (
                            <div className="w-5 h-5 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto" />
                          ) : (
                            <div>
                              <UploadCloud size={20} className="text-neutral-500 mx-auto mb-1.5" />
                              <span className="text-[11px] text-neutral-300 font-bold block">Görsel Yüklemek İçin Tıklayın</span>
                              <span className="text-[9px] text-neutral-500 mt-0.5 block">Kare Logo Görseli - Maks 2MB</span>
                            </div>
                          )}
                        </div>
                      )}
                      {settingsError && <p className="text-xs text-red-400 mt-1">{settingsError}</p>}
                    </div>

                    {/* Welcome Description text area */}
                    <div className="mb-4">
                      <FormInput
                        label="Karşılama Ekranı Açıklama Yazısı (Türkçe)"
                        id="welcomeDesc"
                        textarea
                        rows={3}
                        value={welcomeDesc}
                        onChange={(e) => setWelcomeDesc(e.target.value)}
                        placeholder="Eşsiz lezzetlerimizle hazırlanan menümüze hoş geldiniz..."
                      />
                    </div>
                    <div className="mb-4">
                      <FormInput
                        label="Karşılama Ekranı Açıklama Yazısı (İngilizce)"
                        id="welcomeDescEn"
                        textarea
                        rows={3}
                        value={welcomeDescEn}
                        onChange={(e) => setWelcomeDescEn(e.target.value)}
                        placeholder="Welcome to our menu prepared with unique flavors..."
                      />
                    </div>
                    <div className="mb-4">
                      <FormInput
                        label="Karşılama Ekranı Açıklama Yazısı (Arapça)"
                        id="welcomeDescAr"
                        textarea
                        rows={3}
                        value={welcomeDescAr}
                        onChange={(e) => setWelcomeDescAr(e.target.value)}
                        placeholder="مرحبًا بكم في قائمتنا المحضرة بالنكهات الفريدة..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-900/60 pt-4 mt-auto">
                    {settingsSaved ? (
                      <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                        ✓ Kaydedildi!
                      </span>
                    ) : <span />}

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all duration-200"
                    >
                      Arayüzü Güncelle
                    </button>
                  </div>
                </form>
              </div>

              {/* Section 2: Kullanıcı Yönetimi (Ekle, Sil & Şifre Değiştir) */}
              <div className="space-y-6">
                
                {/* 2A: Yeni Kullanıcı Ekle */}
                <div className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-neutral-200 mb-4 border-b border-neutral-800 pb-2 uppercase tracking-wider">
                    Yeni Kullanıcı Ekle
                  </h3>

                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput
                        label="Kullanıcı Adı"
                        id="newUsername"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Örn: admin2"
                        required
                      />
                      <FormInput
                        label="Şifre"
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    
                    <div className="text-right">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all duration-200"
                      >
                        Kullanıcı Oluştur
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2B: Şifre Değiştirme */}
                <div className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-neutral-200 mb-4 border-b border-neutral-800 pb-2 uppercase tracking-wider">
                    Şifre Değiştirme Sistemi
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                          Kullanıcı Seçin
                        </label>
                        <select
                          value={userToChangePw}
                          onChange={(e) => setUserToChangePw(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 text-sm"
                        >
                          {users.map(u => (
                            <option key={u.username} value={u.username}>{u.username}</option>
                          ))}
                        </select>
                      </div>

                      <FormInput
                        label="Yeni Şifre"
                        id="changePwVal"
                        type="password"
                        value={changePwVal}
                        onChange={(e) => setChangePwVal(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div className="text-right">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all duration-200"
                      >
                        Şifreyi Güncelle
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2C: Kullanıcı Listesi ve Silme */}
                <div className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-neutral-200 mb-3 border-b border-neutral-800 pb-2 uppercase tracking-wider">
                    Kayıtlı Kullanıcılar
                  </h3>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {users.map((u) => {
                      const isPrimaryAdmin = u.username.toLowerCase() === 'admin';
                      return (
                        <div key={u.username} className="flex items-center justify-between p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl">
                          <span className="text-xs font-semibold text-neutral-200">{u.username}</span>
                          {!isPrimaryAdmin ? (
                            <button
                              onClick={() => handleDeleteUser(u.username)}
                              className="text-[10px] font-bold text-red-500 hover:text-red-400 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                            >
                              Sil
                            </button>
                          ) : (
                            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest px-2 py-1 bg-neutral-900 rounded-md">Birincil</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
            </div>
          )
        )}

      </main>

      {/* MODAL: Category Ekleme/Düzenleme */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={currentCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <FormInput
            label="Kategori Adı (Türkçe) *"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Örn: Yemekler, İçecekler, Nargileler"
            required
          />

          <FormInput
            label="Kategori Adı (İngilizce)"
            id="categoryNameEn"
            value={categoryNameEn}
            onChange={(e) => setCategoryNameEn(e.target.value)}
            placeholder="Örn: Main Dishes, Drinks"
          />

          <FormInput
            label="Kategori Adı (Arapça)"
            id="categoryNameAr"
            value={categoryNameAr}
            onChange={(e) => setCategoryNameAr(e.target.value)}
            placeholder="Örn: الأطباق الرئيسية, مشروبات"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Kategori İkonu
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {iconOptions.map((opt) => {
                const isSelected = categoryIcon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCategoryIcon(opt.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-red-600/10 border-red-600 text-red-500 shadow-inner shadow-red-600/5'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <CategoryIcon name={opt.id} size={15} />
                    <span>{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-900/60 mt-6 justify-end">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              {currentCategory ? 'Kategoriyi Güncelle' : 'Kategori Oluştur'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Ürün Ekleme/Düzenleme */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={currentProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormInput
              label="Ürün Adı (Türkçe) *"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Örn: Yaprak Et Döner Dürüm"
              required
            />
            
            <FormInput
              label="Kısa Açıklama (Türkçe)"
              id="productDesc"
              textarea
              rows={2}
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              placeholder="Örn: Özel soslu lavaşta kıvırcık marul ve patates eşliğinde..."
            />
          </div>

          <div className="border-t border-neutral-900/60 pt-4 space-y-4">
            <FormInput
              label="Ürün Adı (İngilizce)"
              id="productNameEn"
              value={productNameEn}
              onChange={(e) => setProductNameEn(e.target.value)}
              placeholder="Örn: Beef Wrap"
            />
            
            <FormInput
              label="Kısa Açıklama (İngilizce)"
              id="productDescEn"
              textarea
              rows={2}
              value={productDescEn}
              onChange={(e) => setProductDescEn(e.target.value)}
              placeholder="Örn: Special beef wrap served with lettuce..."
            />
          </div>

          <div className="border-t border-neutral-900/60 pt-4 space-y-4">
            <FormInput
              label="Ürün Adı (Arapça)"
              id="productNameAr"
              value={productNameAr}
              onChange={(e) => setProductNameAr(e.target.value)}
              placeholder="Örn: لفافة لحم البقر"
            />
            
            <FormInput
              label="Kısa Açıklama (Arapça)"
              id="productDescAr"
              textarea
              rows={2}
              value={productDescAr}
              onChange={(e) => setProductDescAr(e.target.value)}
              placeholder="Örn: لفافة لحم بقري مميزة تقدم مع الخس..."
            />
          </div>

          <div className="border-t border-neutral-900/60 pt-4 grid grid-cols-2 gap-4">
            <FormInput
              label="Fiyat (TL) *"
              id="productPrice"
              type="number"
              step="0.01"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="120.00"
              required
            />

            <FormInput
              label="Eski Fiyat (İndirim İçin) (TL)"
              id="productOriginalPrice"
              type="number"
              step="0.01"
              value={productOriginalPrice}
              onChange={(e) => setProductOriginalPrice(e.target.value)}
              placeholder="Örn: 150.00"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="productCategory" className="block text-sm font-medium text-neutral-300 mb-1.5">
                Kategori *
              </label>
              <select
                id="productCategory"
                value={productCategoryId}
                onChange={(e) => setProductCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Area with Required Helper Text */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Ürün Görseli
            </label>
            
            {productImage ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productImage}
                  alt="Önizleme"
                  className="w-full h-full object-cover opacity-80"
                />
                <button
                  type="button"
                  onClick={() => setProductImage('')}
                  className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-black/85 hover:bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-bold text-red-400 hover:text-red-300 transition-all shadow-lg"
                >
                  Değiştir / Kaldır
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-neutral-800 hover:border-red-600/30 rounded-xl transition-all p-5 text-center bg-neutral-900/10">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {uploading ? (
                  <div className="flex flex-col items-center py-2">
                    <div className="w-6 h-6 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-2" />
                    <span className="text-xs text-neutral-400 font-semibold">Görsel Yükleniyor...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud size={28} className="text-neutral-500 mb-2" />
                    <span className="text-xs text-neutral-300 font-bold">Resim Yüklemek İçin Tıklayın veya Sürükleyin</span>
                    
                    {/* CRITICAL Helper text required by user prompt */}
                    <span className="text-[10px] text-neutral-500 font-medium mt-1 leading-normal block max-w-[280px] mx-auto">
                      Önerilen Görsel Boyutu: 500x500px (Kare) - Maks: 2MB
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {uploadError && (
              <p className="mt-1.5 text-xs text-red-400 font-semibold flex items-center gap-1">
                <span>⚠</span> {uploadError}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-900/60 mt-6 justify-end">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              {currentProduct ? 'Güncellemeleri Kaydet' : 'Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Kampanya Ekleme/Düzenleme */}
      <Modal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        title={currentCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Ekle'}
      >
        <form onSubmit={handleCampaignSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormInput
              label="Kampanya Başlığı (Türkçe) *"
              id="campaignTitle"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              placeholder="Örn: Hafta Sonu Özel İndirimi"
              required
            />
            <FormInput
              label="Kampanya Açıklaması (Türkçe)"
              id="campaignDesc"
              textarea
              rows={2}
              value={campaignDesc}
              onChange={(e) => setCampaignDesc(e.target.value)}
              placeholder="Örn: Hafta sonuna özel tüm et dönerlerde %10 indirim!"
            />
          </div>

          <div className="border-t border-neutral-900/60 pt-4 space-y-4">
            <FormInput
              label="Kampanya Başlığı (İngilizce)"
              id="campaignTitleEn"
              value={campaignTitleEn}
              onChange={(e) => setCampaignTitleEn(e.target.value)}
              placeholder="Örn: Weekend Special"
            />
            <FormInput
              label="Kampanya Açıklaması (İngilizce)"
              id="campaignDescEn"
              textarea
              rows={2}
              value={campaignDescEn}
              onChange={(e) => setCampaignDescEn(e.target.value)}
              placeholder="Örn: 10% off on all beef wraps this weekend!"
            />
          </div>

          <div className="border-t border-neutral-900/60 pt-4 space-y-4">
            <FormInput
              label="Kampanya Başlığı (Arapça)"
              id="campaignTitleAr"
              value={campaignTitleAr}
              onChange={(e) => setCampaignTitleAr(e.target.value)}
              placeholder="Örn: عطلة نهاية الأسبوع الخاصة"
            />
            <FormInput
              label="Kampanya Açıklaması (Arapça)"
              id="campaignDescAr"
              textarea
              rows={2}
              value={campaignDescAr}
              onChange={(e) => setCampaignDescAr(e.target.value)}
              placeholder="Örn: خصم 10% على جميع لفائف اللحم هذا الأسبوع!"
            />
          </div>

          <div className="border-t border-neutral-900/60 pt-4 grid grid-cols-2 gap-4">
            <FormInput
              label="Kampanya Fiyatı (TL)"
              id="campaignPrice"
              type="number"
              step="any"
              value={campaignPrice}
              onChange={(e) => setCampaignPrice(e.target.value)}
              placeholder="Örn: 160"
            />
            <FormInput
              label="Eski Fiyat (TL)"
              id="campaignOriginalPrice"
              type="number"
              step="any"
              value={campaignOriginalPrice}
              onChange={(e) => setCampaignOriginalPrice(e.target.value)}
              placeholder="Örn: 195"
            />
          </div>

          <div className="border-t border-neutral-900/60 pt-4 grid grid-cols-2 gap-4">
            <FormInput
              label="Başlangıç Tarihi"
              id="campaignStartDate"
              type="date"
              value={campaignStartDate}
              onChange={(e) => setCampaignStartDate(e.target.value)}
            />
            <FormInput
              label="Bitiş Tarihi"
              id="campaignEndDate"
              type="date"
              value={campaignEndDate}
              onChange={(e) => setCampaignEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="campaignIsActive"
              checked={campaignIsActive}
              onChange={(e) => setCampaignIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-800 text-red-600 focus:ring-red-600 focus:ring-opacity-25 bg-neutral-900"
            />
            <label htmlFor="campaignIsActive" className="text-sm font-medium text-neutral-300">
              Kampanya Aktif
            </label>
          </div>

          {/* Campaign Image Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Kampanya Görseli (Geniş / Yatay)
            </label>
            
            {campaignImage ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={campaignImage}
                  alt="Önizleme"
                  className="w-full h-full object-cover opacity-80"
                />
                <button
                  type="button"
                  onClick={() => setCampaignImage('')}
                  className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-black/85 hover:bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-bold text-red-400 hover:text-red-300 transition-all shadow-lg"
                >
                  Değiştir / Kaldır
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-neutral-800 hover:border-red-600/30 rounded-xl transition-all p-5 text-center bg-neutral-900/10">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCampaignImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {uploading ? (
                  <div className="flex flex-col items-center py-2">
                    <div className="w-6 h-6 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-2" />
                    <span className="text-xs text-neutral-400 font-semibold">Görsel Yükleniyor...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud size={28} className="text-neutral-500 mb-2" />
                    <span className="text-xs text-neutral-300 font-bold">Resim Yüklemek İçin Tıklayın veya Sürükleyin</span>
                    <span className="text-[10px] text-neutral-500 font-medium mt-1 leading-normal block max-w-[280px] mx-auto">
                      Önerilen Görsel Boyutu: Yatay Banner (Afiş) - Maks: 2MB
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {uploadError && (
              <p className="mt-1.5 text-xs text-red-400 font-semibold flex items-center gap-1">
                <span>⚠</span> {uploadError}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-900/60 mt-6 justify-end">
            <button
              type="button"
              onClick={() => setIsCampaignModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              {currentCampaign ? 'Güncellemeleri Kaydet' : 'Kampanyayı Kaydet'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
