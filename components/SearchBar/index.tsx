import React, { useState } from "react";
import { View, Text } from "react-native";

import { ReturnButton, SearchContainer } from "./styles";
import LocationDisplay from "./LocationDisplay";

/*
State corresponds to frames on the figma
    Closed: Main-page(map)
    Open: Enter destination A to B
    Confirming: Route Confirmation
    Directing: Other stuff afterwards
*/
type barState = "Closed" | "Open" | "Confirming" | "Directing"

interface Props {}

export default function SearchBar(props: Props) {
    const [barState, setBarState] = useState<barState>("Closed");
    return (
        <SearchContainer>
            {barState === "Open" || barState === "Confirming" && (
                <>
                <ReturnButton>&lt; Return</ReturnButton>
                <LocationDisplay type="Start" />
                <LocationDisplay type="End" />
                </>
            )}
                
            <Text>Where to?</Text>
        </SearchContainer>
    )
}
