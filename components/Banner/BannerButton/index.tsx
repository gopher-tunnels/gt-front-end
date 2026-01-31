import React from "react";
import { MotiPressableProps } from "moti/interactions";
import { defaultMotiPressableProps, StyledText } from "../../../styles/global";
import { Container } from "./styles";

interface BannerButtonProps extends MotiPressableProps {
  label: string;
}

const BannerButton: React.FC<BannerButtonProps> = ({ label, ...props }) => {
  return (
    <Container {...defaultMotiPressableProps} {...props}>
      <StyledText variant="miniHeader" style={{ color: "white" }}>
        {label}
      </StyledText>
    </Container>
  );
};

export default BannerButton;
