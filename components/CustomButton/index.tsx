import React, { ComponentProps } from "react";
import { Container, Mask, MaskWrapper } from "./styles";
import { StyledText } from "../../styles/global";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import MaskedView from "@react-native-masked-view/masked-view";

interface CustomButtonProps extends React.ComponentProps<typeof Container> {
  label: string;
  loadingLabel?: string;
  CustomIcon?: React.ReactNode;
  loadingProgress?: number;
  outerContainerStyle: ComponentProps<typeof MaskedView>["style"];
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  disabled,
  loadingLabel,
  style,
  outerContainerStyle,
  variant,
  CustomIcon,
  loading,
  loadingProgress,
  ...props
}) => {
  const theme = useTheme();
  return (
    <MaskedView
      style={outerContainerStyle}
      maskElement={
        <MaskWrapper>
          <Mask
            style={{
              transform: [{ scaleX: loading ? (loadingProgress ?? 0) : 1 }],
            }}
          />
        </MaskWrapper>
      }
    >
      <Container
        {...props}
        disabled={loading || disabled}
        style={({ pressed }) => ({
          ...(pressed ? { opacity: 0.8 } : {}),
          ...((typeof style === "function"
            ? style({ pressed })
            : style) as object),
        })}
        variant={variant}
      >
        <StyledText
          variant="normal"
          weight={700}
          style={{
            color: variant === "outlined" ? theme.colors.primaryMain : "white",
          }}
        >
          {loading ? loadingLabel || label : label}
        </StyledText>
        {loading ? (
          <FontAwesome5
            name="hourglass"
            color={variant === "outlined" ? theme.colors.primaryMain : "white"}
            size={20}
          />
        ) : (
          !!CustomIcon && CustomIcon
        )}
      </Container>
    </MaskedView>
  );
};

export default CustomButton;
