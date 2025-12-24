import { API_BASE_URL } from '../lib/constants';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {};
  // Only set JSON content-type if body is not FormData
  const isFormData = options && options.body && typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const defaultOptions = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    // Check if API_BASE_URL is configured
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in Vercel environment variables.');
    }
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Check if response is HTML (usually means 404 or wrong URL)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error(`API endpoint returned HTML instead of JSON. Check that VITE_API_BASE_URL is set correctly. Current URL: ${url}`);
    }
    
    if (!response.ok) {
      // Try to parse error message if possible
      let message = `API call failed: ${response.status} ${response.statusText}`;
      try { 
        const data = await response.json(); 
        if (data && (data.error || data.message)) { 
          message = data.error || data.message; 
        } 
      } catch (_) {
        // If response is HTML, provide helpful error
        if (contentType && contentType.includes('text/html')) {
          message = `API endpoint not found or VITE_API_BASE_URL is incorrect. Check Vercel environment variables.`;
        }
      }
      throw new Error(message);
    }
    // Some upload endpoints may return JSON; assume JSON here
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    console.error('API URL attempted:', url);
    console.error('API_BASE_URL:', API_BASE_URL);
    throw error;
  }
};

// Vendor APIs - Updated for Django Ninja
export const vendorAPI = {
  // Get all vendors
  getVendors: () => apiCall('/vendor/vendors'),
  
  // Get single vendor
  getVendor: (vendorId) => apiCall(`/vendor/vendors/${vendorId}`),
  
  // Create vendor
  createVendor: (vendorData) => apiCall('/vendor/vendors', {
    method: 'POST',
    body: JSON.stringify(vendorData),
  }),
  
  // Update vendor
  updateVendor: (vendorId, vendorData) => apiCall(`/vendor/vendors/${vendorId}`, {
    method: 'PUT',
    body: JSON.stringify(vendorData),
  }),
  
  // Delete vendor
  deleteVendor: (vendorId) => apiCall(`/vendor/vendors/${vendorId}`, {
    method: 'DELETE',
  }),
  
  // Get vendor prices
  getVendorPrices: (vendorId) => apiCall(`/vendor/vendor-prices/${vendorId}`),
};

// Marketplace APIs - Updated for Django Ninja
export const marketplaceAPI = {
  // Get all marketplaces
  getMarketplaces: () => apiCall('/marketplace/marketplaces'),
  
  // Get vendors (for backward compatibility - delegates to vendorAPI)
  getVendors: () => apiCall('/vendor/vendors'),
  
  // Create marketplace
  createMarketplace: (marketplaceData) => apiCall('/marketplace/marketplaces', {
    method: 'POST',
    body: JSON.stringify(marketplaceData),
  }),
  
  // Get all stores (summary)
  getStores: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.marketplace_id) queryParams.append('marketplace_id', params.marketplace_id);
    if (params.active_only !== undefined) queryParams.append('active_only', params.active_only);
    
    const queryString = queryParams.toString();
    return apiCall(`/marketplace/stores${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get single store (full vendor settings)
  getStore: (storeId) => apiCall(`/marketplace/stores/${storeId}`),
  
  // Create store
  createStore: (storeData) => apiCall('/marketplace/stores', {
    method: 'POST',
    body: JSON.stringify(storeData),
  }),
  
  // Update store
  updateStore: (storeId, storeData) => apiCall(`/marketplace/stores/${storeId}`, {
    method: 'PUT',
    body: JSON.stringify(storeData),
  }),
  
  // Delete store
  deleteStore: (storeId) => apiCall(`/marketplace/stores/${storeId}`, {
    method: 'DELETE',
  }),
  
  // Get store price settings
  getStorePriceSettings: (storeId) => apiCall(`/marketplace/stores/${storeId}/price-settings`),
  
  // Create price settings
  createPriceSettings: (storeId, settingsData) => apiCall(`/marketplace/stores/${storeId}/price-settings`, {
    method: 'POST',
    body: JSON.stringify(settingsData),
  }),
};

// Products APIs - Updated for Django Ninja
export const productsAPI = {
  // List products with filters
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.store_id) queryParams.append('store_id', params.store_id);
    if (params.vendor_id) queryParams.append('vendor_id', params.vendor_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const queryString = queryParams.toString();
    return apiCall(`/products/${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get single product
  getProduct: (productId) => apiCall(`/products/${productId}`),
  
  // Create product
  createProduct: (productData) => apiCall('/products/', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  // Delete product
  deleteProduct: (productId) => apiCall(`/products/${productId}`, {
    method: 'DELETE',
  }),
  
  // Upload products from CSV
  uploadProducts: async (file, vendorId, storeId) => {
    const form = new FormData();
    form.append('file', file);
    form.append('vendor_id', vendorId);
    form.append('store_id', storeId);
    return apiCall('/products/upload', {
      method: 'POST',
      body: form,
    });
  },
  
  // Start scraping job
  startScrape: (storeId, vendorId = null) => {
    const data = { store_id: storeId };
    if (vendorId) data.vendor_id = vendorId;
    return apiCall('/products/scrape', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Get scrape status
  getScrapeStatus: (scrapeId) => apiCall(`/products/scrapes/${scrapeId}`),
};

// Export APIs - Updated for Django Ninja
export const exportAPI = {
  // Generate export
  generateExport: (storeId, vendorId = null, exportType = 'full') => {
    const data = { store_id: storeId, export_type: exportType };
    if (vendorId) data.vendor_id = vendorId;
    return apiCall('/export/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // List exports
  listExports: (storeId = null, limit = 20) => {
    const queryParams = new URLSearchParams();
    if (storeId) queryParams.append('store_id', storeId);
    queryParams.append('limit', limit);
    return apiCall(`/export/exports?${queryParams.toString()}`);
  },
  
  // Get export details
  getExport: (exportId) => apiCall(`/export/exports/${exportId}`),
  
  // Download export
  downloadExport: (exportId) => `${API_BASE_URL}/export/exports/${exportId}/download`,
};

// Dashboard APIs - Updated for Django Ninja
export const dashboardAPI = {
  getSummary: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiCall(`/dashboard/summary${q ? `?${q}` : ''}`);
  },
  // Get vendors for dashboard (for backward compatibility)
  getVendors: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiCall(`/vendor/vendors${q ? `?${q}` : ''}`);
  },
  // Get stores for dashboard (for backward compatibility)
  getStores: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiCall(`/marketplace/stores${q ? `?${q}` : ''}`);
  },
};

// Helper function to transform frontend data to API format (vendor arrays)
export const transformStoreDataForAPI = (storeInfo, priceSettingsByVendor, inventorySettingsByVendor, mydealSettingsState) => {
  const payload = {
    name: storeInfo.storeName,
    marketplace_id: parseInt(storeInfo.marketplace),
    api_key_enc: storeInfo.apiKey || "",
    price_settings_by_vendor: (priceSettingsByVendor || []).map(v => ({
      vendor_id: v.vendorId,
      purchase_tax_percentage: parseFloat(v.purchaseTax) || 0,
      marketplace_fees_percentage: parseFloat(v.marketplaceFees) || 0,
      price_ranges: (v.priceRanges || []).map(range => ({
        from_value: parseFloat(range.from) || 0,
        to_value: range.to || "MAX",
        margin_percentage: parseFloat(range.margin) || 0,
        minimum_margin_cents: ((parseInt(range.minimumMargin) || 0) * 100),
        dont_pay_discount_percentage: (range.dontPayDiscountPercentage !== undefined && range.dontPayDiscountPercentage !== null)
          ? parseFloat(range.dontPayDiscountPercentage)
          : 10,
      }))
    })),
    inventory_settings_by_vendor: (inventorySettingsByVendor || []).map(v => ({
      vendor_id: v.vendorId,
      inventory_ranges: (v.priceRanges || []).map(range => ({
        from_value: parseFloat(range.from) || 0,
        to_value: range.to || "MAX",
        multiplier: parseFloat(range.multipliedWith) || 0
      }))
    }))
  };

  // Attach MyDeal settings if marketplace is MyDeal
  const mpName = String(storeInfo.marketplaceName || '').toLowerCase();
  const mpCode = String(storeInfo.marketplaceCode || '').toLowerCase();
  if (mpName === 'mydeal' || mpCode === 'mydeal' || mydealSettingsState) {
    payload.settings = payload.settings || {};
    payload.settings.mydeal = {
      price_template_upload_id: mydealSettingsState?.priceTemplateUploadId || null,
      inventory_template_upload_id: mydealSettingsState?.inventoryTemplateUploadId || null,
    };
  }

  return payload;
};

// Helper function to transform API data to frontend format (vendor arrays)
export const transformStoreDataForFrontend = (apiStoreData) => {
  return {
    id: apiStoreData.id,
    name: apiStoreData.name,
    marketplace: apiStoreData.marketplace?.name || apiStoreData.marketplace_name,
    marketplace_id: apiStoreData.marketplace?.id || apiStoreData.marketplace_id,
    is_active: apiStoreData.is_active,
    created_at: apiStoreData.created_at,
    storeInfo: {
      storeName: apiStoreData.name,
      marketplace: (apiStoreData.marketplace?.id || apiStoreData.marketplace_id).toString(),
      apiKey: apiStoreData.api_key_enc,
      marketplaceName: apiStoreData.marketplace?.name || apiStoreData.marketplace_name,
      marketplaceCode: apiStoreData.marketplace?.code || apiStoreData.marketplace_code,
    },
    priceSettingsByVendor: (apiStoreData.price_settings || []).map(s => ({
      vendorId: s.vendor__id || s.vendor_id,
      purchaseTax: s.purchase_tax_percentage?.toString() || '0',
      marketplaceFees: s.marketplace_fee_percentage?.toString() || '0',
      priceRanges: (s.price_ranges || []).map(range => ({
        from: range.from_value?.toString() || '0',
        to: range.to_value || "MAX",
        margin: range.margin_percentage?.toString() || '0',
        minimumMargin: ((range.minimum_margin_cents || 0) / 100).toString(),
        dontPayDiscountPercentage: (range.dont_pay_discount_percentage ?? 10).toString(),
      }))
    })),
    inventorySettingsByVendor: (apiStoreData.inventory_settings || []).map(s => ({
      vendorId: s.vendor__id || s.vendor_id,
      priceRanges: (s.inventory_ranges || []).map(range => ({
        from: range.from_value?.toString() || '0',
        to: range.to_value || "MAX",
        multipliedWith: range.multiplier?.toString() || '0'
      }))
    })),
    settings: apiStoreData.settings || {},
    mydealSettings: (apiStoreData.settings && apiStoreData.settings.mydeal) ? {
      priceTemplateUploadId: apiStoreData.settings.mydeal.price_template_upload_id || null,
      inventoryTemplateUploadId: apiStoreData.settings.mydeal.inventory_template_upload_id || null,
    } : null,
  };
};

