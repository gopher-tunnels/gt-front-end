import React, { ComponentProps, useEffect } from "react";
import { Keyboard, ScrollView, TextInput } from "react-native";
import { Bar, Container, MagnifyingGlass, SearchInput, SearchResultContainer } from "./styles";
import { useTheme } from "styled-components/native";
import magnifyingGlass from "../../assets/magnifying-glass.png";
import SearchResult from "./SearchResult";

type BuildingInfo = ComponentProps<typeof SearchResult>['building']

const TEMP_BUILDINGS: BuildingInfo[] = [
    {name: "Ralph Rapson Hall", address: "89 Church St SE, Minneapolis, MN 55455"},
    {name: "Akerman Hall", address: "110 Union St SE, Minneapolis, MN 55455"},
    {name: "Coffman Memorial Union", address: "300 Washington Avenue SE, Minneapolis"},
]

interface Props {

}

export default function Searchbar(props: Props) {
    const theme = useTheme();
    const [inputText, updateInputText] = React.useState("");
    const [buildingResults, setBuildingResults] = React.useState<BuildingInfo[]>([]); // switch to TEMP_BUILDINGS to test
    const inputRef = React.useRef<TextInput>(null);

    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            Keyboard.dismiss();
        });
        return () => subscription.remove();
    })

    const showResults = inputRef.current?.isFocused() && buildingResults.length > 0;

    return (
        <Container>
            <Bar
                style={{
                    borderColor: showResults ? theme.colors.primaryMain : theme.colors.primary3,
                    borderBottomLeftRadius: showResults ? 0 : 32,
                    borderBottomRightRadius: showResults ? 0 : 32,
                    shadowColor: showResults ? theme.colors.secondary3 : theme.colors.contrast,
                }}
            >
                <MagnifyingGlass source={magnifyingGlass} />
                <SearchInput
                    placeholder="Where to?"
                    cursorColor={theme.colors.primary4}
                    placeholderTextColor={theme.colors.primary4}
                    value={inputText}
                    onChangeText={updateInputText}
                    ref={inputRef}
                />
            </Bar>
            <SearchResultContainer style={{ display: showResults ? "flex" : "none" }}>
                <ScrollView>
                    {buildingResults.map(building => <SearchResult key={building.address} building={building} />)}
                </ScrollView>
            </SearchResultContainer>
        </Container>
    )
}
