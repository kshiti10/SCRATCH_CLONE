import React, { useRef } from 'react';
import { View, PanResponder, Animated, StyleSheet } from 'react-native';

interface DraggableBlockProps {
  initialX: number;
  initialY: number;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ initialX, initialY }) => {
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset(); // Ensures the block stays in place
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout(), styles.block]}
    />
  );
};

const styles = StyleSheet.create({
  block: {
    width: 100,
    height: 100,
    backgroundColor: '#61dafb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default DraggableBlock;