import Animated, { Easing, FadeIn, FadeOut }from "react-native-reanimated";
import { StyledText } from "../../styles/global";
import CustomButton from "../CustomButton";
import {
  Container,
  Content,
} from "./styles";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const WarningCard = ({ setShowWarning }: { setShowWarning: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <AnimatedContainer
        entering={FadeIn.duration(500).easing(Easing.in(Easing.exp))}
        exiting={FadeOut.duration(400).easing(Easing.out(Easing.exp))}
    >
        <Content>
            <StyledText variant="large" weight="Bold" color="error" style={{textAlign: 'center'}}>
                Warning
            </StyledText>
            <StyledText variant="normal" style={{textAlign: 'center'}}>
                You seem to be far away from the intended area. This app is intended for walking navigation within
                the University of Minnesota Twin Cities campus (East Bank, West Bank, St Paul), and may not provide accurate directions for locations 
                outside of this area.
            </StyledText>
            <CustomButton
                label="I Understand"
                onPress={() => {
                    setShowWarning(false);
                }}
            />
        </Content>
    </AnimatedContainer>
    );
};

export default WarningCard;
