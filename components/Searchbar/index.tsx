import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { Bar, Container, SearchInput, SearchResultContainer } from "./styles";
import { useTheme } from "styled-components/native";
import SearchResult from "./SearchResult";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomChip from "../CustomChip";
import Animated, {
  Easing,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { getPopular, getSearchResults } from "../../services/api";
import { GetPopularResponse, GetSearchResponse } from "../../@types/api";

type BuildingInfo = GetSearchResponse[number];

const AnimatedContainer = Animated.createAnimatedComponent(Container);

interface SearchbarProps extends ComponentProps<typeof SearchInput> {
  onSelectDestination: (
    dest: BuildingInfo | GetPopularResponse[number],
  ) => void;
}

/**
 * @description A styled search bar with text input
 *
 * @param {((dest: BuildingInfo) => void) | undefined} onSelectDestination - function to run when user selects a destination from the search bar. Function takes parameter of type BuildingInfo and doesn't return anything
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
  const [buildingResults, setBuildingResults] = useState<GetSearchResponse>([]);
  const [popularDestinations, setPopularDestinations] =
    useState<GetPopularResponse>([]);
  const inputRef = useRef<TextInput | null>(null);

  const showResults =
    inputRef.current?.isFocused() && buildingResults.length > 0 && inputText;

  useEffect(() => {
    (async () => {
      try {
        console.log("popular destinations: ", await getPopular());
        setPopularDestinations(await getPopular());
      } catch (e) {
        console.log("error getting popular routes: ", e);
      }
    })();
  }, []);

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
          placeholder="Where to?"
          selectionColor={theme.colors.primaryMain}
          cursorColor={theme.colors.primaryMain}
          placeholderTextColor={theme.colors.primary4}
          value={inputText}
          onChangeText={async (newVal) => {
            setInputText(newVal);
            // TODO: modify search logic
            if (newVal)
              setBuildingResults(await getSearchResults(newVal.toLowerCase()));
          }}
          {...props}
          ref={inputRef}
        />
      </Bar>
      <SearchResultContainer style={{ display: showResults ? "flex" : "none" }}>
        <ScrollView>
          {buildingResults.map((building) => (
            <SearchResult
              key={building.id}
              building={building}
              onPress={() => {
                onSelectDestination(building);
                setInputText("");
              }}
            />
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
          {popularDestinations?.slice(0, 5).map((destination) => (
            <CustomChip
              onPress={() => {
                if (onSelectDestination) onSelectDestination(destination);
              }}
              key={destination.id}
              label={destination.buildingName}
              type="default"
            />
          ))}
        </ScrollView>
      )}
    </AnimatedContainer>
  );
};

export default Searchbar;
