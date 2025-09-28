import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View, Alert } from 'react-native';
import { auth } from '../src/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, Link } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Signed up', res.user.email ?? 'OK');
      router.replace('/home');
    } catch (e: any) { Alert.alert('Sign up error', e.message); }
  };

  const signin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Signed in', res.user.email ?? 'OK');
      router.replace('/home');
    } catch (e: any) { Alert.alert('Sign in error', e.message); }
  };

  return (
    <SafeAreaView style={{ flex:1, padding:16, justifyContent:'center' }}>
      <Text style={{ fontSize:24, marginBottom:12 }}>Welcome 👋 (vA1)</Text>

      <Text>Email</Text>
      <TextInput
        style={{ borderWidth:1, padding:10, borderRadius:8, marginVertical:6 }}
        autoCapitalize="none" keyboardType="email-address"
        value={email} onChangeText={setEmail}
      />

      <Text>Password</Text>
      <TextInput
        style={{ borderWidth:1, padding:10, borderRadius:8, marginVertical:6 }}
        secureTextEntry value={password} onChangeText={setPassword}
      />

      <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
        <Button title="Sign In" onPress={signin} />
        <Button title="Sign Up" onPress={signup} />
      </View>

      {/* Debug link to prove routing */}
      <View style={{ height:16 }} />
      <Link href="/home">Go to Home (vA1)</Link>
    </SafeAreaView>
  );
}
