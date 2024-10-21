import { NavigationContainer, RouteProp, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { RootStackParamList } from '../app/types';
import ActionScreen from '..//app/Actions';

// Sample character data
const spriteOptions = [
  { id: '1', label: 'Cat', image: require('../assets/cat.png') },
  { id: '2', label: 'Dog', image: require('../assets/dog.png') },
  { id: '3', label: 'Ball', image: require('../assets/ball.png') },
];

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const MainScreen = ({ navigation }: any) => {
  const route = useRoute<HomeScreenRouteProp>();
  const { actions } = route.params || {};

  const [selectedSprite, setSelectedSprite] = useState(spriteOptions[0]);
  const [spriteSize, setSpriteSize] = useState(50);

  const xTranslate = useRef(new Animated.Value(0)).current;
  const yTranslate = useRef(new Animated.Value(0)).current;
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const [displayText, setDisplayText] = useState('');
  const [rotationAngle, setRotationAngle] = useState(0);

  const handleDrag = Animated.event(
    [{ nativeEvent: { translationX: xTranslate, translationY: yTranslate } }],
    { useNativeDriver: false }
  );

  const onDragEnd = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    setSpritePosition((prev) => ({
      x: Math.ceil(prev.x + translationX),
      y: Math.ceil(prev.y + translationY),
    }));
    xTranslate.setValue(0);
    yTranslate.setValue(0);
  };

  const resetPosition = () => {
    setSpritePosition({ x: 0, y: 0 });
    setDisplayText('');
    setRotationAngle(0);
    setSpriteSize(50);
  };

  const executeAction = async (action: string) => {
    switch (action) {
      case 'Increase Size':
        setSpriteSize((prev) => prev + 10);
        break;
      case 'Decrease Size':
        setSpriteSize((prev) => Math.max(prev - 10, 10));
        break;
      case 'Move X by 50':
        setSpritePosition((prev) => ({ ...prev, x: prev.x + 50 }));
        break;
      case 'Move Y by 50':
        setSpritePosition((prev) => ({ ...prev, y: prev.y + 50 }));
        break;
      case 'Go to (0,0)':
        setSpritePosition({ x: 0, y: 0 });
        break;
      case 'Go to random position':
        setSpritePosition({ x: Math.ceil(Math.random() * 200), y: Math.ceil(Math.random() * 200) });
        break;
      case 'Say Hello':
        setDisplayText('Hello');
        break;
      case 'Say Hello for 1 sec':
        setDisplayText('Hello');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setDisplayText('');
        break;
      case 'Rotate 180':
        setRotationAngle((prev) => prev + 180);
        break;
      default:
        console.log(`Unhandled action: ${action}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handlePlayActions = async () => {
    if (actions && actions.length > 0) {
      for (const action of actions) {
        if (action === 'Repeat') {
          const repeatableActions = [...actions];
          for (const repeatAction of repeatableActions) {
            await executeAction(repeatAction);
          }
        } else {
          await executeAction(action);
        }
      }
    }
  };

  const updatePosition = (axis: 'x' | 'y', value: string) => {
    setSpritePosition((prev) => ({ ...prev, [axis]: parseFloat(value) }));
  };

  const renderSpriteOption = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Action', { character: item });
        setSelectedSprite(item);
      }}
      style={styles.spriteContainer}
    >
      <Image source={item.image} style={styles.spriteIcon} />
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Image source={require('../assets/scratch_logo.png')} style={styles.logo} />
        <Text style={styles.signIn}>Sign In</Text>
      </View>

      <View style={styles.stageArea}>
        <PanGestureHandler
          onGestureEvent={handleDrag}
          onHandlerStateChange={(event) => {
            if (event.nativeEvent.state === State.END) {
              onDragEnd(event);
            }
          }}
        >
          <Animated.View
            style={[
              styles.spriteDisplay,
              {
                transform: [
                  { translateX: Animated.add(xTranslate, new Animated.Value(spritePosition.x)) },
                  { translateY: Animated.add(yTranslate, new Animated.Value(spritePosition.y)) },
                  { rotate: `${rotationAngle}deg` },
                ],
              },
            ]}
          >
            <Image source={selectedSprite.image} style={{ width: spriteSize, height: spriteSize }} />
            {displayText !== '' && <Text style={styles.displayMessage}>{displayText}</Text>}
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={styles.controlPanel}>
        <Text>Sprite: {selectedSprite.label}</Text>
        <TouchableOpacity onPress={handlePlayActions}>
          <Text>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetPosition}>
          <Text>Reset</Text>
        </TouchableOpacity>

        <View style={styles.positionControl}>
          <Text>X</Text>
          <TextInput
            style={styles.inputField}
            value={spritePosition.x.toString()}
            onChangeText={(value) => updatePosition('x', value)}
            keyboardType="numeric"
          />
          <Text>Y</Text>
          <TextInput
            style={styles.inputField}
            value={spritePosition.y.toString()}
            onChangeText={(value) => updatePosition('y', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.spriteSelection}>
        <FlatList
          data={spriteOptions}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderSpriteOption}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.spriteList}
        />
      </View>
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={MainScreen} />
        <Stack.Screen name="Action" component={ActionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  signIn: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stageArea: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  spriteDisplay: {
    width: 50,
    height: 50,
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  positionControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 50,
    marginHorizontal: 5,
  },
  spriteSelection: {
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  spriteList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spriteContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  spriteIcon: {
    width: 50,
    height: 50,
  },
  displayMessage: {
    position: 'absolute',
    top: -20,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
