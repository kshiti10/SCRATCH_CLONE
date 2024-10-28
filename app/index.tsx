import React, { useState, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, TextInput, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../app/types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ActionScreen from './Actions';

const characters = [
  { id: 1, name: 'Cat', image: require('../assets/cat.png') },
  { id: 2, name: 'Dog', image: require('../assets/dog.png') },
  { id: 3, name: 'Ball', image: require('../assets/ball.png') },
];

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

// Define a type for each character's state
type CharacterState = {
  size: number;
  position: { x: number; y: number };
  rotation: number;
  message: string;
};

// Define the main state type
type CharacterStates = {
  [key: string]: CharacterState;
};

const HomeScreen = ({ navigation }: any) => {
  const route = useRoute<HomeScreenRouteProp>();
  const { actions } = route.params || {};

  const [characterStates, setCharacterStates] = useState<CharacterStates>(
    characters.reduce((acc, char) => ({
      ...acc,
      [char.id]: {
        size: 50,
        position: { x: 0, y: 0 },
        rotation: 0,
        message: '',
      },
    }), {} as CharacterStates)
  );

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handleGestureEnd = useCallback(
    (characterId: string, event) => {
      const { translationX, translationY } = event.nativeEvent;
      setCharacterStates((prev) => ({
        ...prev,
        [characterId]: {
          ...prev[characterId],
          position: {
            x: Math.ceil(prev[characterId].position.x + translationX),
            y: Math.ceil(prev[characterId].position.y + translationY),
          },
        },
      }));
      translateX.setValue(0);
      translateY.setValue(0);
    },
    []
  );

  const handleReset = useCallback(() => {
    setCharacterStates((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, state]) => [
          id,
          { ...state, position: { x: 0, y: 0 }, size: 50, rotation: 0, message: '' },
        ])
      )
    );
  }, []);

  const executeAction = useCallback(
    async (action, characterId) => {
      setCharacterStates((prev) => {
        const characterState = prev[characterId];
        switch (action) {
          case 'Increase Size':
            return { ...prev, [characterId]: { ...characterState, size: characterState.size + 10 } };
          case 'Decrease Size':
            return { ...prev, [characterId]: { ...characterState, size: Math.max(characterState.size - 10, 10) } };
          case 'Move X by 50':
            return { ...prev, [characterId]: { ...characterState, position: { ...characterState.position, x: characterState.position.x + 50 } } };
          case 'Move Y by 50':
            return { ...prev, [characterId]: { ...characterState, position: { ...characterState.position, y: characterState.position.y + 50 } } };
          case 'Move X=50, Y=50':
            return { ...prev, [characterId]: { ...characterState, position: { x: characterState.position.x + 50, y: characterState.position.y + 50 } } };
          case 'Go to (0,0)':
            return { ...prev, [characterId]: { ...characterState, position: { x: 0, y: 0 } } };
          case 'Go to random position':
            return { ...prev, [characterId]: { ...characterState, position: { x: Math.random() * 200, y: Math.random() * 200 } } };
          case 'Say Hello':
            return { ...prev, [characterId]: { ...characterState, message: 'Hello' } };
          case 'Rotate 180':
            return { ...prev, [characterId]: { ...characterState, rotation: characterState.rotation + 180 } };
          default:
            return prev;
        }
      });
      if (action === 'Say Hello') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCharacterStates((prev) => ({
          ...prev,
          [characterId]: { ...prev[characterId], message: '' },
        }));
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    []
  );

  const handlePlay = useCallback(async () => {
    // Iterate over each character and execute its specific actions
    for (const character of characters) {
      // Get the specific actions for this character (assuming actions[character.id] holds individual actions)
      const characterActions = actions?.[character.id] || []; // Get character-specific actions
  
      for (const action of characterActions) {
        if (action === 'Repeat') {
          const repeatActions = [...characterActions];
          for (const repeatAction of repeatActions) {
            await executeAction(repeatAction, character.id);
          }
        } else {
          await executeAction(action, character.id);
        }
      }
    }
  }, [actions, executeAction]);
  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require('../assets/scratch_logo.png')} style={styles.logo} />
        <Text style={styles.signInText}>Sign In</Text>
      </View>

      <View style={styles.stage}>
        {characters.map((character) => {
          const characterState = characterStates[character.id];
          const animatedStyle = {
            transform: [
              { translateX: characterState.position.x },
              { translateY: characterState.position.y },
              { rotate: `${characterState.rotation}deg`},
            ],
          };
          return (
            <PanGestureHandler
              key={character.id}
              onGestureEvent={Animated.event(
                [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
                { useNativeDriver: false }
              )}
              onHandlerStateChange={(event) =>
                event.nativeEvent.state === State.END && handleGestureEnd(character.id.toString(), event)
              }
            >
              <Animated.View style={[styles.sprite, animatedStyle]}>
                <Image source={character.image} style={{ width: characterState.size, height: characterState.size }} />
                {characterState.message !== '' && <Text style={{ textAlign: 'center' }}>{characterState.message}</Text>}
              </Animated.View>
            </PanGestureHandler>
          );
        })}
      </View>

      <View style={styles.controlBar}>
        <TouchableOpacity onPress={handlePlay}>
          <Text>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset}>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.characterListSection}>
        <FlatList
          data={characters}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Action', { character: item })} style={styles.characterContainer}>
              <Image source={item.image} style={styles.characterIcon} />
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.characterList}
        />
      </View>
    </View>
  );
};


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Action" component={ActionScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
    position: "absolute", width: 50,
    height: 50,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  positionControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 50,
    marginHorizontal: 5,
  },
  characterListSection: {
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  characterList: {
    flexDirection: 'row',
    alignItems: 'center',
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