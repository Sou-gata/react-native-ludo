import { StyleSheet, View } from "react-native";
import React from "react";
import { colors } from "../constants/Colors";
import Plot from "./Plot";
import { useDispatch } from "react-redux";
import { unfreezeDice, updatePlayerPieceValue } from "../redux/reducers/gameSlices";
import { startingPoints } from "../helpers/PlotData";

const Pocket = React.memo(({ color, player, data }) => {
    const dispatch = useDispatch();

    const handlePress = async (value) => {
        let playerNo = value?.id[0];

        switch (playerNo) {
            case "A":
                playerNo = "player1";
                break;
            case "B":
                playerNo = "player2";
                break;
            case "C":
                playerNo = "player3";
                break;
            case "D":
                playerNo = "player4";
                break;
        }

        dispatch(
            updatePlayerPieceValue({
                playerNo,
                pieceId: value.id,
                pos: startingPoints[playerNo[playerNo.length - 1] - 1],
                travelCount: 1,
            })
        );
        dispatch(unfreezeDice());
    };

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <View style={styles.childFrame}>
                <View style={styles.flexRow}>
                    <Plot
                        data={data}
                        onPress={handlePress}
                        pieceNo={0}
                        player={player}
                        color={color}
                    />
                    <Plot
                        data={data}
                        onPress={handlePress}
                        pieceNo={1}
                        player={player}
                        color={color}
                    />
                </View>
                <View style={styles.flexRow}>
                    <Plot
                        data={data}
                        onPress={handlePress}
                        pieceNo={2}
                        player={player}
                        color={color}
                    />
                    <Plot
                        data={data}
                        onPress={handlePress}
                        pieceNo={3}
                        player={player}
                        color={color}
                    />
                </View>
            </View>
        </View>
    );
});

export default Pocket;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        width: "40%",
        height: "100%",
        borderWidth: 0.4,
    },
    childFrame: {
        backgroundColor: "white",
        width: "70%",
        height: "70%",
        borderColor: colors.borderColor,
        padding: 15,
        borderWidth: 0.4,
        justifyContent: "space-evenly",
    },
    flexRow: {
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "40%",
        flexDirection: "row",
    },
});
