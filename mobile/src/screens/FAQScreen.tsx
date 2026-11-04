import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react-native';
import { FAQ_ITEMS } from '../data/mockData';

export const FAQScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const [expandedId, setExpandedId] = useState<string | null>('f1');
  const [search, setSearch] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#1C1C1C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Search size={16} color="#0C831F" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions (e.g. refund, delivery)..."
            placeholderTextColor="#828282"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* FAQs Accordion */}
        {filteredFaqs.map((faq) => {
          const isOpen = expandedId === faq.id;

          return (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpandedId(isOpen ? null : faq.id)}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.categoryBadge}>{faq.category}</Text>
                  <Text style={styles.questionText}>{faq.question}</Text>
                </View>
                {isOpen ? (
                  <ChevronUp size={18} color="#4B5563" />
                ) : (
                  <ChevronDown size={18} color="#4B5563" />
                )}
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.faqBody}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Need more help? */}
        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>Have a question not listed here?</Text>
          <Text style={styles.helpSub}>Our 24x7 Customer Support team is always ready to assist you.</Text>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => navigation.navigate('Support')}
          >
            <MessageCircle size={15} color="#0C831F" style={{ marginRight: 6 }} />
            <Text style={styles.chatBtnText}>Chat with Support</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center'
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  backText: { fontSize: 22, fontWeight: '800', color: '#1C1C1C' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  content: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1C1C1C' },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    overflow: 'hidden'
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 48
  },
  categoryBadge: { fontSize: 10, fontWeight: '800', color: '#0C831F', marginBottom: 4, textTransform: 'uppercase' },
  questionText: { fontSize: 13, fontWeight: '800', color: '#1C1C1C', lineHeight: 18 },
  toggleIcon: { fontSize: 12, color: '#828282' },
  faqBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F4F6FB',
    paddingTop: 12
  },
  answerText: { fontSize: 12, color: '#666666', lineHeight: 18 },
  helpBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    alignItems: 'center'
  },
  helpTitle: { fontSize: 14, fontWeight: '800', color: '#1C1C1C', marginBottom: 4 },
  helpSub: { fontSize: 11, color: '#828282', textAlign: 'center', marginBottom: 14 },
  chatBtn: {
    backgroundColor: '#0C831F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 }
});
