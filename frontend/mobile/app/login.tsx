import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View, Alert, TouchableOpacity } from 'react-native';
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
    <SafeAreaView style={{ flex:1, backgroundColor:'#f5f5f5', padding:20, justifyContent:'center' }}>
      <View style={{ backgroundColor:'#fff', borderRadius:20, padding:30, shadowColor:'#000', shadowOffset:{width:0, height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 }}>
        <Text style={{ fontSize:32, fontWeight:'bold', textAlign:'center', marginBottom:8, color:'#333' }}>
          💕 Welcome
        </Text>
        <Text style={{ fontSize:16, textAlign:'center', marginBottom:30, color:'#666' }}>
          Find your perfect match today
        </Text>

        <View style={{ marginBottom:20 }}>
          <Text style={{ fontSize:16, fontWeight:'600', marginBottom:8, color:'#333' }}>Email</Text>
          <TextInput
            style={{ borderWidth:1, borderColor:'#ddd', padding:15, borderRadius:12, fontSize:16 }}
            autoCapitalize="none" 
            keyboardType="email-address"
            value={email} 
            onChangeText={setEmail}
            placeholder="Enter your email"
          />
        </View>

        <View style={{ marginBottom:30 }}>
          <Text style={{ fontSize:16, fontWeight:'600', marginBottom:8, color:'#333' }}>Password</Text>
          <TextInput
            style={{ borderWidth:1, borderColor:'#ddd', padding:15, borderRadius:12, fontSize:16 }}
            secureTextEntry 
            value={password} 
            onChangeText={setPassword}
            placeholder="Enter your password"
          />
        </View>

        <View style={{ gap:12 }}>
          <TouchableOpacity 
            style={{ backgroundColor:'#007AFF', padding:16, borderRadius:12, alignItems:'center' }}
            onPress={signin}
          >
            <Text style={{ color:'#fff', fontSize:18, fontWeight:'600' }}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ backgroundColor:'#34C759', padding:16, borderRadius:12, alignItems:'center' }}
            onPress={signup}
          >
            <Text style={{ color:'#fff', fontSize:18, fontWeight:'600' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Debug link */}
        <View style={{ height:20 }} />
        <Link href="/home" style={{ textAlign:'center', color:'#007AFF', fontSize:14 }}>
          Go to Home (Debug)
        </Link>
      </View>
    </SafeAreaView>
  );
}
