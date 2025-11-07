import "styled-components/native";

export interface CustomTheme {
  name: string;
  fontSizes: {
    mini: number;
    normal: number;
    medium: number;
  };
  colors: {
    primary1: string;
    primary2: string;
    primary3: string;
    primary4: string;
    primary5: string;
    primaryMain: string;
    primary7: string;
    primary8: string;
    primary9: string;

    secondary1: string;
    secondary2: string;
    secondary3: string;
    secondary4: string;
    secondary5: string;
    secondaryMain: string;
    secondary7: string;
    secondary8: string;
    secondary9: string;

    contrast: string;

    neutral: string;
    success: string;
    error: string;
    info: string;

    tunnel1: string;
    tunnel2: string;

    skyway1: string;
    skyway2: string;

    sidewalk1: string;
    sidewalk2: string;

    gray1: string;
  };
}

declare module "styled-components/native" {
  export interface DefaultTheme extends CustomTheme {}
}
