import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../src/firebase';

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhoto?: string;
}

export default function PhotoUpload({ onPhotoUploaded, currentPhoto }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        Alert.alert('Error', 'You must be logged in to upload photos');
        return;
      }

      const response = await fetch(uri);
      const blob = await response.blob();
      
      const filename = `profile_${auth.currentUser.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `profile-photos/${filename}`);
      
      console.log('Uploading to:', `profile-photos/${filename}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log('Upload successful, URL:', downloadURL);
      onPhotoUploaded(downloadURL);
      Alert.alert('Success', 'Photo uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed', `Error: ${error.message}\n\nMake sure Firebase Storage is enabled and rules allow uploads.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Profile Photo</Text>
      
      {currentPhoto ? (
        <Image source={{ uri: currentPhoto }} style={styles.photo} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No photo</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.galleryButton]} 
          onPress={pickImage}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? 'Uploading...' : 'Choose from Gallery'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.cameraButton]} 
          onPress={takePhoto}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: '#007AFF',
  },
  cameraButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
