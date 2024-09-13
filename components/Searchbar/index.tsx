import React, { ComponentProps, useEffect, useState } from "react";
import { Dimensions, Keyboard, ScrollView, TextInput } from "react-native";
import { Bar, Container, SearchInput, SearchResultContainer } from "./styles";
import { useTheme } from "styled-components/native";
import SearchResult from "./SearchResult";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomChip from "../CustomChip";
import { Destination } from "../../@types/api";

type BuildingInfo = ComponentProps<typeof SearchResult>["building"];

const TEMP_BUILDINGS: BuildingInfo[] = [
  {
    name: "Ralph Rapson Hall",
    address: "89 Church St SE, Minneapolis, MN 55455",
  },
  { name: "Akerman Hall", address: "110 Union St SE, Minneapolis, MN 55455" },
  {
    name: "Coffman Memorial Union",
    address: "300 Washington Avenue SE, Minneapolis",
  },
];

interface Props {}

export default function Searchbar(props: Props) {
  const theme = useTheme();
  const [inputText, updateInputText] = React.useState("");
  const [buildingResults, setBuildingResults] = React.useState<BuildingInfo[]>(
    [],
  ); // switch to TEMP_BUILDINGS to test
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>(
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
    <Container>
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
        style={{ paddingTop: 6, marginHorizontal: -16 }}
        contentContainerStyle={{ gap: 6, paddingHorizontal: 16 }}
      >
        {popularDestinations.map((destination) => (
          <CustomChip
            key={destination.id}
            label={destination.name}
            type="default"
          />
        ))}
      </ScrollView>
    </Container>
  );
}
