import React, { useState } from 'react';

interface FileItem {
  name: string;
  path: string;
  language: string;
  content: string;
}

const RN_FILES: FileItem[] = [
  {
    name: 'App.tsx (Main Navigation)',
    path: 'mobile/App.tsx',
    language: 'typescript',
    content: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StoreProvider } from './src/context/StoreContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { OrderTrackingScreen } from './src/screens/OrderTrackingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0C831F',
        tabBarInactiveTintColor: '#828282',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#ECEFF1', height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' }
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Delivery', tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚡</Text> }} />
      <Tab.Screen name="CategoriesTab" component={CategoryScreen} options={{ tabBarLabel: 'Categories', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🍱</Text> }} />
      <Tab.Screen name="OrdersTab" component={OrderTrackingScreen} options={{ tabBarLabel: 'Orders', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🧾</Text> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}`
  },
  {
    name: 'package.json (Expo / React Native)',
    path: 'mobile/package.json',
    language: 'json',
    content: `{
  "name": "blinkit-mobile-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/native-stack": "^6.9.26",
    "react-native-screens": "~3.31.1",
    "react-native-safe-area-context": "4.10.1",
    "lucide-react-native": "^0.378.0",
    "expo-linear-gradient": "~13.0.2",
    "@react-native-async-storage/async-storage": "1.23.1"
  }
}`
  },
  {
    name: 'HomeScreen.tsx (Storefront)',
    path: 'mobile/src/screens/HomeScreen.tsx',
    language: 'typescript',
    content: `// React Native Mobile Home Screen for Blinkit
// Features: Top 10-minute delivery header, search input,
// Category circular scrolls, and 2-column product cards.`
  },
  {
    name: 'ProductCard.tsx (Zero-Shift Stepper)',
    path: 'mobile/src/components/ProductCard.tsx',
    language: 'typescript',
    content: `// High-density React Native product card with instant ADD <-> [- qty +] stepper.`
  },
  {
    name: 'CartScreen.tsx (Cart & Bill Details)',
    path: 'mobile/src/screens/CartScreen.tsx',
    language: 'typescript',
    content: `// Full mobile cart view with free delivery threshold, tip selection, and item list.`
  },
  {
    name: 'OrderTrackingScreen.tsx (Live 10-Min Tracking)',
    path: 'mobile/src/screens/OrderTrackingScreen.tsx',
    language: 'typescript',
    content: `// Live ETA countdown timer, 4-step delivery status timeline, and delivery partner card.`
  }
];

export const ReactNativeExporterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeFile = RN_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[800px] bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700 z-10 flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[20px]">📱</span>
            <div>
              <h3 className="font-extrabold text-[16px] text-white">React Native App Codebase</h3>
              <p className="text-[11px] text-slate-400">Complete Expo &amp; React Native files for iOS &amp; Android</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Layout: Left file sidebar, Right code preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-56 bg-slate-950 p-2 border-r border-slate-800 overflow-y-auto space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 block tracking-wider">
              Project Files
            </span>
            {RN_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => {
                  setSelectedFileIdx(idx);
                  setCopied(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                  selectedFileIdx === idx
                    ? 'bg-[#0C831F] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="text-[13px]">📄</span>
                <span className="truncate">{file.name}</span>
              </button>
            ))}

            <div className="pt-4 px-2 text-[11px] text-slate-500 leading-tight border-t border-slate-800 mt-4">
              <span className="font-bold text-slate-400 block mb-1">To Run on Device:</span>
              1. Run <code className="text-[#F8CB46]">cd mobile</code><br />
              2. Run <code className="text-[#F8CB46]">npm install</code><br />
              3. Run <code className="text-[#F8CB46]">npx expo start</code>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            <div className="p-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-[12px]">
              <span className="font-mono text-slate-400">{activeFile.path}</span>
              <button
                onClick={handleCopy}
                className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied!' : 'Copy File Content'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 font-mono text-[12px] text-emerald-400 overflow-auto bg-slate-950/80 leading-relaxed">
              {activeFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
