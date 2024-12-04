import React from "react";
import { Container, Content } from "./styles";
import { StyleProp, ViewStyle } from "react-native";
import DirectionContainer from "./DirectionContainer";
import Animated, {
  Easing,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";

const directionLabels = {
  // TODO: merge with `Indicator` props
  right: "Take a right",
  left: "Take a left",
  forward: "Head straight",
  enter: "Enter the tunnel",
};

export interface DirectionsHeaderProps {
  directions: (keyof typeof directionLabels)[]; // TODO: modify according to data from back-end
  current: number;
  progress: number;
  style?: StyleProp<ViewStyle>;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);

/**
 * @description A label that shows current direction with a symbol and a small tab that shows the next direction with a progress bar
 *
 * @param {(keyof typeof directionLabels)[]} directions - the directions that will show up on the header with according symbols, the current direction shows on the main header and the next direction shows on the smaller tab. Must be: "enter", "right", "left" or "forward"
 * @param {number} current - the current number is the current step from the directions to show up on the header starting at 0
 * @param {number} progress - affects the progress of the loading bar in the next direction tab. 0 is empty, 1.05 is full (weird number?)
 * @param {StyleProp<ViewStyle>} style - the style of the header
 * 
 * @returns {React.FC<CustomChipProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <DirectionsHeader
 *   directions={["enter", "left", "forward", "right"]}
 *   current={0}
 *   progress={0.1}
 *  />
 * ```
 */

const DirectionsHeader: React.FC<DirectionsHeaderProps> = ({
  directions,
  current,
  progress,
  ...props
}) => {
  return (
    <AnimatedContainer
      {...props}
      pointerEvents="box-none"
      entering={SlideInUp.duration(500).easing(Easing.out(Easing.exp))}
      exiting={SlideOutUp.duration(500).easing(Easing.in(Easing.exp))}
    >
      <Content pointerEvents="box-none">
        {directions.map(
          (direction, index) =>
            index <= current + 1 && (
              <DirectionContainer
                key={index}
                type={direction}
                animate={index < current ? { height: 0 } : {}}
                nextVariant={current < index}
                progress={current < index ? progress : undefined}
              />
            ),
        )}
      </Content>
    </AnimatedContainer>
  );
};

export default DirectionsHeader;
