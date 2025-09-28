// app/profile.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../src/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Profile() {
  const router = useRouter();
  const uid = auth.currentUser?.uid;

  if (!uid) {
    router.replace('/login');
    return null;
  }

  const ref = doc(db, 'users', uid);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data() as any;
          setDisplayName(d.displayName ?? '');
          setBio(d.bio ?? '');
        }
      } catch (e: any) {
        Alert.alert('Load error', e.message);
      }
    })();
  }, []);

  const save = async () => {
    try {
      await setDoc(ref, {
        email: auth.currentUser?.email ?? null,
        displayName,
        bio,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(), // harmless if it already exists (merge)
      }, { merge: true });
      Alert.alert('Saved', 'Profile updated');
    } catch (e: any) {
      Alert.alert('Save error', e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, marginBottom:12 }}>Your Profile</Text>

      <Text>Display name</Text>
      <TextInput
        style={{ borderWidth:1, padding:10, borderRadius:8, marginBottom:8 }}
        value={displayName}
        onChangeText={setDisplayName}
      />

      <Text>Bio</Text>
      <TextInput
        style={{ borderWidth:1, padding:10, borderRadius:8, marginBottom:12, height:90 }}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <View style={{ flexDirection:'row', gap:8 }}>
        <Button title="Save" onPress={save} />
        <Button title="Back" onPress={() => router.replace('/home')} />
      </View>
    </SafeAreaView>
  );
}
