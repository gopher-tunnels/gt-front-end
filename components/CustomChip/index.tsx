import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Container, ChipText, Circle } from './styles';

export interface CustomChipProps {
  label: string;
  onPress: () => void;
  styleType?: 'default' | 'tunnel' | 'skyway' | 'sidewalk';
}

const CustomChip: React.FC<CustomChipProps> = (props: CustomChipProps) => {
  const { label, onPress, styleType = 'default' } = props;
  return (
    <TouchableOpacity onPress={onPress} style={{}}>
      <Container styleType={styleType}>
        <Circle styleType={styleType} />
        <ChipText styleType={styleType}>{label}</ChipText>
      </Container>
    </TouchableOpacity>
  );
};

export default CustomChip;
