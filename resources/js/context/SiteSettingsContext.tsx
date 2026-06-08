import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPut } from '../lib/api';
import { defaultSiteSettings, SiteSettings } from '../types/siteSettings';

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  saveSettings: (payload: SiteSettings | FormData) => Promise<SiteSettings>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await apiGet<Partial<SiteSettings>>('/settings');
      setSettings({ ...defaultSiteSettings, ...data });
    } catch (error) {
      console.error('Failed to fetch site settings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const saveSettings = async (payload: SiteSettings | FormData) => {
    const isFormData = payload instanceof FormData;
    const response = await apiPut<{ success: boolean; settings: SiteSettings }>(
      '/admin/settings',
      payload,
      isFormData
    );
    setSettings({ ...defaultSiteSettings, ...response.settings });
    return response.settings;
  };

  const value = useMemo(
    () => ({
      settings,
      loading,
      refreshSettings,
      saveSettings,
    }),
    [settings, loading]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = (): SiteSettingsContextValue => {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }

  return context;
};
