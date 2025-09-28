# 🔧 Firebase Permission Fix Guide

## 🚨 **The Problem**

You're getting "missing or insufficient permission" errors when trying to edit your profile. This is because Firebase Firestore security rules are blocking the request.

## ✅ **Quick Fix (2 minutes)**

### **Step 1: Go to Firebase Console**

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project: `dating-app-mvp-halal`
3. Click **Firestore Database** in the left sidebar
4. Click **Rules** tab

### **Step 2: Replace the Rules**

Copy and paste this code:

```javascript
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
```

### **Step 3: Publish**

1. Click **Publish** button
2. Confirm the changes

### **Step 4: Test**

1. Reload your app (shake device → Reload)
2. Go to Profile page
3. Should work without errors now!

## 🚀 **Alternative: Test Mode (Even Quicker)**

If you want to test immediately, use these rules (NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 🔍 **Why This Happens**

- Default Firebase rules are very restrictive
- Your app tries to read/write user data
- Firebase blocks the request
- You see "permission denied" error

## 📱 **After Fixing**

Your app should work perfectly:

- ✅ Profile editing works
- ✅ Photo upload works
- ✅ Discovery works
- ✅ Matching works

## 🆘 **Still Having Issues?**

1. Make sure you're logged into the correct Firebase project
2. Check that the rules were published successfully
3. Try the test mode rules temporarily
4. Check the app console for more specific error messages
