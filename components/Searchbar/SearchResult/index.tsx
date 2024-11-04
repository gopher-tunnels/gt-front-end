import React, { ComponentProps } from "react";
import {
  Container,
  BuildingIcon,
  BuildingTextContainer,
  BuildingName,
  BuildingAddress,
} from "./styles";
import house from "../../../assets/m-house.png";
import { buildings } from "../../../utils/mock";

type BuildingInfo = (typeof buildings)[number];

interface SearchResultProps extends ComponentProps<typeof Container> {
  building: BuildingInfo;
}

const SearchResult: React.FC<SearchResultProps> = ({ building, ...props }) => {
  return (
    <Container key={building.name} {...props}>
      <BuildingIcon source={house} />
      <BuildingTextContainer>
        <BuildingName>{building.name}</BuildingName>
        <BuildingAddress>{building.address}</BuildingAddress>
      </BuildingTextContainer>
    </Container>
  );
};

export default SearchResult;
