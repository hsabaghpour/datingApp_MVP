// app/home.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Button, TouchableOpacity } from 'react-native';
import { auth } from '../src/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter, Link } from 'expo-router';

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setEmail(u?.email ?? null);
      if (!u) router.replace('/login');
    });
    return unsub;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#333' }}>
          💕 Dating App MVP
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#666' }}>
          Find your perfect match
        </Text>

        <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#333' }}>
            Welcome back!
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {email ? `Signed in as ${email}` : 'Not signed in'}
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <TouchableOpacity 
            style={{ backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' }}
            onPress={() => router.push('/discover')}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              🔍 Discover People
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ backgroundColor: '#FF9500', padding: 16, borderRadius: 12, alignItems: 'center' }}
            onPress={() => router.push('/matches')}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              💕 My Matches
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ backgroundColor: '#34C759', padding: 16, borderRadius: 12, alignItems: 'center' }}
            onPress={() => router.push('/profile')}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              👤 Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ backgroundColor: '#FF3B30', padding: 16, borderRadius: 12, alignItems: 'center' }}
            onPress={handleSignOut}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              🚪 Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
