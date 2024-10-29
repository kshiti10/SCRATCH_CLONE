import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DraxProvider, DraxView } from 'react-native-drax';
import { RootStackParamList } from '../app/types';

type ActionScreenRouteProp = RouteProp<RootStackParamList, 'Action'>;

const actionsList = [
  'Increase Size',
  'Decrease Size',
  'Move X by 50',
  'Move Y by 50',
  'Move X=50, Y=50',
  'Go to (0,0)',
  'Go to random position',
  'Say Hello',
  'Rotate 180',
  'Say Hello for 1 sec',
];

const ActionScreen = () => {
  const route = useRoute<ActionScreenRouteProp>();
  const navigation = useNavigation();
  const { characters, updateActions } = route.params;

  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string[] }>(
    characters.reduce((acc, char) => ({ ...acc, [char.id]: [] }), {})
  );

  const toggleAction = (characterId: string, action: string) => {
    setSelectedActions((prev) => ({
      ...prev,
      [characterId]: prev[characterId].includes(action)
        ? prev[characterId].filter((a) => a !== action)
        : [...prev[characterId], action],
    }));
  };

  const handleDrop = (characterId: string, action: string) => {
    setSelectedActions((prev) => ({
      ...prev,
      [characterId]: [...prev[characterId], action],
    }));
  };

  const handleSave = () => {
    updateActions(selectedActions);
    navigation.goBack();
  };

  return (
    <DraxProvider>
      <View style={styles.container}>
        <Text style={styles.header}>Assign Actions</Text>
        <ScrollView>
          <FlatList
            data={characters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.characterSection}>
                <Text style={styles.characterName}>{item.name}</Text>
                <DraxView
                  style={styles.dropArea}
                  onReceiveDragDrop={({ dragged: { payload } }) => handleDrop(item.id, payload)}
                >
                  <Text style={styles.dropText}>Drag Actions Here</Text>
                </DraxView>
                {selectedActions[item.id].map((action, index) => (
                  <View key={index} style={styles.actionBlock}>
                    <Text>{action}</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => toggleAction(item.id, action)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          />
          <Text style={styles.sectionTitle}>Available Actions</Text>
          <View style={styles.actionsListContainer}>
            {actionsList.map((action) => (
              <DraxView
                key={action}
                payload={action}
                style={styles.actionButton}
                draggingStyle={styles.dragging}
              >
                <Text style={styles.actionButtonText}>{action}</Text>
              </DraxView>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </DraxProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  characterSection: {
    marginBottom: 20,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropArea: {
    height: 80,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropText: {
    color: '#757575',
  },
  actionsListContainer: {
    paddingVertical: 10,
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  dragging: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#000',
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
  saveButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4285F4',
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default ActionScreen;
