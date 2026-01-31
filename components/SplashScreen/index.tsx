import React, { ComponentProps, forwardRef } from "react";
import { Container } from "./styles";
import LottieView, { LottieViewProps } from "lottie-react-native";
import LogoAnimationIn from "../../assets/lottie/animated-logo-in.json";
import LogoAnimationOut from "../../assets/lottie/animated-logo-out.json";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SplashScreenProps extends Omit<LottieViewProps, "source"> {
  animatedContainerProps?: ComponentProps<typeof Container>;
  variant?: "in" | "out";
}

// eslint-disable-next-line react/display-name
const SplashScreen = forwardRef<LottieView, SplashScreenProps>(
  ({ variant = "out", animatedContainerProps, ...props }, ref) => {
    return (
      <Container {...animatedContainerProps}>
        <LottieView
          ref={ref}
          source={variant === "out" ? LogoAnimationOut : LogoAnimationIn}
          style={{ flex: 1 }}
          loop={false}
          {...props}
        />
      </Container>
    );
  },
);

export default SplashScreen;
