import React from "react";
import { Container, Label, Progress } from "./styles";
import Indicator from "./Indicator";
import { StyleProp, ViewStyle } from "react-native";
import { DirectionsHeaderProps } from "..";

const directionLabels = {
  right: "Take a right",
  left: "Take a left",
  forward: "Head straight",
  enter: "Enter the tunnel",
};

interface DirectionContainerProps {
  type: DirectionsHeaderProps["directions"][number]; //TODO: unify with IndicatorProps
  progress?: number;
  nextVariant?: boolean;
  style?: StyleProp<ViewStyle>;
  animate?: React.ComponentProps<typeof Container>["animate"];
  transition?: React.ComponentProps<typeof Container>["transition"];
}

const DirectionContainer: React.FC<DirectionContainerProps> = ({
  type,
  progress = 0,
  nextVariant = false,
  animate,
  transition,
  ...props
}) => {
  return (
    <Container
      nextVariant={nextVariant ?? false}
      from={{ transform: [{ translateX: nextVariant ? 200 : 0 }] }}
      animate={{
        width: nextVariant ? "55%" : "100%",
        height: nextVariant ? 40 : 80,
        borderRadius: nextVariant ? 10 : 20,
        transform: [{ translateX: 0 }],
        ...animate,
      }}
      transition={{ type: "timing", ...transition }}
      {...props}
    >
      <Label
        numberOfLines={1}
        nextVariant={nextVariant ?? false}
        animate={{
          width: nextVariant ? 35 : 0,
          marginLeft: nextVariant ? 2 : 0,
          marginRight: nextVariant ? 10 : 0,
          transform: [{ scaleX: nextVariant ? 1 : 0 }],
          // fontSize: nextVariant ? 16 : 24,
        }}
        transition={{ type: "timing" }}
      >
        Then
      </Label>

      <Indicator step={type} size={nextVariant ? 24 : 64} />
      <Label
        nextVariant={nextVariant ?? false}
        animate={{
          marginLeft: nextVariant ? 8 : 23,
          marginRight: nextVariant ? 10 : 0,
          transform: [{ scale: nextVariant ? 1 : 1.5 }],
          // fontSize: nextVariant ? 16 : 24,
        }}
        transition={{ type: "timing" }}
      >
        {directionLabels[type]}
      </Label>
      <Progress animate={{ transform: [{ scaleX: progress ?? 0 }] }} />
    </Container>
  );
};

export default DirectionContainer;
