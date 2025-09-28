// app/index.tsx
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { auth } from '../src/firebase';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      router.replace(u ? '/home' : '/login');
    });
    return unsub;
  }, []);

  return (
    <SafeAreaView style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Loading…</Text>
    </SafeAreaView>
  );
}
