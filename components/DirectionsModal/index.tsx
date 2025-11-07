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

import { Skeleton } from "moti/skeleton";

import { HeadingContainer } from "./styles";
import { useTheme } from "styled-components/native";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import type { LayoutChangeEvent } from "react-native";
import { BuildingInfo } from "../../@types/api";
import { formatDurationShort, secondsToDuration } from "../../utils/functions";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const legendChipsData = [
  { label: "Tunnel", type: "tunnel" },
  { label: "Skyway", type: "skyway" },
  { label: "Sidewalk", type: "sidewalk" },
] as const;

export interface DirectionsModalProps {
  active?: boolean;
  destinationInfo: {
    id: string;
    name: string;
    opens: BuildingInfo["opens"];
    closes: BuildingInfo["closes"];
  };
  eta: number | null;
  routeProgress?: number;
  distance: { miles: number; meters: number };
  onStartRoute?: () => void;
  onEndRoute?: () => void;
  loading?: boolean;
  loadingProgress?: number;
  startRouteDisabled?: boolean;
}

const Clock = (
  <MaterialCommunityIcons name="clock-outline" color="gray" size={17} />
);

const Go = <MaterialIcons name="route" color="white" size={24} />;

const AnimatedInfoContainer = Animated.createAnimatedComponent(InfoContainer);

interface DirectionsModalComponentProps extends DirectionsModalProps {
  legendTranslation: SharedValue<number>;
  onContainerLayout?: (event: LayoutChangeEvent) => void;
}

/**
 * @description Component from which the user can control and see information about their route and destination. Designed to appear on the bottom of the screen.
 *
 * @param {DirectionsModalProps['destinationInfo']} destinationInfo - Information about the destination. Must include an id and name, and an array of opening and closing times for each day of the week.
 * @param {DurationUnitsObjectType} eta - Object describing the Estimated Time to Arrival.
 * @param {{miles: number; meters: number;}} distance - Object describing the distance to the destination in miles and meters.
 * @param {(() => void) | undefined} onStartRoute - function to run on route start. Function doesn't take parameters and returns nothing
 * @param {(() => void) | undefined} onEndRoute - function to run on route end. Function doesn't take parameters and returns nothing
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
 *   eta={{ minutes: 6 }}
 *   onStartRoute={() => setOnRoute(true)}
 *   onEndRoute={() => setOnRoute(false)}
 * />
 *
 * ```
 */

const DirectionsModal: React.FC<DirectionsModalComponentProps> = ({
  active,
  destinationInfo,
  eta,
  routeProgress,
  distance,
  onStartRoute,
  onEndRoute,
  loading,
  loadingProgress,
  legendTranslation,
  onContainerLayout,
  startRouteDisabled,
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
      legendTranslation.value = e.translationY + lastSnapPoint.current;
    },
    [legendTranslation],
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
      legendTranslation.value = withSpring(target, {
        damping: 60,
        stiffness: 1000,
      });
      lastSnapPoint.current = target;
    },
    [snapPoints, legendTranslation],
  );
  const pan = Gesture.Pan()
    .runOnJS(true)
    .onStart(handlePanChange)
    .onChange(handlePanChange)
    .onFinalize(handlePanFinalize);

  const dayjsEta = useMemo(() => {
    return secondsToDuration(eta * (routeProgress || 1));
  }, [eta, routeProgress]);

  const formattedDayjsEta = useMemo(() => {
    return formatDurationShort(dayjsEta);
  }, [dayjsEta]);

  // boolean representing whether the building is currently open
  const isOpen = useMemo(() => {
    const now = dayjs();
    if (destinationInfo?.opens[now.day()] === "") return false;
    const opensToday = dayjs(destinationInfo?.opens?.[now.day()])
      .year(now.year())
      .month(now.month())
      .date(now.date());
    const closesToday = dayjs(destinationInfo?.closes?.[now.day()])
      .year(now.year())
      .month(now.month())
      .date(now.date());

    return now.isAfter(opensToday) && now.isBefore(closesToday);
  }, [destinationInfo.opens, destinationInfo.closes]);

  const nextOpening = useMemo(() => {
    if (!destinationInfo?.opens?.length) return null;
    const now = dayjs();
    for (let offset = 0; offset < 7; offset++) {
      const dayIndex = (now.day() + offset) % 7;
      const openRaw = destinationInfo.opens?.[dayIndex];
      if (!openRaw) continue;
      const base = dayjs(openRaw);
      if (!base.isValid()) continue;
      const candidate = base
        .year(now.year())
        .month(now.month())
        .date(now.date())
        .add(offset, "day");
      if (candidate.isBefore(now)) continue;
      return {
        time: candidate,
        offset,
      };
    }
    return null;
  }, [destinationInfo.opens]);

  const nextOpeningText = useMemo(() => {
    if (!nextOpening) return null;
    const suffix =
      nextOpening.offset <= 1
        ? " tomorrow"
        : nextOpening.offset > 1
          ? ` on ${nextOpening.time.format("dddd")}`
          : "";
    return `${nextOpening.time.format("h:mmA")}${suffix}`;
  }, [nextOpening]);

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

  const legendAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: legendTranslation.value }],
  }));

  const pointerEvents = active ? "auto" : "none";

  return (
    <Container pointerEvents={pointerEvents} onLayout={onContainerLayout}>
      <Animated.View style={legendAnimatedStyle}>
        <GestureDetector gesture={pan}>
          <BottomSheetHandle />
        </GestureDetector>
        <Content>
          <StyledText variant="miniHeader">Legend</StyledText>
          <LegendContainer>
            {legendChipsData.map((props) => (
              <CustomChip
                {...props}
                key={props.label}
                style={{ flexGrow: 1 }}
                interactive={false}
              />
            ))}
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
              <MaterialIcons
                name="directions-walk"
                size={16}
                color={theme.colors.contrast}
              />
              <Skeleton
                colorMode={theme.name === "dark" ? "dark" : "light"}
                show={loading || (eta == null && eta == undefined)}
              >
                <StyledText>
                  {eta !== null && eta !== undefined
                    ? dayjsEta.humanize()
                    : "x minutes"}
                </StyledText>
              </Skeleton>
            </IconTextContainer>
          </HeadingContainer>
          <IconTextContainer>
            {Clock}
            <StyledText color={isOpen ? "success" : "error"}>
              {isOpen ? "Open" : "Closed"} now
            </StyledText>
            <StyledText color="gray1">
              ⋅ {isOpen ? "Closes" : "Opens"} at{" "}
              {isOpen
                ? dayjs(destinationInfo?.closes?.[dayjs().day()]).format(
                    "h:mmA",
                  )
                : (nextOpeningText ??
                  (destinationInfo?.opens?.[dayjs().day()]
                    ? dayjs(destinationInfo.opens[dayjs().day()]).format(
                        "h:mmA",
                      )
                    : "—"))}
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
                {formattedDayjsEta}
              </StyledText>
              <StyledText
                style={{ color: "gray" }}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {" "}
                ⋅{" "}
                {distance.miles
                  ? `${distance.miles.toFixed(1)}\u00A0mi`
                  : `${distance.meters.toFixed(1)}\u00A0m`}
              </StyledText>
            </View>
            <IconTextContainer>
              <StyledText
                color="success"
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                ETA {dayjs().add(dayjsEta).format("h:mmA")}
              </StyledText>
              <MaterialIcons name="directions-walk" size={16} color="gray" />
            </IconTextContainer>
          </AnimatedInfoContainer>
          <CustomButton
            disabled={!!startRouteDisabled}
            loading={!navigationActive && loading}
            loadingProgress={loadingProgress}
            outerContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
            onPress={() =>
              setNavigationActive((prev) => {
                if (prev && onEndRoute) onEndRoute();
                if (!prev && onStartRoute) onStartRoute();
                return !prev;
              })
            }
            label={
              loading
                ? "Finding your route..."
                : navigationActive
                  ? "End"
                  : "Go"
            }
            CustomIcon={navigationActive ? undefined : Go}
            variant={navigationActive ? "outlined" : "filled"}
          />
        </PreNavContainer>
      </Content>
    </Container>
  );
};

export default DirectionsModal;
