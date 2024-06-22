import React from 'react';
import { View, Image, Text } from 'react-native';
import { styles } from './styles';

interface TunnelEntranceImageProps {
  imageUrl: string;
  description: string;
}

const TunnelEntranceImage: React.FC<TunnelEntranceImageProps> = ({
  imageUrl,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default TunnelEntranceImage;
