import React from "react";
import { Pressable, Text, TextInput } from "react-native";
import { Bar, Container, SearchInput, SearchResultContainer } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {

}

export default function Searchbar(props: Props) {
    const [inputText, updateInputText] = React.useState("");
    const inputRef = React.useRef<TextInput>(null);

    const isFocused = inputRef.current?.isFocused();

    return (
        <Container>
            <Bar
                style={{
                    borderColor: isFocused ? "#7A0019" : "#BC808C",
                    borderBottomLeftRadius: isFocused ? 0 : 32,
                    borderBottomRightRadius: isFocused ? 0 : 32,
                }}
            >
                <SearchInput
                    placeholder="Where to?"
                    placeholderTextColor="#AB5E6E"
                    value={inputText}
                    onChangeText={updateInputText}
                    ref={inputRef}
                />
            </Bar>
            <SearchResultContainer style={{ display: isFocused ? "flex" : "none" }}>
            </SearchResultContainer>
        </Container>
    )
}
