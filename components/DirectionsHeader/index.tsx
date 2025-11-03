import React, { useMemo } from "react";
import { Container, Content } from "./styles";
import { StyleProp, ViewStyle } from "react-native";
import DirectionContainer from "./DirectionContainer";
import Animated, {
  Easing,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { AnimatePresence } from "moti";
import { GetRouteResponse } from "../../@types/api";

type DirectionType = GetRouteResponse["steps"][number]["instruction"]["type"];

export interface DirectionsHeaderProps {
  directions: (DirectionType | { type: DirectionType; label: string })[];
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
  const renderedDirections = useMemo(() => {
    const items: {
      value: (typeof directions)[number];
      index: number;
      nextVariant: boolean;
    }[] = [];

    const currentDirection = directions[current];
    if (currentDirection) {
      items.push({
        value: currentDirection,
        index: current,
        nextVariant: false,
      });
    }

    const nextDirection = directions[current + 1];
    if (nextDirection) {
      items.push({
        value: nextDirection,
        index: current + 1,
        nextVariant: true,
      });
    }

    return items;
  }, [directions, current]);

  return (
    <AnimatedContainer
      {...props}
      pointerEvents="box-none"
      entering={SlideInUp.duration(500).easing(Easing.out(Easing.exp))}
      exiting={SlideOutUp.duration(500).easing(Easing.in(Easing.exp))}
    >
      <Content pointerEvents="box-none">
        <AnimatePresence initial={false}>
          {renderedDirections.map(({ value, index, nextVariant }) => {
            const directionType =
              typeof value === "string" ? value : value.type;
            const directionLabel =
              typeof value === "string" ? undefined : value.label;
            return (
              <DirectionContainer
                label={directionLabel}
                key={`direction-${index}`}
                type={directionType}
                nextVariant={nextVariant}
                progress={nextVariant ? progress : undefined}
              />
            );
          })}
        </AnimatePresence>
      </Content>
    </AnimatedContainer>
  );
};

export default DirectionsHeader;
