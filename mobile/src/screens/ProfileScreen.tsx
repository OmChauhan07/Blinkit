import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ReceiptText,
  MapPin,
  Heart,
  Ticket,
  MessageCircle,
  HelpCircle,
  Info,
  User,
  ChevronRight,
  LogOut,
  ArrowRight
} from 'lucide-react-native';
import { useStore } from '../context/StoreContext';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, orders, addresses, coupons, wishlistIds, logout, setIsLoginModalOpen } = useStore();

  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out of your Blinkit account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => logout()
      }
    ]);
  };

  const menuSections = [
    {
      title: 'MY ACCOUNT',
      items: [
        { id: 'orders', Icon: ReceiptText, label: 'My Orders', badge: `${orders.length}`, screen: 'OrdersHistory' },
        { id: 'addresses', Icon: MapPin, label: 'Saved Addresses', badge: `${addresses.length}`, screen: 'SavedAddresses' },
        { id: 'wishlist', Icon: Heart, label: 'Wishlist & Saved', badge: `${wishlistIds.length}`, screen: 'Wishlist' },
        { id: 'offers', Icon: Ticket, label: 'Offers & Coupons', badge: `${coupons.length}`, screen: 'OffersCoupons' }
      ]
    },
    {
      title: 'HELP & INFORMATION',
      items: [
        { id: 'support', Icon: MessageCircle, label: '24x7 Customer Support', badge: 'Live', screen: 'Support' },
        { id: 'faq', Icon: HelpCircle, label: 'Frequently Asked Questions', screen: 'FAQ' },
        { id: 'about', Icon: Info, label: 'About Blinkit (10-Min Delivery)', screen: 'AboutUs' }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>My Account</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!user.isLoggedIn ? (
          <View style={styles.loggedOutCard}>
            <View style={styles.loggedOutIconBox}>
              <User size={32} color="#4B5563" />
            </View>
            <Text style={styles.loggedOutTitle}>You are not logged in</Text>
            <Text style={styles.loggedOutSub}>
              Log in with your mobile number to view saved addresses, orders, and wishlist items.
            </Text>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => setIsLoginModalOpen(true)}
            >
              <Text style={styles.loginBtnText}>Login with Phone</Text>
              <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* User Profile Card */}
            <View style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name ? user.name[0] : 'U'}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userPhone}>+91 {user.phone}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>

            {/* Quick Stats Grid */}
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statBox}
                onPress={() => navigation.navigate('OrdersHistory')}
              >
                <Text style={styles.statVal}>{orders.length}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                onPress={() => navigation.navigate('SavedAddresses')}
              >
                <Text style={styles.statVal}>{addresses.length}</Text>
                <Text style={styles.statLabel}>Addresses</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                onPress={() => navigation.navigate('OffersCoupons')}
              >
                <Text style={styles.statVal}>{coupons.length}</Text>
                <Text style={styles.statLabel}>Coupons</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                onPress={() => navigation.navigate('Wishlist')}
              >
                <Text style={styles.statVal}>{wishlistIds.length}</Text>
                <Text style={styles.statLabel}>Wishlist</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIdx) => {
                const ItemIcon = item.Icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      itemIdx !== section.items.length - 1 && styles.menuItemBorder
                    ]}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={styles.iconWrapper}>
                      <ItemIcon size={18} color="#0C831F" />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>

                    {item.badge && (
                      <View style={styles.badgePill}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}

                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        {user.isLoggedIn && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={16} color="#E23744" style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        )}

        {/* Version Footnote */}
        <Text style={styles.versionFootnote}>Blinkit Mobile • v1.0.0 (Production Build)</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1'
  },
  headerInner: {
    padding: 16,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center'
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  loggedOutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  loggedOutIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  loggedOutIcon: { fontSize: 28 },
  loggedOutTitle: { fontSize: 17, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  loggedOutSub: { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  loginBtn: {
    backgroundColor: '#0C831F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  loginBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F8CB46',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1C1C1C'
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  userPhone: { fontSize: 13, color: '#555555', marginTop: 2 },
  userEmail: { fontSize: 11, color: '#828282', marginTop: 1 },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  statVal: { fontSize: 18, fontWeight: '900', color: '#0C831F' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#666666', marginTop: 2 },
  sectionContainer: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#828282',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    overflow: 'hidden'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FB'
  },
  iconWrapper: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1C1C1C' },
  badgePill: {
    backgroundColor: '#F4F6FB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#0C831F' },
  chevron: { fontSize: 18, color: '#828282', fontWeight: '600' },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20
  },
  logoutBtnText: { color: '#E23744', fontSize: 14, fontWeight: '800' },
  versionFootnote: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 30
  }
});
