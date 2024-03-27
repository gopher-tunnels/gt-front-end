import React from "react";
import { LocationDisplayContainer } from "./styles";

interface Props {
    type: "Start" | "End"
    location?: {
        name: string,
        address: string
    }
}

export default function LocationDisplay(props: Props) {
    return (
        <LocationDisplayContainer>
            
        </LocationDisplayContainer>
    )
}
