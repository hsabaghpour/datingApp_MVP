// Test Firestore connection and permissions
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, serverTimestamp } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Load environment variables
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

async function testFirestore() {
  try {
    console.log('Testing Firestore connection...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    console.log('✅ Firebase initialized');
    console.log('Project ID:', process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
    
    // Test with a test user (you'll need to create this)
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    console.log('Attempting to sign in with test user...');
    try {
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ Authentication successful');
    } catch (authError) {
      console.log('⚠️  Authentication failed (this is expected if test user doesn\'t exist)');
      console.log('Auth error:', authError.message);
      console.log('\nTo test properly, create a test user in your app first.');
      return;
    }
    
    const userId = auth.currentUser.uid;
    console.log('User ID:', userId);
    
    // Test reading user document
    console.log('Testing read permission...');
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    console.log('✅ Read permission works');
    console.log('User document exists:', userDoc.exists());
    
    // Test writing user document
    console.log('Testing write permission...');
    await setDoc(userRef, {
      email: testEmail,
      displayName: 'Test User',
      bio: 'Test bio',
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log('✅ Write permission works');
    
    console.log('🎉 Firestore is working correctly!');
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error.message);
    console.error('Full error:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔧 SOLUTION: Update your Firestore security rules to:');
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /swipes/{swipeId} {
      allow read, write: if request.auth != null;
    }
  }
}
      `);
    }
  }
}

testFirestore();
