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

const SETTINGS_STORAGE_KEY = "dashboard_settings_v1";

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

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [initialised, setInitialised] = useState(false);
  
  const [notifications, setNotifications] = useState(DEFAULT_SETTINGS.notifications);
  const [privacy, setPrivacy] = useState(DEFAULT_SETTINGS.privacy);
  const [theme, setTheme] = useState(DEFAULT_SETTINGS.theme);
  const [language, setLanguage] = useState(DEFAULT_SETTINGS.language);
  const [security, setSecurity] = useState(DEFAULT_SETTINGS.security);

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
        if (parsed.lastSaved) {
          setLastSaved(new Date(parsed.lastSaved));
        }
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setInitialised(true);
    }
  }, []);

  // Apply theme preference to document
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.dashboardTheme = theme;
  }, [theme]);

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
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
        lastSaved: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLastSaved(new Date(payload.lastSaved));
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving settings:", error);
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
    if (typeof window !== "undefined") {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
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
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => handleQuickNavigate('/SellerList')}
          >
            <ExternalLink className="w-4 h-4" />
            Seller Access Control
          </Button>
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

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
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
              <Select value={privacy.profileVisibility} onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}>
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
              <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </Select>
            </div>
            <div>
              <Label>Language</Label>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
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
              <Select value={security.sessionTimeout} onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}>
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetSettings}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
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