import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Container,
  Content,
  IconTextContainer,
  InfoContainer,
  LegendContainer,
  PreNavContainer,
} from "./styles";
import { BottomSheetHandle, StyledText } from "../../styles/global";
import CustomChip from "../CustomChip";
import { View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../CustomButton";

import { HeadingContainer } from "./styles";
import { useTheme } from "styled-components/native";
import dayjs from "dayjs";
import duration, { DurationUnitsObjectType } from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  SlideInDown,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface DirectionsModalProps {
  destinationInfo: { id: string; name: string; opens: Date[]; closes: Date[] };
  eta: DurationUnitsObjectType;
  distance: { miles: number; meters: number };
}

const Clock = (
  <MaterialCommunityIcons name="clock-outline" color="gray" size={17} />
);

const Go = <MaterialIcons name="route" color="white" size={24} />;

const AnimatedInfoContainer = Animated.createAnimatedComponent(InfoContainer);

const AnimatedContainer = Animated.createAnimatedComponent(Container);

/**
 * @description Component from which the user can control and see information about their route and destination. Designed to appear on the bottom of the screen.
 *
 * @param {DirectionsModalProps['destinationInfo']} destinationInfo - Information about the destination. Must include an id and name, and an array of opening and closing times for each day of the week.
 * @param {DurationUnitsObjectType} eta - Object describing the Estimated Time to Arrival.
 * @param {{miles: number; meters: number;}} distance - Object describing the distance to the destination in miles and meters.
 *
 * @returns {React.FC<DirectionsModalProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <DirectionsModal
 *   destinationInfo={{
 *     id: "rapson-hall",
 *     name: "Ralph Rapson Hall",
 *     opens: Array.from(
 *       { length: 7 },
 *       () => new Date(2024, 8, 23, 9, 0, 0),
 *     ),
 *     closes: Array.from(
 *       { length: 7 },
 *       () => new Date(2024, 8, 23, 19, 0, 0),
 *     ),
 *   }}
 *   distance={{ miles: 0.1, meters: 0.2 }}
 *   eta={{ minutes: 6 }} />
 * ```
 */
const DirectionsModal: React.FC<DirectionsModalProps> = ({
  destinationInfo,
  eta,
  distance,
}) => {
  // setup hooks
  const theme = useTheme();
  // states
  const [navigationActive, setNavigationActive] = useState(false);
  // refs
  const topInfoContainerDefaultHeight = useRef(-1);
  // animated style values
  const sideInfoContainerFlexGrow = useSharedValue(navigationActive ? 1 : 0);
  const topInfoContainerHeight = useSharedValue(-1);
  const topInfoContainerMarginBottom = useSharedValue(12);
  const bottomSheetTranslation = useSharedValue(0);
  // legend bottom sheet utils
  const snapPoints = useMemo(() => [0, 100], []);
  const lastSnapPoint = useRef(snapPoints[0]);

  // pan gesture handlers for the legend bottom sheet
  const handlePanChange = useCallback(
    (
      e:
        | GestureStateChangeEvent<PanGestureHandlerEventPayload>
        | GestureUpdateEvent<
            PanGestureHandlerEventPayload & PanGestureChangeEventPayload
          >,
    ) => {
      "worklet";
      bottomSheetTranslation.value = e.translationY + lastSnapPoint.current;
    },
    [bottomSheetTranslation],
  );
  const handlePanFinalize = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      "worklet";
      const target = snapPoints.reduce(
        (acc, curr) =>
          Math.abs(e.translationY - curr) < Math.abs(e.translationY - acc)
            ? curr
            : acc,
        0,
      );
      bottomSheetTranslation.value = withSpring(target, {
        damping: 25,
        stiffness: 350,
      });
      lastSnapPoint.current = target;
    },
    [snapPoints, bottomSheetTranslation],
  );
  const pan = Gesture.Pan()
    .runOnJS(true)
    .onStart(handlePanChange)
    .onChange(handlePanChange)
    .onFinalize(handlePanFinalize);

  const dayjsEta = useMemo(() => {
    return dayjs.duration(eta);
  }, [JSON.stringify(eta)]);

  // boolean representing whether the building is currently open
  const isOpen = useMemo(() => {
    const now = dayjs();
    const opensToday = dayjs(destinationInfo.opens[now.day()])
      .year(now.year())
      .month(now.month())
      .date(now.date());
    const closesToday = dayjs(destinationInfo.closes[now.day()])
      .year(now.year())
      .month(now.month())
      .date(now.date());

    return now.isAfter(opensToday) && now.isBefore(closesToday);
  }, [destinationInfo.opens, destinationInfo.closes]);

  // transition animations
  useEffect(() => {
    const timingConfig = {
      duration: 700,
      easing: Easing.out(Easing.exp),
    } as const;
    sideInfoContainerFlexGrow.value = withTiming(
      navigationActive ? 1 : 0,
      timingConfig,
    );
    if (topInfoContainerDefaultHeight.current !== -1)
      topInfoContainerHeight.value = withTiming(
        navigationActive ? 0 : topInfoContainerDefaultHeight.current,
        timingConfig,
      );
    topInfoContainerMarginBottom.value = withTiming(
      navigationActive ? 0 : 12,
      timingConfig,
    );
  }, [navigationActive]);

  return (
    <AnimatedContainer
      entering={SlideInDown.duration(500).easing(Easing.out(Easing.exp))}
    >
      <Animated.View
        style={{ transform: [{ translateY: bottomSheetTranslation }] }}
      >
        <GestureDetector gesture={pan}>
          <BottomSheetHandle />
        </GestureDetector>
        <Content>
          <StyledText variant="miniHeader">Legend</StyledText>
          <LegendContainer>
            <CustomChip label="Tunnel" type="tunnel" style={{ flexGrow: 1 }} />
            <CustomChip label="Skyway" type="skyway" style={{ flexGrow: 1 }} />
            <CustomChip
              label="Sidewalk"
              type="sidewalk"
              style={{ flexGrow: 1 }}
            />
          </LegendContainer>
        </Content>
      </Animated.View>
      <Content style={{ gap: 0, flexDirection: "column" }}>
        <AnimatedInfoContainer // * TOP
          style={{
            height: topInfoContainerHeight,
            marginBottom: topInfoContainerMarginBottom,
          }}
          onLayout={(e) => {
            if (
              topInfoContainerDefaultHeight.current === -1 &&
              e.nativeEvent.layout.height > 0
            ) {
              topInfoContainerDefaultHeight.current =
                e.nativeEvent.layout.height;
              topInfoContainerHeight.value = e.nativeEvent.layout.height;
            }
          }}
        >
          <HeadingContainer>
            <StyledText variant="header">{destinationInfo.name}</StyledText>
            <IconTextContainer>
              <MaterialIcons name="directions-walk" size={16} />
              <StyledText>{dayjsEta.humanize()}</StyledText>
            </IconTextContainer>
          </HeadingContainer>
          <IconTextContainer>
            {Clock}
            <StyledText style={{ color: isOpen ? "green" : "red" }}>
              {isOpen ? "Open" : "Closed"} now
            </StyledText>
            <StyledText style={{ color: "gray" }}>
              ⋅ {isOpen ? "Closes" : "Opens"} at{" "}
              {isOpen
                ? dayjs(destinationInfo.closes[dayjs().day()]).format("HH:MM")
                : dayjs(destinationInfo.opens[dayjs().day()]).format("HH:MM")}
            </StyledText>
          </IconTextContainer>
        </AnimatedInfoContainer>

        <PreNavContainer
          style={{
            flexDirection: "row",
            flexGrow: 1,
          }}
        >
          <AnimatedInfoContainer // * LEFT
            style={{
              flexGrow: sideInfoContainerFlexGrow,
              minWidth: 0,
              flexBasis: 0,
              overflow: "hidden",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <StyledText
                numberOfLines={1}
                ellipsizeMode="clip"
                variant="large"
                weight="Bold"
                style={{ color: theme.colors.primaryMain }}
              >
                {`${dayjsEta.hours() ? dayjsEta.hours() + "h" : ""}${dayjsEta.minutes() + (dayjsEta.hours() ? "m" : " min")}`}
              </StyledText>
              <StyledText
                style={{ color: "gray" }}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {" "}
                ⋅ {distance.miles} mi
              </StyledText>
            </View>
            <IconTextContainer>
              <StyledText
                style={{ color: "green" }}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                ETA {dayjs().add(dayjsEta).format("HH:MM")}
              </StyledText>
              <MaterialIcons name="directions-walk" size={16} color="gray" />
            </IconTextContainer>
          </AnimatedInfoContainer>
          <CustomButton
            outerContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
            onPress={() => setNavigationActive((prev) => !prev)}
            label={navigationActive ? "End" : "Go"}
            CustomIcon={navigationActive ? undefined : Go}
            variant={navigationActive ? "outlined" : "filled"}
          />
        </PreNavContainer>
      </Content>
    </AnimatedContainer>
  );
};

export default DirectionsModal;
