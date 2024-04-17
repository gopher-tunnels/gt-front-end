import { ViewProps } from 'react-native';
import styled from 'styled-components/native';

interface ContainerProps extends ViewProps {
    height: number;
    padded: boolean;
    outerBackgroundColor: string;
}
  
interface ContentProps extends ViewProps {
    height: number;
    padded: boolean;
    progress: number;
    innerBackgroundColor: string;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  border-radius: 16px;
  align-items: flex-start;
  justify-content: center;
  height: ${props => props.height}px;
  background-color: ${props => props.outerBackgroundColor};
`;

export const Content = styled.View<ContentProps>`
  border-radius: 16px;
  height: ${props => props.padded ? (props.height / 2) : props.height}px;
  background-color: ${props => props.innerBackgroundColor};
  width: ${props => `${props.progress}%`};
`;