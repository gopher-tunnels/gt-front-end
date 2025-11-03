import React, { ComponentProps } from "react";
import {
  Container,
  BuildingIcon,
  BuildingTextContainer,
  BuildingName,
  BuildingAddress,
} from "./styles";
import house from "../../../assets/m-house.png";
import { GetSearchResponse } from "../../../@types/api";

interface SearchResultProps extends ComponentProps<typeof Container> {
  building: GetSearchResponse[number];
}

const SearchResult: React.FC<SearchResultProps> = ({ building, ...props }) => {
  return (
    <Container {...props}>
      <BuildingIcon source={house} />
      <BuildingTextContainer>
        <BuildingName>{building.buildingName}</BuildingName>
        <BuildingAddress>{building.address}</BuildingAddress>
      </BuildingTextContainer>
    </Container>
  );
};

export default SearchResult;
