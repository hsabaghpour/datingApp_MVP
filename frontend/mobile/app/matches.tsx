import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  Image,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

interface Match {
  id: string;
  displayName: string;
  photoURL?: string;
  bio: string;
  matchedAt: any;
}

export default function Matches() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        router.replace('/login');
        return;
      }

      // Get all likes from current user
      const likesRef = collection(db, 'swipes');
      const likesQuery = query(
        likesRef, 
        where('swiperId', '==', currentUserId),
        where('action', '==', 'like')
      );
      const likesSnapshot = await getDocs(likesQuery);

      const matchPromises = likesSnapshot.docs.map(async (likeDoc) => {
        const likeData = likeDoc.data();
        const targetId = likeData.targetId;

        // Check if the target user also liked current user
        const mutualLikeQuery = query(
          likesRef,
          where('swiperId', '==', targetId),
          where('targetId', '==', currentUserId),
          where('action', '==', 'like')
        );
        const mutualLikeSnapshot = await getDocs(mutualLikeQuery);

        if (!mutualLikeSnapshot.empty) {
          // It's a match! Get user details
          const userDoc = await getDoc(doc(db, 'users', targetId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
              id: targetId,
              displayName: userData.displayName || 'Anonymous',
              photoURL: userData.photoURL || '',
              bio: userData.bio || '',
              matchedAt: likeData.timestamp,
            };
          }
        }
        return null;
      });

      const matchResults = await Promise.all(matchPromises);
      const validMatches = matchResults.filter(match => match !== null) as Match[];
      
      setMatches(validMatches);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load matches: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity style={styles.matchCard}>
      <Image
        source={{ 
          uri: item.photoURL || 'https://via.placeholder.com/80x80/cccccc/666666?text=No+Photo' 
        }}
        style={styles.matchPhoto}
      />
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.displayName}</Text>
        <Text style={styles.matchBio} numberOfLines={2}>
          {item.bio || 'No bio available'}
        </Text>
        <Text style={styles.matchDate}>
          Matched recently
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matches</Text>
        <View style={{ width: 50 }} />
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptySubtitle}>
            Keep swiping to find your perfect match!
          </Text>
          <TouchableOpacity 
            style={styles.discoverButton}
            onPress={() => router.push('/discover')}
          >
            <Text style={styles.discoverButtonText}>Start Discovering</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
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
  discoverButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  discoverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  matchBio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 12,
    color: '#999',
  },
});
