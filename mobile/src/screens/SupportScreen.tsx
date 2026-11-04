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
import { ArrowLeft, Send, Zap } from 'lucide-react-native';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const androidBar = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0;
  const headerTopPadding = Math.max(insets.top, androidBar) + 8;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hello Omkar! Welcome to Blinkit 24x7 Support. How can we assist you with your 10-minute grocery delivery today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'Where is my delivery?',
    'Report missing or damaged item',
    'Refund status for order #BLK-98214',
    'How do I cancel my order?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulated instant smart bot reply
    setTimeout(() => {
      let reply = 'Thank you for reaching out! Our dark store supervisor is reviewing this right now.';
      const lower = text.toLowerCase();

      if (lower.includes('where') || lower.includes('delivery') || lower.includes('track')) {
        reply = 'Your active order #BLK-98214 is currently out for delivery on an electric vehicle. Estimated arrival is in 7-8 minutes!';
      } else if (lower.includes('missing') || lower.includes('damaged') || lower.includes('item')) {
        reply = 'We are truly sorry! An instant refund of ₹54 has been processed to your source payment method for the reported item.';
      } else if (lower.includes('refund')) {
        reply = 'Refund for ₹50 was successfully credited back to your Google Pay UPI account. Reference: TXN-892173.';
      } else if (lower.includes('cancel')) {
        reply = 'You can cancel any placed order directly within 1 minute from the "My Orders" screen before the dark store begins packaging.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

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
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>24x7 Customer Support</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 }}>
              <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#0C831F' }} />
              <Text style={styles.headerSub}>Online • Instant Response</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        contentContainerStyle={styles.chatArea}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => {
          const isBot = m.sender === 'bot';

          return (
            <View
              key={m.id}
              style={[styles.msgRow, isBot ? styles.msgRowBot : styles.msgRowUser]}
            >
              {isBot && (
                <View style={styles.botAvatar}>
                  <Zap size={14} color="#0C831F" fill="#0C831F" />
                </View>
              )}
              <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
                <Text style={[styles.bubbleText, isBot ? styles.bubbleTextBot : styles.bubbleTextUser]}>
                  {m.text}
                </Text>
                <Text style={[styles.timeText, isBot ? styles.timeTextBot : styles.timeTextUser]}>
                  {m.time}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Quick Suggestion Chips */}
        <View style={styles.quickPromptsContainer}>
          <Text style={styles.quickPromptsTitle}>Frequently Asked Questions:</Text>
          {quickPrompts.map((q, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptChip}
              onPress={() => handleSend(q)}
            >
              <Text style={styles.promptChipText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Input Bar */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.inputBarInner}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message or describe your issue..."
            placeholderTextColor="#828282"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => handleSend()}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessible={true}
            accessibilityLabel="Send message"
          >
            <Send size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
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
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1C1C1C' },
  headerSub: { fontSize: 11, color: '#0C831F', fontWeight: '700', marginTop: 1 },
  chatArea: { padding: 16, maxWidth: 700, width: '100%', alignSelf: 'center' },
  msgRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  msgRowBot: { justifyContent: 'flex-start' },
  msgRowUser: { justifyContent: 'flex-end' },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0C831F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2
  },
  botAvatarText: { fontSize: 14 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  bubbleBot: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  bubbleUser: {
    backgroundColor: '#0C831F',
    borderBottomRightRadius: 4
  },
  bubbleText: { fontSize: 13, lineHeight: 18 },
  bubbleTextBot: { color: '#1C1C1C' },
  bubbleTextUser: { color: '#FFFFFF', fontWeight: '500' },
  timeText: { fontSize: 9, marginTop: 4, textAlign: 'right' },
  timeTextBot: { color: '#9E9E9E' },
  timeTextUser: { color: 'rgba(255,255,255,0.7)' },
  quickPromptsContainer: { marginTop: 20, marginBottom: 10 },
  quickPromptsTitle: { fontSize: 11, fontWeight: '800', color: '#828282', marginBottom: 10 },
  promptChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    minHeight: 44,
    justifyContent: 'center'
  },
  promptChipText: { fontSize: 13, fontWeight: '600', color: '#1C1C1C' },
  inputBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1'
  },
  inputBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
    gap: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1C1C1C',
    minHeight: 44
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0C831F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' }
});
