import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../src/firebase';
import SwipeCard from '../components/SwipeCard';

interface User {
  id: string;
  displayName: string;
  bio: string;
  photoURL?: string;
  age?: number;
}

export default function Discover() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        router.replace('/login');
        return;
      }

      // Get all users except current user
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('__name__', '!=', currentUserId));
      const querySnapshot = await getDocs(q);
      
      const usersList: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        usersList.push({
          id: doc.id,
          displayName: userData.displayName || 'Anonymous',
          bio: userData.bio || '',
          photoURL: userData.photoURL || '',
          age: userData.age || null,
        });
      });

      setUsers(usersList);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = async (userId: string) => {
    // Record the swipe (pass)
    await recordSwipe(userId, 'pass');
    nextCard();
  };

  const handleSwipeRight = async (userId: string) => {
    // Record the swipe (like)
    await recordSwipe(userId, 'like');
    nextCard();
  };

  const recordSwipe = async (targetUserId: string, action: 'like' | 'pass') => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) return;

      const swipeRef = doc(db, 'swipes', `${currentUserId}_${targetUserId}`);
      await setDoc(swipeRef, {
        swiperId: currentUserId,
        targetId: targetUserId,
        action,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  };

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const resetCards = () => {
    setCurrentIndex(0);
    loadUsers();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Finding people for you...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No more profiles!</Text>
          <Text style={styles.emptySubtitle}>
            You've seen all available profiles. Check back later for new people!
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetCards}>
            <Text style={styles.resetButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentUser = users[currentIndex];
  const nextUser = users[currentIndex + 1];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.cardContainer}>
        {currentUser && (
          <SwipeCard
            user={currentUser}
            onSwipeLeft={() => handleSwipeLeft(currentUser.id)}
            onSwipeRight={() => handleSwipeRight(currentUser.id)}
            isTop={true}
          />
        )}
        
        {nextUser && (
          <SwipeCard
            user={nextUser}
            onSwipeLeft={() => handleSwipeLeft(nextUser.id)}
            onSwipeRight={() => handleSwipeRight(nextUser.id)}
            isTop={false}
          />
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipeLeft(currentUser.id)}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipeRight(currentUser.id)}
        >
          <Text style={styles.actionButtonText}>♥</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#ff4444',
  },
  likeButton: {
    backgroundColor: '#44ff44',
  },
  actionButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
