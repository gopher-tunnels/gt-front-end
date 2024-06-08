import React from "react";
import {View, TouchableOpacity} from 'react-native';
import SideChip from '../../assets/siedwalkChip.svg';
import TunChip from '../../assets/tunnelChip.svg';
import SkyChip from '../../assets/skywayChip.svg';

export interface Props {
    width: number;
    height: number;
}

const CustomChips: React.FC<Props> = (props: Props) => {
    const {
        width = 100,
        height = 100,
    } = props;
    return (
        <View>
            <SideChip width={width} height={height}/>
        </View>
    );
}

export default CustomChips;