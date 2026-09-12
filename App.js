import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // مفتاح Google Gemini API
  const API_KEY = "ضع_مفتاح_API_الخاص_بك_هنا"; 

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: inputText }] }]
        })
      });
      
      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم أتمكن من الحصول على رد.';
      
      const botMsg = { id: (Date.now() + 1).toString(), text: botReply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { id: (Date.now() + 1).toString(), text: 'حدث خطأ في الاتصال، حاول مجدداً.', sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FARAH CHAT 🇸🇩</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        style={styles.chatArea}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب رسالتك هنا..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 16, backgroundColor: '#D80027', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#007A3D' },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  chatArea: { flex: 1, padding: 10 },
  messageBubble: { padding: 12, borderRadius: 12, marginVertical: 4, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007A3D' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#222222', borderWidth: 1, borderColor: '#444444' },
  messageText: { color: '#FFFFFF', fontSize: 15 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#000000' },
  input: { flex: 1, backgroundColor: '#1E1E1E', color: '#FFFFFF', borderRadius: 8, paddingHorizontal: 12, height: 45 },
  sendButton: { backgroundColor: '#D80027', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginLeft: 8, borderRadius: 8 },
  sendButtonText: { color: '#FFFFFF', fontWeight: 'bold' }
});
