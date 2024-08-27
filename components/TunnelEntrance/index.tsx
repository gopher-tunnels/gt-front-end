import React from 'react';
import { View, Image, TouchableOpacity, GestureResponderEvent } from 'react-native';
import {
  Container,
  Title,
  Subtitle,
  PlaceholderImage,
  PlaceholderText,
  CloseButton,
  CloseButtonText
} from './styles';

interface TunnelEntranceProps {
  floor: number;
  building: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  onClose?: () => void;
  imageSrc?: string;
}

const TunnelEntrance: React.FC<TunnelEntranceProps> = ({
  floor,
  building,
  coordinate,
  onClose,
  imageSrc
}) => {
  const handleClose = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  return (
    <View>
      <Container>
        <TouchableOpacity 
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <CloseButton>
            <CloseButtonText>×</CloseButtonText>
          </CloseButton>
        </TouchableOpacity>
        <Title>Tunnel Entrance</Title>
        <Subtitle>{`Floor ${floor} in ${building}`}</Subtitle>
        {imageSrc ? (
          <Image source={{ uri: imageSrc }} style={{ width: '100%', aspectRatio: 1 }} />
        ) : (
          <PlaceholderImage>
            <PlaceholderText>Photo of tunnel entrance</PlaceholderText>
          </PlaceholderImage>
        )}
      </Container>
    </View>
  );
};

export default TunnelEntrance;