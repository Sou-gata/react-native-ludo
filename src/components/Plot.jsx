import { StyleSheet, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Pile from "./Pile";
import { selectTwoPlayerMode } from "../redux/reducers/gameSelectors";
import { colors } from "../constants/Colors";

const Plot = ({ pieceNo, player, color, data, onPress }) => {
    const isTwoPlayerMode = useSelector(selectTwoPlayerMode);
    if (isTwoPlayerMode && (color == colors.green || color == colors.blue))
        return <View style={[styles.plot, { backgroundColor: color }]} />;
    else
        return (
            <View style={[styles.plot, { backgroundColor: color }]}>
                {data && data[pieceNo]?.pos == 0 && (
                    <Pile
                        color={color}
                        onPress={() => onPress(data[pieceNo])}
                        player={player}
                        pieceId={data[pieceNo]?.id}
                        cell={false}
                    />
                )}
            </View>
        );
};

export default Plot;

const styles = StyleSheet.create({
    plot: {
        width: 23,
        height: 23,
        borderRadius: 100,
    },
});
