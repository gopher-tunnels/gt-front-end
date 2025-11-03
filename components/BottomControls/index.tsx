import React, { useCallback, useEffect, useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import CenterButton from "../CenterButton";
import DirectionsModal, { DirectionsModalProps } from "../DirectionsModal";
import { ButtonRow } from "./styles";

interface BottomControlsProps extends DirectionsModalProps {
  onCenter: () => void;
  centerButtonActive: boolean;
}

const DEFAULT_HIDDEN_OFFSET = 400;
const HIDDEN_EXTRA_SPACE = 24;
const BUTTON_MODAL_GAP = 12;
const timingConfig = {
  duration: 700,
  easing: Easing.out(Easing.exp),
} as const;
const buttonContainerBaseStyle = {
  position: "absolute" as const,
  bottom: 16,
  right: 16,
};

const BottomControls: React.FC<BottomControlsProps> = ({
  onCenter,
  centerButtonActive,
  active,
  ...modalProps
}) => {
  const modalTranslateY = useSharedValue(active ? 0 : DEFAULT_HIDDEN_OFFSET);
  const buttonTranslateY = useSharedValue(0);
  const legendTranslation = useSharedValue(0);
  const isActive = useSharedValue(active ? 1 : 0);
  const [modalHeight, setModalHeight] = useState<number | null>(null);
  const measuredHeightRef = useRef<number | null>(null);

  const hiddenOffset =
    modalHeight !== null
      ? modalHeight + HIDDEN_EXTRA_SPACE
      : measuredHeightRef.current !== null
        ? measuredHeightRef.current + HIDDEN_EXTRA_SPACE
        : DEFAULT_HIDDEN_OFFSET;

  useEffect(() => {
    isActive.value = active ? 1 : 0;
    modalTranslateY.value = withTiming(active ? 0 : hiddenOffset, timingConfig);
  }, [active, hiddenOffset, isActive, modalTranslateY]);

  useEffect(() => {
    const liftTarget =
      modalHeight !== null
        ? Math.max(0, modalHeight - BUTTON_MODAL_GAP)
        : measuredHeightRef.current !== null
          ? Math.max(0, measuredHeightRef.current - BUTTON_MODAL_GAP)
          : 0;
    const target = active ? -liftTarget : 0;
    buttonTranslateY.value = withTiming(target, timingConfig);
  }, [active, modalHeight, buttonTranslateY]);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    measuredHeightRef.current = height;
    setModalHeight((prev) => (prev === height ? prev : height));
  }, []);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          buttonTranslateY.value + legendTranslation.value * isActive.value,
      },
    ],
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslateY.value }],
  }));

  return (
    <Animated.View pointerEvents="box-none">
      <Animated.View
        style={[buttonContainerBaseStyle, buttonAnimatedStyle]}
        pointerEvents="box-none"
      >
        <ButtonRow>
          <CenterButton onPress={onCenter} active={centerButtonActive} />
        </ButtonRow>
      </Animated.View>
      <Animated.View style={modalAnimatedStyle} pointerEvents="box-none">
        <DirectionsModal
          {...modalProps}
          active={active}
          legendTranslation={legendTranslation}
          onContainerLayout={handleContainerLayout}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default BottomControls;
