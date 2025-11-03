import React from "react";
import { Container, InstructionLabel, LeadingLabel, Progress } from "./styles";
import Indicator from "./Indicator";
import { StyleProp, ViewStyle } from "react-native";
import { GetRouteResponse } from "../../../@types/api";

const defaultDirectionLabels = {
  right: "Take a right",
  left: "Take a left",
  forward: "Head straight",
  enter: "Enter the tunnel",
  elevator: "Take the elevator",
  final: "You've arrived!",
};

interface DirectionContainerProps {
  type: GetRouteResponse["steps"][number]["instruction"]["type"]; //TODO: unify with IndicatorProps
  label?: string;
  progress?: number;
  nextVariant?: boolean;
  style?: StyleProp<ViewStyle>;
  animate?: React.ComponentProps<typeof Container>["animate"];
  transition?: React.ComponentProps<typeof Container>["transition"];
  exit?: React.ComponentProps<typeof Container>["exit"];
}

const DirectionContainer: React.FC<DirectionContainerProps> = ({
  label,
  type,
  progress = 0,
  nextVariant = false,
  animate,
  transition,
  exit,
  ...props
}) => {
  const exitAnimation =
    exit ||
    (nextVariant
      ? {
          opacity: 0,
          transform: [{ translateY: -10 }, { scale: 0.9 }],
          height: 0,
          marginBottom: -8,
        }
      : {
          opacity: 0,
          transform: [{ translateY: -24 }],
          height: 0,
          marginBottom: -8,
        });
  return (
    <Container
      // style={{ backgroundColor: "blue" }}
      nextVariant={nextVariant ?? false}
      from={{ transform: [{ translateX: nextVariant ? 200 : 0 }] }}
      animate={{
        width: nextVariant ? "55%" : "100%",
        borderRadius: nextVariant ? 10 : 20,
        paddingVertical: nextVariant ? 6 : 12,
        transform: [{ translateX: 0 }],
        ...animate,
      }}
      transition={{ type: "timing", ...transition }}
      exit={exitAnimation}
      {...props}
    >
      <LeadingLabel
        numberOfLines={1}
        accessible={nextVariant}
        accessibilityElementsHidden={!nextVariant}
        importantForAccessibility={nextVariant ? "auto" : "no-hide-descendants"}
        animate={{
          opacity: nextVariant ? 1 : 0,
          width: nextVariant ? 42 : 0,
          marginRight: nextVariant ? 6 : 0,
        }}
        transition={{ type: "timing" }}
      >
        Then
      </LeadingLabel>

      <Indicator step={type} size={nextVariant ? 24 : 64} />
      <InstructionLabel
        numberOfLines={nextVariant ? 1 : undefined}
        ellipsizeMode={nextVariant ? "tail" : "clip"}
        animate={{
          marginLeft: nextVariant ? 8 : 20,
          marginRight: nextVariant ? 10 : 0,
          fontSize: nextVariant ? 16 : 20,
          lineHeight: nextVariant ? 20 : 30,
        }}
        transition={{ type: "timing" }}
      >
        {label || defaultDirectionLabels[type]}
      </InstructionLabel>
      <Progress
        pointerEvents="none"
        animate={{
          transform: [{ scaleX: progress }],
          opacity: nextVariant ? 1 : 0,
        }}
        transition={{ type: "timing" }}
      />
    </Container>
  );
};

export default DirectionContainer;
