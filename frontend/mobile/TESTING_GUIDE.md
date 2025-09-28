# 🧪 Testing Guide - Dating App MVP

## 🚀 Quick Start

1. **Start the app:**

   ```bash
   npm start
   ```

2. **Open on device:**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## 📱 Testing Flow

### 1. **Authentication Testing**

- ✅ Sign up with a new email/password
- ✅ Sign in with existing credentials
- ✅ Sign out functionality

### 2. **Profile Management**

- ✅ Edit display name and bio
- ✅ Upload profile photo (camera or gallery)
- ✅ Save profile changes

### 3. **Discovery & Swiping**

- ✅ View other users' profiles
- ✅ Swipe left (pass) or right (like)
- ✅ Use action buttons as alternative to swiping
- ✅ Handle empty state when no more profiles

### 4. **Matching System**

- ✅ View matches when mutual likes occur
- ✅ Empty state when no matches yet

## 🔧 Firebase Setup Required

Before testing, ensure your Firebase project has:

### 1. **Authentication**

- Enable Email/Password authentication
- Add your app's bundle ID/package name

### 2. **Firestore Database**

- Create database in test mode
- Collections will be created automatically:
  - `users` - User profiles
  - `swipes` - Swipe actions

### 3. **Storage**

- Enable Firebase Storage
- Set up storage rules for photo uploads

### 4. **Security Rules** (Recommended)

```javascript
// Firestore Rules
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

// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🐛 Common Issues & Solutions

### Issue: "Firebase config not found"

**Solution:** Make sure `.env` file exists with correct Firebase config

### Issue: "Permission denied" on photo upload

**Solution:** Check Firebase Storage rules and enable Storage in Firebase console

### Issue: Swiping not working

**Solution:** Make sure gesture handler is properly configured (already fixed in \_layout.tsx)

### Issue: No users showing in discovery

**Solution:** Create multiple test accounts to see other profiles

## 📊 Test Scenarios

### Scenario 1: New User Journey

1. Sign up with email/password
2. Complete profile with photo and bio
3. Go to Discover and swipe through profiles
4. Check Matches page

### Scenario 2: Multiple Users

1. Create 2-3 test accounts
2. Complete profiles for each
3. Like each other from different accounts
4. Verify matches appear in Matches page

### Scenario 3: Edge Cases

1. Try uploading large photos
2. Test with empty bio
3. Test swiping when no more profiles
4. Test sign out and sign back in

## ✅ Success Criteria

- [ ] App starts without errors
- [ ] Authentication works (sign up/in/out)
- [ ] Profile editing works with photo upload
- [ ] Discovery page shows other users
- [ ] Swiping gestures work smoothly
- [ ] Matches are created when mutual likes occur
- [ ] UI looks modern and responsive
- [ ] No console errors during normal usage

## 🚨 Known Limitations

- No real-time messaging yet
- No push notifications
- No location-based matching
- No advanced filtering
- No photo verification

These are planned for future iterations!
