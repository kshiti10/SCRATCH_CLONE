import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, TextInput, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../app/types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ActionScreen from './Actions';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';

const characters = [
  { id: '1', name: 'Cat', image: require('../assets/cat.png') },
  { id: '2', name: 'Dog', image: require('../assets/dog.png') },
  { id: '3', name: 'Ball', image: require('../assets/ball.png') }
];

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: any) => {
  const route = useRoute<HomeScreenRouteProp>();
  const { actions } = route.params || {};

  const [sprites, setSprites] = useState(
    characters.map((character) => ({
      ...character,
      size: 50,
      position: { x: 0, y: 0 },
      rotation: 0,
      message: '',
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }))
  );

  const handleGestureEnd = (event: any, spriteId: string) => {
    const { translationX, translationY } = event.nativeEvent;

    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === spriteId
          ? {
              ...sprite,
              position: {
                x: Math.ceil(sprite.position.x + translationX),
                y: Math.ceil(sprite.position.y + translationY),
              },
            }
          : sprite
      )
    );
  };

  const handleReset = () => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) => ({
        ...sprite,
        position: { x: 0, y: 0 },
        message: '',
        rotation: 0,
        size: 50,
      }))
    );
  };

  const handlePlay = async () => {
    const spritePromises = sprites.map((sprite) => 
      executeActionsForSprite(sprite.id, actions[sprite.id] || [])
    );
    await Promise.all(spritePromises);
  };

  const executeActionsForSprite = async (spriteId: string, actions: string[]) => {
    for (const action of actions) {
      await executeAction(action, spriteId);
    }
  };

  const executeAction = async (action: string, spriteId: string) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) => {
        if (sprite.id !== spriteId) return sprite;

        switch (action) {
          case 'Increase Size':
            return { ...sprite, size: sprite.size + 10 };
          case 'Decrease Size':
            return { ...sprite, size: Math.max(sprite.size - 10, 10) };
          case 'Move X by 50':
            return { ...sprite, position: { ...sprite.position, x: sprite.position.x + 50 } };
          case 'Move Y by 50':
            return { ...sprite, position: { ...sprite.position, y: sprite.position.y + 50 } };
          case 'Say Hello':
            return { ...sprite, message: 'Hello' };
          case 'Rotate 180':
            return { ...sprite, rotation: sprite.rotation + 180 };
          default:
            return sprite;
        }
      })
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const renderSprite = (sprite: any) => (
    <PanGestureHandler
      key={sprite.id}
      onGestureEvent={Animated.event(
        [{ nativeEvent: { translationX: sprite.translateX, translationY: sprite.translateY } }],
        { useNativeDriver: false }
      )}
      onHandlerStateChange={(event) => {
        if (event.nativeEvent.state === State.END) handleGestureEnd(event, sprite.id);
      }}
    >
      <Animated.View
        style={[
          styles.sprite,
          {
            transform: [
              { translateX: Animated.add(sprite.translateX, new Animated.Value(sprite.position.x)) },
              { translateY: Animated.add(sprite.translateY, new Animated.Value(sprite.position.y)) },
              { rotate: `${sprite.rotation}deg` },
            ],
            width: sprite.size,
            height: sprite.size,
          },
        ]}
      >
        <Image source={sprite.image} style={{ width: sprite.size, height: sprite.size }} />
        {sprite.message !== '' && <Text style={{ textAlign: 'center' }}>{sprite.message}</Text>}
      </Animated.View>
    </PanGestureHandler>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sprites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderSprite(item)}
        horizontal
      />
      <TouchableOpacity onPress={handlePlay}>
        <Text>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleReset}>
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  signInText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stage: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sprite: {
    position: 'absolute',
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  characterListSection: {
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  characterContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  characterIcon: {
    width: 50,
    height: 50,
  },
});
