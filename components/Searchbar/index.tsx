import React, { ComponentProps, useEffect, useState } from "react";
import { Keyboard, ScrollView, TextInput } from "react-native";
import { Bar, Container, SearchInput, SearchResultContainer } from "./styles";
import { useTheme } from "styled-components/native";
import SearchResult from "./SearchResult";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomChip from "../CustomChip";
import { Destination } from "../../@types/api";
import Animated, { Easing, SlideInUp } from "react-native-reanimated";

type BuildingInfo = ComponentProps<typeof SearchResult>["building"];

const AnimatedContainer = Animated.createAnimatedComponent(Container);

interface SearchbarProps {
  // TODO: make required and modify logic to work with backend
  onSelectDestination?: (dest: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = () => {
  const theme = useTheme();
  const [inputText, updateInputText] = React.useState("");
  const [buildingResults, setBuildingResults] = React.useState<BuildingInfo[]>(
    [],
  ); // switch to TEMP_BUILDINGS to test
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>(
    // TODO: set to value from backend
    [
      { id: "Akerman Hall", name: "Akerman Hall" },
      { id: "Tate Hall", name: "Tate Hall" },
      { id: "Rapson Hall", name: "Rapson Hall" },
      { id: "Coffman Memorial Union", name: "Coffman Memorial Union" },
    ],
  );
  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () => {
      Keyboard.dismiss();
    });
    return () => subscription.remove();
  });

  const showResults =
    inputRef.current?.isFocused() && buildingResults.length > 0;

  return (
    <AnimatedContainer
      entering={SlideInUp.duration(500).easing(Easing.out(Easing.exp))}
      exiting={SlideInUp.duration(500).easing(Easing.out(Easing.exp))}
    >
      <Bar
        style={{
          borderColor: showResults
            ? theme.colors.primaryMain
            : theme.colors.primary3,
          borderBottomLeftRadius: showResults ? 0 : 32,
          borderBottomRightRadius: showResults ? 0 : 32,
          shadowColor: showResults
            ? theme.colors.secondary3
            : theme.colors.contrast,
        }}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={23}
          color={theme.colors.primary7}
        />
        <SearchInput
          style={{ paddingLeft: 14 }}
          placeholder="Where to?"
          selectionColor={theme.colors.primaryMain}
          cursorColor={theme.colors.primaryMain}
          placeholderTextColor={theme.colors.primary4}
          value={inputText}
          onChangeText={updateInputText}
          ref={inputRef}
        />
      </Bar>
      <SearchResultContainer style={{ display: showResults ? "flex" : "none" }}>
        <ScrollView>
          {buildingResults.map((building) => (
            <SearchResult key={building.address} building={building} />
          ))}
        </ScrollView>
      </SearchResultContainer>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingTop: 6 }}
        contentContainerStyle={{ gap: 6 }}
      >
        {popularDestinations.map((destination) => (
          <CustomChip
            key={destination.id}
            label={destination.name}
            type="default"
          />
        ))}
      </ScrollView>
    </AnimatedContainer>
  );
};

export default Searchbar;
