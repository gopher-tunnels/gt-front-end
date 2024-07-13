import React from "react";
import {View, Text, TouchableOpacity} from 'react-native';
import { Container, ChipText, Circle } from "./styles";


export interface Props {
    width: number;
    height: number;
    label: string;
    onPress: () => void;
    styleType?: 'default' | 'tunnel' | 'skyway' | 'sidewalk';
    
}

const CustomChips: React.FC<Props> = (props: Props) => {
    const {
        width = 100,
        height = 40,
        label,
        onPress,
        styleType = 'default',
    } = props;
    return (

        <TouchableOpacity onPress={onPress} style={{ width, height }}>
            <Container styleType={styleType}>
                <Circle styleType={styleType}/>
                <ChipText styleType={styleType}>{label}</ChipText>
            </Container>
        </TouchableOpacity>
        
        // <TouchableOpacity
        //     onPress={onPress}
        //     style={[
                
        //         {
        //             width,
        //             height,
                    
        //         }
        //     ]}
        //     >
        //         <ChipText>{label}</ChipText>
        // </TouchableOpacity>
      
    );
}

export default CustomChips;