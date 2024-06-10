import React from 'react';
import { Container, Mask, MaskWrapper } from './styles';
import { StyledText } from '../../styles/global';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import MaskedView from '@react-native-masked-view/masked-view';

interface CustomButtonProps extends React.ComponentProps<typeof Container> {
  label: string;
  loadingLabel?: string;
  CustomIcon?: React.ReactNode;
  loadingProgress?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  loadingLabel,
  style,
  variant,
  CustomIcon,
  loading,
  loadingProgress,
  ...props
}) => {
  const theme = useTheme();
  return (
    <MaskedView
      maskElement={
        <MaskWrapper>
          <Mask
            style={{
              transform: [{ scaleX: loading ? loadingProgress ?? 0 : 1 }],
            }}
          />
        </MaskWrapper>
      }
    >
      <Container
        {...props}
        disabled={loading}
        style={({ pressed }) => ({
          ...(pressed ? { opacity: 0.8 } : {}),
          ...((typeof style === 'function'
            ? style({ pressed })
            : style) as Object),
        })}
      >
        <StyledText
          variant="normal"
          weight={700}
          style={{
            color:
              !variant || variant === 'filled'
                ? 'white'
                : theme.colors.primaryMain,
          }}
        >
          {loading ? loadingLabel || label : label}
        </StyledText>
        {loading ? (
          <FontAwesome5
            name="hourglass"
            color={
              !variant || variant === 'filled'
                ? 'white'
                : theme.colors.primaryMain
            }
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
