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

/**
 * @description Customizable button that has optional icon, loading progress, and styles
 *
 * @param {string} label - The label that will appear on the button
 * @param {string} loadingLabel - The label of the button as it loads
 * @param {React.ReactNode} CustomIcon - A custom icon that appears on the button, to the right of the label, if any
 * @param {number} loadingProgress - loading progress
 * @param {ComponentProps<typeof MaskedView>["style"]} outerContainerStyle - The style of the button container
 * @param {boolean | null | undefined} disabled - Whether the press behavior is disabled.
 * @param {StyleProp<ViewStyle>} style - Either view styles or a function that receives a boolean reflecting whether the component is currently pressed and returns view styles.
 * @param {"filled" | "outlined" | undefined} variant - flips color scheme of button to look "filled" or "outlined" otherwise undefined
 * @param {boolean | undefined} loading - boolean value, if button loading or not
 *
 * @returns {React.FC<CustomButtonProps>} TSX React Functional Component
 *
 * @example
 * ```tsx
 * <CustomButton
 *   outerContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
 *   onPress={() =>
 *      setNavigationActive((prev) => {
 *        if (prev && onEndRoute) onEndRoute();
 *        if (!prev && onStartRoute) onStartRoute();
 *       return !prev;
 *     })
 *   }
 *   label={navigationActive ? "End" : "Go"}
 *   CustomIcon={navigationActive ? undefined : Go}
 *   variant={navigationActive ? "outlined" : "filled"}
 * />
 * ```
 */

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
            animate={{
              transform: [{ scaleX: loading ? (loadingProgress ?? 0) : 1 }],
            }}
            transition={{ type: "spring" }}
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
