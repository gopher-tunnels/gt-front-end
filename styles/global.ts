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
  label: { weight: 500, size: "12rem" },
  miniHeader: { weight: 700, size: "14rem" },
  normal: { weight: 500, size: "16rem" },
  header: { weight: 700, size: "20rem" },
  large: { weight: 500, size: "24rem" },
  title: { weight: 800, size: "40rem" },
} as const;

interface StyledTextProps {
  variant?: keyof typeof variantMap;
  weight?: keyof typeof weightMap | (typeof weightMap)[keyof typeof weightMap];
  italic?: boolean;
}

export const StyledText = styled.Text<StyledTextProps>`
  font-family: PlusJakartaSans-${({ variant, weight, italic }) => `${(weightMap as Record<any, string>)[weight ?? variantMap[variant as keyof typeof variantMap]?.weight ?? 500] ?? weight}${italic ? "Italic" : ""}`};
  font-size: ${({ variant }) => variantMap[variant ?? "normal"].size};
  color: ${({ theme }) => theme.colors.contrast};
`;
// * StyledText <<<<<<
