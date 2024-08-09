import { StyleSheet, View } from "react-native";
import React from "react";
import Pile from "./Pile";
import { deviceHeight } from "../constants/Scalling";

const PlayerPieces = ({ player, style, pieceColor, translate }) => {
    return (
        <View style={[styles.container, style]}>
            {player.map((piece, index) => (
                <View
                    key={piece.id}
                    pointerEvents="none"
                    style={{
                        top: 0,
                        zIndex: 99,
                        position: "absolute",
                        bottom: 0,
                        transform: [{ scale: 0.5 }, { [translate]: 14 * index }],
                    }}
                >
                    <Pile
                        cell={true}
                        player={player}
                        onPress={() => {}}
                        pieceId={piece.id}
                        color={pieceColor}
                    />
                </View>
            ))}
        </View>
    );
};

export default React.memo(PlayerPieces);

const styles = StyleSheet.create({
    container: {
        width: deviceHeight * 0.063,
        height: deviceHeight * 0.032,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
});
