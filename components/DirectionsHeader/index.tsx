import React from 'react';
import { Container, Content } from './styles';
import { StyleProp, ViewStyle } from 'react-native';
import DirectionContainer from './DirectionContainer';

const directionLabels = {
  // TODO: merge with `Indicator` props
  right: 'Take a right',
  left: 'Take a left',
  forward: 'Head straight',
  enter: 'Enter the tunnel',
};

export interface DirectionsHeaderProps {
  directions: (keyof typeof directionLabels)[]; // TODO: modify according to data from back-end
  current: number;
  progress: number;
  style?: StyleProp<ViewStyle>;
}

const DirectionsHeader: React.FC<DirectionsHeaderProps> = ({
  directions,
  current,
  progress,
  ...props
}) => {
  return (
    <Container {...props} pointerEvents="box-none">
      <Content pointerEvents="box-none">
        {directions.map(
          (direction, index) =>
            index <= current + 1 && (
              <DirectionContainer
                type={direction}
                animate={index < current ? { height: 0 } : {}}
                nextVariant={current < index}
                progress={current < index ? progress : undefined}
              />
            ),
        )}
      </Content>
    </Container>
  );
};

export default DirectionsHeader;
