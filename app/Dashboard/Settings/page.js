"use client";
import React, { useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Bell, Shield, Globe, Palette, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Notification Settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    orderUpdates: true,
    promotions: false,
    newsletter: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  // Theme Settings
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30"
  });

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
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', { notifications, privacy, theme, language, security });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

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

      {/* Save Button */}
      <div className="flex justify-end">
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
  );
}