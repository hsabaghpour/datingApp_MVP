// app/profile.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../src/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import PhotoUpload from '../components/PhotoUpload';

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
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    (async () => {
      try {
        console.log('Loading profile for user:', uid);
        const snap = await getDoc(ref);
        console.log('Profile data loaded:', snap.exists());
        
        if (snap.exists()) {
          const d = snap.data() as any;
          setDisplayName(d.displayName ?? '');
          setBio(d.bio ?? '');
          setPhotoURL(d.photoURL ?? '');
        } else {
          console.log('No profile data found, creating new profile');
          // Create initial profile data
          await setDoc(ref, {
            email: auth.currentUser?.email ?? null,
            displayName: '',
            bio: '',
            photoURL: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }
      } catch (e: any) {
        console.error('Profile load error:', e);
        Alert.alert(
          'Load Error', 
          `Error: ${e.message}\n\nThis is likely a Firebase permission issue. Please check your Firestore security rules.`
        );
      }
    })();
  }, []);

  const save = async () => {
    try {
      await setDoc(ref, {
        email: auth.currentUser?.email ?? null,
        displayName,
        bio,
        photoURL,
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize:22, marginBottom:12 }}>Your Profile</Text>

        <PhotoUpload 
          onPhotoUploaded={setPhotoURL}
          currentPhoto={photoURL}
        />

        <Text style={{ fontSize:16, fontWeight:'600', marginBottom:8, color:'#333' }}>Display name</Text>
        <TextInput
          style={{ borderWidth:1, padding:10, borderRadius:8, marginBottom:8, borderColor:'#ddd' }}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your display name"
        />

        <Text style={{ fontSize:16, fontWeight:'600', marginBottom:8, color:'#333' }}>Bio</Text>
        <TextInput
          style={{ borderWidth:1, padding:10, borderRadius:8, marginBottom:12, height:90, borderColor:'#ddd' }}
          value={bio}
          onChangeText={setBio}
          multiline
          placeholder="Tell us about yourself..."
        />

        <View style={{ flexDirection:'row', gap:8, marginTop:16 }}>
          <Button title="Save" onPress={save} />
          <Button title="Back" onPress={() => router.replace('/home')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
