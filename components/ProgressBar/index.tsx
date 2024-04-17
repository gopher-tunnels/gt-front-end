import React from 'react';
import { Container, Content } from './styles'; // Importing styled components

interface ProgressBarProps {
  progress: number;
  height?: number;
  outerBackgroundColor: string;
  innerBackgroundColor: string;
  padded?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  outerBackgroundColor,
  innerBackgroundColor,
  padded = true
}) => (
  <Container
    height={height}
    padded={padded}
    outerBackgroundColor={outerBackgroundColor}
  >
    <Content 
      height={height}
      padded={padded}
      progress={progress} 
      innerBackgroundColor={innerBackgroundColor}
    />
  </Container>
);

export default ProgressBar;