import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { DraxProvider, DraxView } from 'react-native-drax';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../app/types';
import { StackNavigationProp } from '@react-navigation/stack';

type ActionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Action'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Action'>;

const blocks = [
  'Move X by 50',
  'Move Y by 50',
  'Rotate 180',
  'Go to (0,0)',
  'Move X=50, Y=50',
  'Go to random position',
  'Say Hello',
  'Say Hello for 1 sec',
  'Increase Size',
  'Decrease Size',
  'Repeat',
];

export default function ActionScreen() {
  const navigation = useNavigation<ActionScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const { character } = route.params || {};

  const [spriteActions, setSpriteActions] = useState<{ [spriteId: string]: string[] }>({});
  const [currentSprite, setCurrentSprite] = useState(character?.id || '');

  const handleDrop = (block: string) => {
    setSpriteActions((prevActions) => ({
      ...prevActions,
      [currentSprite]: [...(prevActions[currentSprite] || []), block],
    }));
  };

  const handleDelete = (index: number) => {
    setSpriteActions((prevActions) => ({
      ...prevActions,
      [currentSprite]: prevActions[currentSprite].filter((_, i) => i !== index),
    }));
  };

  const handleDone = () => {
    navigation.navigate('Home', { actions: spriteActions });
  };

  return (
    <DraxProvider>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"< Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Scratch Action Editor for {character?.name}</Text>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editorContainer}>
          <View style={styles.codeSection}>
            <Text style={styles.sectionTitle}>CODE</Text>
            <ScrollView contentContainerStyle={styles.blockList}>
              {blocks.map((block, index) => (
                <DraxView
                  key={index}
                  payload={block}
                  style={styles.codeBlock}
                  draggingStyle={styles.dragging}
                >
                  <Text style={styles.blockText}>{block}</Text>
                </DraxView>
              ))}
            </ScrollView>
          </View>

          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>ACTION</Text>
            <View style={styles.actionArea}>
              {(spriteActions[currentSprite] || []).map((block, index) => (
                <View key={index} style={styles.actionBlock}>
                  <Text>{block}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(index)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <DraxView
                style={styles.dropArea}
                onReceiveDragDrop={({ dragged: { payload } }) => handleDrop(payload)}
              >
                <Text style={styles.dropText}>Drag Here</Text>
              </DraxView>
            </View>
          </View>
        </View>
      </View>
    </DraxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    height: 50,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneButton: {
    color: '#fff',
    fontSize: 18,
  },
  editorContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  codeSection: {
    flex: 0.5,
    backgroundColor: '#e3f2fd',
    padding: 10,
  },
  actionSection: {
    flex: 0.5,
    backgroundColor: '#c8e6c9',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blockList: {
    alignItems: 'center',
  },
  codeBlock: {
    width: '90%',
    height: 40,
    backgroundColor: '#bbdefb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  dragging: {
    opacity: 0.5,
  },
  blockText: {
    fontSize: 16,
    color: '#000',
  },
  spritesList: {
    paddingHorizontal: 5,
  },
  spriteContainer: {
    marginBottom: 15,
  },
  spriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  actionBlock: {
    height: 40,
    backgroundColor: '#a5d6a7',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  dropArea: {
    height: 80,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  dropText: {
    fontSize: 16,
    color: '#757575',
  },
});
