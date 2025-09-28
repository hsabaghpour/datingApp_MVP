import { useEffect } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/firebase';
import { useRouter } from 'expo-router';

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
      <Text>Loading… vA1</Text>
    </SafeAreaView>
  );
}
