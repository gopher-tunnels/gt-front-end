import React, { ComponentProps, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { Bar, Container, SearchInput, SearchResultContainer } from "./styles";
import { useTheme } from "styled-components/native";
import SearchResult from "./SearchResult";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomChip from "../CustomChip";
import Animated, { Easing, SlideInUp, SlideOutUp } from "react-native-reanimated";
import { buildings } from "../../utils/mock";

type BuildingInfo = ComponentProps<typeof SearchResult>["building"];

const AnimatedContainer = Animated.createAnimatedComponent(Container);

interface SearchbarProps extends ComponentProps<typeof SearchInput> {
  // TODO: make required and modify logic to work with backend
  onSelectDestination?: (dest: BuildingInfo) => void;
}

/**
 * @description A styled search bar with text input
 *
 * @param {DefaultTheme} theme -  
 * @param {number} current - 
 * 
 * @returns {React.FC<CustomChipProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <SearchBar
 *   onFocus={() => setDestination(null)}
 *   onSelectDestination={(destination) => {
 *     adjustMapToRoute(destination);
 *   }}
 * />
 * ```
 */

const Searchbar: React.FC<SearchbarProps> = ({
  onSelectDestination,
  ...props
}) => {
  const theme = useTheme();
  const [inputText, setInputText] = React.useState("");
  const [buildingResults, setBuildingResults] = React.useState<BuildingInfo[]>(
    [],
  );
  const [popularDestinations, setPopularDestinations] = useState<
    BuildingInfo[]
  >(
    // TODO: set to value from backend
    buildings,
  );
  const inputRef = React.useRef<TextInput | null>(null);

  const showResults =
    inputRef.current?.isFocused() && buildingResults.length > 0;

  return (
    <AnimatedContainer
      entering={SlideInUp.duration(500).easing(Easing.out(Easing.exp))}
      exiting={SlideOutUp.duration(500).easing(Easing.in(Easing.exp))}
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
          onChangeText={(newVal) => {
            setInputText(newVal);
            // TODO: modify search logic
            setBuildingResults(
              newVal
                ? buildings.filter((building) =>
                    building.name.toLowerCase().includes(newVal.toLowerCase()),
                  )
                : [],
            );
          }}
          {...props}
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
      {!showResults && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingTop: 6, overflow: "visible" }}
          contentContainerStyle={{ gap: 6 }}
        >
          {popularDestinations.slice(0, 5).map((destination) => (
            <CustomChip
              onPress={() => {
                if (onSelectDestination) onSelectDestination(destination);
              }}
              key={destination.id}
              label={destination.name}
              type="default"
            />
          ))}
        </ScrollView>
      )}
    </AnimatedContainer>
  );
};

export default Searchbar;
