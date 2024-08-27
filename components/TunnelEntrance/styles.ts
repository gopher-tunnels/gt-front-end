import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: white;
  border-radius: 10px;
  padding: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  width: 180px;
`;

export const Title = styled.Text`
  font-family: 'PlusJakartaSans-Bold';
  font-size: 16px;
  color: #8B4513;
  margin-bottom: 2px;
`;

export const Subtitle = styled.Text`
  font-family: 'PlusJakartaSans-Regular';
  font-size: 12px;
  color: #333;
  margin-bottom: 8px;
`;

export const PlaceholderImage = styled.View`
  background-color: #f0f0f0;
  aspect-ratio: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const PlaceholderText = styled.Text`
  font-family: 'PlusJakartaSans-Regular';
  color: #999;
  font-size: 10px;
`;

export const CalloutContainer = styled.View`
  background-color: white;
  border-radius: 6px;
  padding: 10px;
  width: 200px;
`;

export const CalloutText = styled.Text`
  font-family: 'PlusJakartaSans-Regular';
  font-size: 12px;
  color: #333;
  margin-bottom: 5px;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

export const CloseButtonText = styled.Text`
  font-size: 16px;
  color: #333;
  line-height: 20px;
`;