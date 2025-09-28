import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;

interface User {
  id: string;
  displayName: string;
  bio: string;
  photoURL?: string;
  age?: number;
}

interface SwipeCardProps {
  user: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}

export default function SwipeCard({ user, onSwipeLeft, onSwipeRight, isTop }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(isTop ? 1 : 0.95);
  const opacity = useSharedValue(isTop ? 1 : 0.8);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
      
      // Add rotation based on horizontal movement
      const rotation = translateX.value / 10;
      translateX.value = translateX.value;
    },
    onEnd: (event) => {
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft) {
        translateX.value = withSpring(-screenWidth * 1.5);
        runOnJS(onSwipeLeft)();
      } else if (shouldSwipeRight) {
        translateX.value = withSpring(screenWidth * 1.5);
        runOnJS(onSwipeRight)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = translateX.value / 10;
    
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} enabled={isTop}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image
          source={{ 
            uri: user.photoURL || 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Photo' 
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>
              {user.displayName || 'Anonymous'}
              {user.age && `, ${user.age}`}
            </Text>
            <Text style={styles.bio} numberOfLines={3}>
              {user.bio || 'No bio available'}
            </Text>
          </View>
        </View>
        
        {/* Swipe indicators */}
        <View style={[styles.swipeIndicator, styles.leftIndicator]}>
          <Text style={styles.swipeText}>NOPE</Text>
        </View>
        <View style={[styles.swipeIndicator, styles.rightIndicator]}>
          <Text style={styles.swipeText}>LIKE</Text>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: screenWidth - 40,
    height: 500,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  swipeIndicator: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
    opacity: 0,
  },
  leftIndicator: {
    left: 20,
    borderColor: '#ff4444',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  rightIndicator: {
    right: 20,
    borderColor: '#44ff44',
    backgroundColor: 'rgba(68, 255, 68, 0.1)',
  },
  swipeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});
