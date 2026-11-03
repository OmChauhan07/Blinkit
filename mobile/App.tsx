import React from 'react';
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

// Placeholder screens for tab items
const CategoriesTab = ({ navigation }: any) => <CategoryScreen route={{ params: { slug: 'dairy-bread-eggs' } }} navigation={navigation} />;

const PrintTab = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.iconBig}>🖨️</Text>
    <Text style={styles.tabTitle}>Blinkit Print Delivery</Text>
    <Text style={styles.tabSubtitle}>Upload documents & get color or B/W prints in 10 minutes</Text>
  </View>
);

const OrdersTab = ({ navigation }: any) => <OrderTrackingScreen route={{ params: { orderId: 'ord-101' } }} navigation={navigation} />;

const ProfileTab = ({ navigation }: any) => (
  <View style={styles.centerContainer}>
    <Text style={styles.iconBig}>👤</Text>
    <Text style={styles.tabTitle}>Omkar Chauhan</Text>
    <Text style={styles.tabSubtitle}>+91 98765 43210 • odchauhan0702@gmail.com</Text>
  </View>
);

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0C831F',
        tabBarInactiveTintColor: '#828282',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#ECEFF1',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700'
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Delivery',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⚡</Text>
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesTab}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🍱</Text>
        }}
      />
      <Tab.Screen
        name="PrintTab"
        component={PrintTab}
        options={{
          tabBarLabel: 'Print',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🖨️</Text>
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersTab}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🧾</Text>
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>
        }}
      />
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
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  iconBig: {
    fontSize: 48,
    marginBottom: 12
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 4
  },
  tabSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center'
  }
});
