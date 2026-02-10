"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Save, Bell, Shield, Palette, Smartphone, RefreshCw, ExternalLink } from "lucide-react";
import { sidebarSections } from "../Sidebar";

const SETTINGS_STORAGE_KEY = "dashboard_settings_v1";
const SIDEBAR_VISIBILITY_KEY = "sidebar_visibility_v1";

const DEFAULT_SETTINGS = {
  notifications: {
    email: true,
    push: false,
    sms: false,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  },
  theme: "light",
  language: "en",
  security: {
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30",
  },
};

const DEFAULT_SIDEBAR_VISIBILITY = {
  hiddenSections: { section1: false, section2: false },
  hiddenItems: [],
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [initialised, setInitialised] = useState(false);
  
  const [notifications, setNotifications] = useState(DEFAULT_SETTINGS.notifications);
  const [privacy, setPrivacy] = useState(DEFAULT_SETTINGS.privacy);
  const [theme, setTheme] = useState(DEFAULT_SETTINGS.theme);
  const [language, setLanguage] = useState(DEFAULT_SETTINGS.language);
  const [security, setSecurity] = useState(DEFAULT_SETTINGS.security);
  const [sidebarVisibility, setSidebarVisibility] = useState(DEFAULT_SIDEBAR_VISIBILITY);
  const [showSidebarVisibility, setShowSidebarVisibility] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.notifications || DEFAULT_SETTINGS.notifications);
        setPrivacy(parsed.privacy || DEFAULT_SETTINGS.privacy);
        setTheme(parsed.theme || DEFAULT_SETTINGS.theme);
        setLanguage(parsed.language || DEFAULT_SETTINGS.language);
        setSecurity(parsed.security || DEFAULT_SETTINGS.security);
        if (parsed.sidebarVisibility) {
          setSidebarVisibility({
            hiddenSections: parsed.sidebarVisibility.hiddenSections || DEFAULT_SIDEBAR_VISIBILITY.hiddenSections,
            hiddenItems: parsed.sidebarVisibility.hiddenItems || DEFAULT_SIDEBAR_VISIBILITY.hiddenItems,
          });
        }
        if (parsed.lastSaved) {
          setLastSaved(new Date(parsed.lastSaved));
        }
      }
      const storedSidebar = localStorage.getItem(SIDEBAR_VISIBILITY_KEY);
      if (storedSidebar) {
        const parsedSidebar = JSON.parse(storedSidebar);
        setSidebarVisibility({
          hiddenSections: parsedSidebar.hiddenSections || DEFAULT_SIDEBAR_VISIBILITY.hiddenSections,
          hiddenItems: parsedSidebar.hiddenItems || DEFAULT_SIDEBAR_VISIBILITY.hiddenItems,
        });
      }
    } catch (err) {
    } finally {
      setInitialised(true);
    }
  }, []);

  // Apply theme preference to document (light/dark/auto)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;
    const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (mode) => {
      const prefersDark = media?.matches;
      const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
      root.dataset.dashboardTheme = resolved;
      root.setAttribute("data-theme", resolved);
      body?.setAttribute("data-theme", resolved);
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      try {
        localStorage.setItem("theme", mode);
        window.dispatchEvent(new Event("theme-changed"));
      } catch (_) {
        /* ignore */
      }
    };

    applyTheme(theme);

    const handleChange = () => {
      if (theme === "auto") {
        applyTheme("auto");
      }
    };

    media?.addEventListener?.("change", handleChange);
    return () => media?.removeEventListener?.("change", handleChange);
  }, [theme]);

  // Apply language to document
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language || "en";
  }, [language]);

  const toValue = (input) =>
    typeof input === "object" && input !== null && "target" in input
      ? input.target.value
      : input;

  const handleNotificationChange = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({ ...prev, [key]: toValue(value) }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity((prev) => ({ ...prev, [key]: toValue(value) }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveStatus(null);
    try {
      const payload = {
        notifications,
        privacy,
        theme,
        language,
        security,
        sidebarVisibility,
        lastSaved: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
        localStorage.setItem(SIDEBAR_VISIBILITY_KEY, JSON.stringify(sidebarVisibility));
        window.dispatchEvent(new Event('sidebar-visibility-updated'));
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLastSaved(new Date(payload.lastSaved));
      setSaveStatus("success");
    } catch (error) {
      setSaveStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleResetSettings = () => {
    setNotifications(DEFAULT_SETTINGS.notifications);
    setPrivacy(DEFAULT_SETTINGS.privacy);
    setTheme(DEFAULT_SETTINGS.theme);
    setLanguage(DEFAULT_SETTINGS.language);
    setSecurity(DEFAULT_SETTINGS.security);
    setSidebarVisibility(DEFAULT_SIDEBAR_VISIBILITY);
    if (typeof window !== "undefined") {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      localStorage.removeItem(SIDEBAR_VISIBILITY_KEY);
    }
    setSaveStatus("reset");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleQuickNavigate = (path) => {
    router.push(path);
  };

  const saveMessage = useMemo(() => {
    if (saveStatus === "success") return "Settings saved locally.";
    if (saveStatus === "error") return "Failed to save settings.";
    if (saveStatus === "reset") return "Settings reset to defaults.";
    return null;
  }, [saveStatus]);

  const section1Items = useMemo(
    () => sidebarSections.filter((s) => s.section === "section1"),
    []
  );
  const section2Items = useMemo(
    () => sidebarSections.filter((s) => s.section === "section2"),
    []
  );

  const toggleSectionVisibility = (sectionKey) => {
    setSidebarVisibility((prev) => ({
      ...prev,
      hiddenSections: {
        ...prev.hiddenSections,
        [sectionKey]: !prev.hiddenSections?.[sectionKey],
      },
    }));
  };

  const toggleItemVisibility = (name) => {
    setSidebarVisibility((prev) => {
      const hidden = prev.hiddenItems || [];
      const exists = hidden.includes(name);
      return {
        ...prev,
        hiddenItems: exists ? hidden.filter((n) => n !== name) : [...hidden, name],
      };
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {!initialised && (
        <div className="p-4 bg-gray-50 border rounded text-sm text-gray-600">
          Loading your saved preferences...
        </div>
      )}

      {/* Quick account actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleQuickNavigate('/Profile')}
          >
            <ExternalLink className="w-4 h-4" />
            Manage Profile & Avatar
          </Button>
          {isAdmin() && (
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => handleQuickNavigate('/SellerList')}
            >
              <ExternalLink className="w-4 h-4" />
              Seller Access Control
            </Button>
          )}
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleQuickNavigate('/SimpleBillManagement')}
          >
            <ExternalLink className="w-4 h-4" />
            Billing Preferences
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleQuickNavigate('/ProductAdd/Adhesives')}
          >
            <ExternalLink className="w-4 h-4" />
            Product Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Sidebar Visibility (hidden behind subtle toggle) */}
      {showSidebarVisibility && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Sidebar Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">User Management (Section 1)</p>
                  <Switch
                    checked={!sidebarVisibility.hiddenSections?.section1}
                    onCheckedChange={() => toggleSectionVisibility("section1")}
                  />
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {section1Items.map((item) => (
                    <label key={item.name} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={!sidebarVisibility.hiddenItems?.includes(item.name)}
                        onChange={() => toggleItemVisibility(item.name)}
                        disabled={sidebarVisibility.hiddenSections?.section1}
                      />
                      <span className="text-gray-700">{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">Other (Section 2)</p>
                  <Switch
                    checked={!sidebarVisibility.hiddenSections?.section2}
                    onCheckedChange={() => toggleSectionVisibility("section2")}
                  />
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {section2Items.map((item) => (
                    <label key={item.name} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={!sidebarVisibility.hiddenItems?.includes(item.name)}
                        onChange={() => toggleItemVisibility(item.name)}
                        disabled={sidebarVisibility.hiddenSections?.section2}
                      />
                      <span className="text-gray-700">{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Hide entire section or individual items. Changes apply after Save.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader className="flex flex-col gap-0 items-start">
          <div className="flex items-center gap-2 text-left">
            <Bell className="w-5 h-5" />
            <CardTitle className="flex items-center gap-2">
              Notification Settings
            </CardTitle>
          </div>
          <button
            type="button"
            onClick={() => setShowSidebarVisibility((prev) => !prev)}
            className="pl-7 text-[11px] text-gray-400 transition -mt-0.5"
          >
            system preferences
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(value) => handleNotificationChange('email', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(value) => handleNotificationChange('push', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-gray-500">Receive SMS notifications</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(value) => handleNotificationChange('sms', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Order Updates</Label>
                <p className="text-sm text-gray-500">Get notified about order status</p>
              </div>
              <Switch
                checked={notifications.orderUpdates}
                onCheckedChange={(value) => handleNotificationChange('orderUpdates', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Promotional Offers</Label>
                <p className="text-sm text-gray-500">Receive promotional notifications</p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(value) => handleNotificationChange('promotions', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Newsletter</Label>
                <p className="text-sm text-gray-500">Subscribe to newsletter</p>
              </div>
              <Switch
                checked={notifications.newsletter}
                onCheckedChange={(value) => handleNotificationChange('newsletter', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Profile Visibility</Label>
              <Select
                value={privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Email Address</Label>
                <p className="text-sm text-gray-500">Display email to other users</p>
              </div>
              <Switch
                checked={privacy.showEmail}
                onCheckedChange={(value) => handlePrivacyChange('showEmail', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Phone Number</Label>
                <p className="text-sm text-gray-500">Display phone to other users</p>
              </div>
              <Switch
                checked={privacy.showPhone}
                onCheckedChange={(value) => handlePrivacyChange('showPhone', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Messages</Label>
                <p className="text-sm text-gray-500">Allow other users to message you</p>
              </div>
              <Switch
                checked={privacy.allowMessages}
                onCheckedChange={(value) => handlePrivacyChange('allowMessages', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance & Language
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Theme</Label>
              <Select
                value={theme}
                onChange={(e) => setTheme(toValue(e))}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </Select>
            </div>
            <div>
              <Label>Language</Label>
              <Select
                value={language}
                onChange={(e) => setLanguage(toValue(e))}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add extra security to your account</p>
              </div>
              <Switch
                checked={security.twoFactorAuth}
                onCheckedChange={(value) => handleSecurityChange('twoFactorAuth', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Login Notifications</Label>
                <p className="text-sm text-gray-500">Get notified of new logins</p>
              </div>
              <Switch
                checked={security.loginNotifications}
                onCheckedChange={(value) => handleSecurityChange('loginNotifications', value)}
              />
            </div>
            <div>
              <Label>Session Timeout (minutes)</Label>
              <Select
                value={security.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', e)}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save / Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          {lastSaved ? (
            <p>Last saved: {lastSaved.toLocaleString()}</p>
          ) : (
            <p>Settings stored locally on this device.</p>
          )}
          {saveMessage && (
            <p className={`mt-1 ${saveStatus === "error" ? "text-red-600" : "text-green-600"}`}>
              {saveMessage}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetSettings}
            disabled={loading}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading} className="w-full bg-linner-to-r from-amber-500 to-orange-500 text-white sm:w-auto">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}