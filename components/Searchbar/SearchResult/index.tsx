import React from "react";
import { BuildingButton, BuildingIcon, BuildingTextContainer, BuildingName, BuildingAddress } from "./styles";
import house from "../../../assets/m-house.png";

type BuildingInfo = {name: string, address: string}

interface Props {
    building: BuildingInfo
}

export default function SearchResult({building}: Props) {
    return (
        <BuildingButton key={building.name}>
            <BuildingIcon source={house} />
            <BuildingTextContainer>
                <BuildingName>{building.name}</BuildingName>
                <BuildingAddress>{building.address}</BuildingAddress>
            </BuildingTextContainer>
        </BuildingButton>)
}
