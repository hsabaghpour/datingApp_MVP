// app/home.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 22 }}>Dating App MVP (vA1)</Text>
      <View style={{ height: 8 }} />
      <Text>{email ? `Signed in as ${email}` : 'Not signed in'}</Text>

      <View style={{ height: 16 }} />
      <Button title="Sign out" onPress={handleSignOut} />

      <View style={{ height: 8 }} />
      <Button title="Edit Profile" onPress={() => router.push('/profile')} />

      <View style={{ height: 8 }} />
      <Link href="/profile">Go to Profile (vA1)</Link>
    </SafeAreaView>
  );
}
