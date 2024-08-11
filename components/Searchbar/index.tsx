import React, { useEffect } from "react";
import { Keyboard, ScrollView, TextInput } from "react-native";
import { Bar, BuildingAddress, BuildingButton, BuildingIcon, BuildingName, BuildingTextContainer, Container, MagnifyingGlass, SearchInput, SearchResultContainer } from "./styles";
import { useTheme } from "styled-components/native";
import magnifyingGlass from "../../assets/magnifying-glass.png";
import house from "../../assets/m-house.png";

const TEMP_BUILDINGS = [
    {name: "Ralph Rapson Hall", address: "89 Church St SE, Minneapolis, MN 55455"},
    {name: "Akerman Hall", address: "110 Union St SE, Minneapolis, MN 55455"},
    {name: "Coffman Memorial Union", address: "300 Washington Avenue SE, Minneapolis"},
]

interface Props {

}

export default function Searchbar(props: Props) {
    const theme = useTheme();
    const [inputText, updateInputText] = React.useState("");
    const inputRef = React.useRef<TextInput>(null);

    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            Keyboard.dismiss();
        });
        return () => subscription.remove();
    })

    const isFocused = inputRef.current?.isFocused();

    return (
        <Container>
            <ScrollView>
                <Bar
                    style={{
                        borderColor: isFocused ? theme.colors.primaryMain : "#BC808C",
                        borderBottomLeftRadius: isFocused ? 0 : 32,
                        borderBottomRightRadius: isFocused ? 0 : 32,
                        shadowColor: isFocused ? "#FFE9B9" : "rgba(0,0,0,0)",
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
                <SearchResultContainer style={{ display: isFocused ? "flex" : "none" }}>
                    {TEMP_BUILDINGS.map((building) => (
                        <BuildingButton key={building.name}>
                            <BuildingIcon source={house} />
                            <BuildingTextContainer>
                                <BuildingName>{building.name}</BuildingName>
                                <BuildingAddress>{building.address}</BuildingAddress>
                            </BuildingTextContainer>
                        </BuildingButton>
                    ))}
                </SearchResultContainer>
            </ScrollView>
        </Container>
    )
}
