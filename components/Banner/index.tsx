import React, { useEffect, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Container, SideContainer, TextContainer } from "./styles";
import { StyledText } from "../../styles/global";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerButton from "./BannerButton";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import Animated, {
  FadeInRight,
  FadeOutRight,
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { MotiView } from "moti";

interface BannerProps {
  title: string;
  description: string;
  noButton?: boolean;
  retryCooldown?: number;
  onPressButton?: () => void;
  retries?: number;
}

const foregroundColor = "#fff";

const Banner: React.FC<BannerProps> = ({
  title,
  description,
  retryCooldown,
  onPressButton,
  retries,
  noButton,
}) => {
  const insets = useSafeAreaInsets();
  const totalTime = retryCooldown || 10;
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [resetToken, setResetToken] = useState(0);
  const [started, setStarted] = useState(false);
  const shakeX = useSharedValue(0);
  const hasMountedRetries = useRef(false);
  const previousRetries = useRef<BannerProps["retries"]>(retries);

  useEffect(() => {
    if (!started) return;

    const startTime = Date.now();
    setTimeLeft(totalTime);
    const intervalId = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const remaining = Math.max(totalTime - elapsedSeconds, 0);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [resetToken, totalTime, started]);

  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference * (1 - progress);
  const displayValue = Math.max(0, Math.ceil(timeLeft));
  const isRunning = started && displayValue > 0;

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  useEffect(() => {
    if (hasMountedRetries.current && previousRetries.current !== retries) {
      shakeX.value = 10;
      shakeX.value = withSpring(0, {
        damping: 3,
        stiffness: 250,
        mass: 0.5,
      });
    }

    hasMountedRetries.current = true;
    previousRetries.current = retries;
  }, [retries, shakeX]);

  const restartTimer = () => {
    setStarted(true);
    setResetToken((prev) => prev + 1);
    setTimeLeft(totalTime);
  };

  return (
    <Container
      style={{ paddingTop: insets.top }}
      entering={SlideInUp.springify()}
      exiting={SlideOutUp.springify().mass(200)}
    >
      <Animated.View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            gap: 15,
          },
          shakeStyle,
        ]}
      >
        <SideContainer>
          <MaterialIcons name="error" size={24} color={foregroundColor} />
        </SideContainer>
        <TextContainer>
          <StyledText variant="miniHeader" style={{ color: foregroundColor }}>
            {title}
          </StyledText>
          <StyledText variant="label" style={{ color: foregroundColor }}>
            {description}
          </StyledText>
        </TextContainer>
        {!noButton && (
          <SideContainer>
            {isRunning && (
              <Animated.View
                entering={FadeInRight.springify()}
                exiting={FadeOutRight.springify()}
                style={{ position: "absolute", right: 12 }}
              >
                <Svg
                  width={30}
                  height={30}
                  viewBox="0 0 30 30"
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  <SvgText
                    x="50%"
                    y="50%"
                    dy="0.1em"
                    fill={foregroundColor}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {displayValue}
                  </SvgText>
                  <Circle
                    cy={15}
                    cx={15}
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    stroke={foregroundColor}
                    fill="transparent"
                    transform="rotate(-90 15 15)"
                    strokeLinecap="round"
                  />
                </Svg>
              </Animated.View>
            )}
            <MotiView
              animate={{
                opacity: isRunning ? 0 : 1,
                translateX: isRunning ? -10 : 0,
              }}
            >
              <BannerButton
                disabled={isRunning}
                label="Retry"
                onPress={
                  onPressButton
                    ? () => {
                        onPressButton();
                        restartTimer();
                      }
                    : restartTimer
                }
              />
            </MotiView>
          </SideContainer>
        )}
      </Animated.View>
    </Container>
  );
};

export default Banner;
