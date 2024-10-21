import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DraxProvider, DraxView } from 'react-native-drax';
import { RootStackParamList } from './types';

// Define navigation type for ActionScreen
type NavigationProps = StackNavigationProp<RootStackParamList, 'Action'>;

const availableBlocks = [
  'Move X by 50',
  'Move Y by 50',
  'Rotate 180 degrees',
  'Move to Origin',
  'Move to Random Position',
  'Display "Hello"',
  'Display "Hello" for 1 second',
  'Increase Size',
  'Decrease Size',
  'Repeat Action',
];

const ActionEditor = () => {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProps>();

  // Handle dropping blocks into the action area
  const onDrop = (block: string) => {
    setSelectedActions((currentActions) => [...currentActions, block]);
  };

  // Handle removing a block from the action area
  const onRemove = (index: number) => {
    setSelectedActions((currentActions) => currentActions.filter((_, i) => i !== index));
  };

  // Navigate back with the selected actions
  const onFinish = () => {
    navigation.navigate('Home', { actions: selectedActions });
  };

  return (
    <DraxProvider>
      <View style={styles.wrapper}>
        {/* Top navigation bar */}
        <View style={styles.navigationBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.navButton}>{"< Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Action Editor</Text>
          <TouchableOpacity onPress={onFinish}>
            <Text style={styles.navButton}>Finish</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editorWrapper}>
          {/* Available blocks section */}
          <View style={styles.blockSection}>
            <Text style={styles.sectionHeading}>Available Actions</Text>
            <ScrollView contentContainerStyle={styles.blockList}>
              {availableBlocks.map((block, index) => (
                <DraxView
                  key={index}
                  payload={block}
                  style={styles.blockItem}
                  draggingStyle={styles.dragEffect}
                >
                  <Text style={styles.blockText}>{block}</Text>
                </DraxView>
              ))}
            </ScrollView>
          </View>

          {/* Action area */}
          <View style={styles.actionSection}>
            <Text style={styles.sectionHeading}>Selected Actions</Text>
            <View style={styles.actionContainer}>
              {selectedActions.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <Text>{action}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => onRemove(index)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <DraxView
                style={styles.dropArea}
                onReceiveDragDrop={({ dragged: { payload } }) => onDrop(payload)}
              >
                <Text style={styles.dropAreaText}>Drop Actions Here</Text>
              </DraxView>
            </View>
          </View>
        </View>
      </View>
    </DraxProvider>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  navigationBar: {
    height: 50,
    backgroundColor: '#1e90ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  navButton: {
    color: '#fff',
    fontSize: 18,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editorWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  blockSection: {
    flex: 0.5,
    backgroundColor: '#e0f7fa',
    padding: 10,
  },
  actionSection: {
    flex: 0.5,
    backgroundColor: '#e8f5e9',
    padding: 10,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blockList: {
    alignItems: 'center',
  },
  blockItem: {
    width: '90%',
    height: 40,
    backgroundColor: '#80deea',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  dragEffect: {
    opacity: 0.7,
  },
  blockText: {
    fontSize: 16,
    color: '#000',
  },
  actionContainer: {
    flex: 1,
    borderColor: '#388e3c',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
  },
  actionItem: {
    height: 40,
    backgroundColor: '#a5d6a7',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  removeButton: {
    backgroundColor: '#d32f2f',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  dropArea: {
    height: 80,
    backgroundColor: '#ffeb3b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  dropAreaText: {
    fontSize: 16,
    color: '#555',
  },
});

export default ActionEditor;
