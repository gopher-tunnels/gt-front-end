import React, { useMemo, useState } from "react";
import {
  Container,
  Content,
  IconTextContainer,
  InfoContainer,
  LegendContainer,
  PreNavContainer,
} from "./styles";
import { StyledText } from "../../styles/global";
import CustomChip from "../CustomChip";
import { View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../CustomButton";

import { HeadingContainer } from "./styles";
import { useTheme } from "styled-components/native";
import dayjs from "dayjs";

interface DirectionsModalProps {
  destinationInfo: { id: string; name: string; opens: string; closes: string };
  minsRemaining: number;
  distance: number;
}

const Clock = (
  <MaterialCommunityIcons name="clock-outline" color="gray" size={17} />
);

const Go = <MaterialIcons name="route" color="white" size={24} />;

const DirectionsModal: React.FC<DirectionsModalProps> = ({
  destinationInfo,
  minsRemaining,
  distance,
}) => {
  const theme = useTheme();
  const [navigationActive, setNavigationActive] = useState(true);

  const isOpen = useMemo(() => {
    const now = dayjs();
    const [opensH, opensM] = destinationInfo.opens
      .split(":")
      .map((x) => parseInt(x));
    const [closesH, closesM] = destinationInfo.closes
      .split(":")
      .map((x) => parseInt(x));
    if (
      now.hour() < opensH ||
      now.minute() < opensM ||
      now.hour() > closesH ||
      now.minute() > closesM
    )
      return false;
    return true;
  }, []);

  return (
    <Container>
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
      <Content style={{ gap: 24, flexDirection: "row", alignItems: "center" }}>
        {navigationActive && (
          <InfoContainer>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <StyledText
                variant="large"
                weight="Bold"
                style={{ color: theme.colors.primaryMain }}
              >
                {minsRemaining} min
              </StyledText>
              <StyledText style={{ color: "gray" }}>
                {" "}
                ⋅ {distance} miles
              </StyledText>
            </View>
            <IconTextContainer>
              <StyledText style={{ color: "green" }}>
                ETA {dayjs().add(minsRemaining).format("HH:MM")}
              </StyledText>
              <MaterialIcons name="directions-walk" size={16} color="gray" />
            </IconTextContainer>
          </InfoContainer>
        )}
        <PreNavContainer style={{ flexGrow: 1 }}>
          {!navigationActive && (
            <InfoContainer>
              <HeadingContainer>
                <StyledText variant="header">{destinationInfo.name}</StyledText>
                <IconTextContainer>
                  <MaterialIcons name="directions-walk" size={16} />
                  <StyledText>{minsRemaining} min</StyledText>
                </IconTextContainer>
              </HeadingContainer>
              <IconTextContainer>
                {Clock}
                <StyledText style={{ color: isOpen ? "green" : "red" }}>
                  {isOpen ? "Open" : "Closed"} now
                </StyledText>
                <StyledText style={{ color: "gray" }}>
                  ⋅ {isOpen ? "Closes" : "Opens"} at{" "}
                  {isOpen ? destinationInfo.opens : destinationInfo.closes}
                </StyledText>
              </IconTextContainer>
            </InfoContainer>
          )}
          <CustomButton
            onPress={() => setNavigationActive((prev) => !prev)}
            label={navigationActive ? "End" : "Go"}
            CustomIcon={navigationActive ? undefined : Go}
            variant={navigationActive ? "outlined" : "filled"}
          />
        </PreNavContainer>
      </Content>
    </Container>
  );
};

export default DirectionsModal;
