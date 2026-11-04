import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { StoreProvider } from './src/context/StoreContext';
import { RootNavigator } from './src/navigation';
import { GlobalModalManager } from './src/components/GlobalModalManager';

export default function App() {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
          <GlobalModalManager />
        </NavigationContainer>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
