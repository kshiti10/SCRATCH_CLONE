import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import DraggableBlock from '../app/DraggableBlock';

const BlockEditor: React.FC = () => {
  const [blocks, setBlocks] = useState([{ id: 1, x: 0, y: 0 }, { id: 2, x: 100, y: 100 }]);

  return (
    <View style={styles.editor}>
      {blocks.map((block) => (
        <DraggableBlock key={block.id} initialX={block.x} initialY={block.y} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  editor: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e0e0e0',
    padding: 10,
  },
});

export default BlockEditor;
