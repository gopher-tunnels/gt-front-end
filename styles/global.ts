import styled from "styled-components/native";

// * StyledText >>>>>>
const weightMap = {
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
} as const;

const variantMap = {
  label: { weight: 500, size: 12 },
  miniHeader: { weight: 700, size: 14 },
  normal: { weight: 500, size: 16 },
  header: { weight: 700, size: 20 },
  large: { weight: 500, size: 24 },
  title: { weight: 800, size: 40 },
} as const;

interface StyledTextProps {
  variant?: keyof typeof variantMap;
  weight?: keyof typeof weightMap | (typeof weightMap)[keyof typeof weightMap];
  italic?: boolean;
}

export const StyledText = styled.Text<StyledTextProps>`
  font-family: PlusJakartaSans-${({ variant, weight, italic }) => `${(weightMap as Record<any, string>)[weight ?? variantMap[variant as keyof typeof variantMap]?.weight ?? 500] ?? weight}${italic ? "Italic" : ""}`};
  font-size: ${({ variant }) => variantMap[variant ?? "normal"].size}px;
  color: ${({ theme }) => theme.colors.contrast};
`;
// * StyledText <<<<<<

export const BottomSheetHandle = styled.View`
  height: 5px;
  width: 50px;
  background-color: ${({ theme }) => theme.colors.neutral};
  align-self: center;
  border-radius: 8px;
  margin-vertical: 8px;
`;
