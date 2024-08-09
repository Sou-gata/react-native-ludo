import { Animated, Easing, Image, Pressable, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Svg, Circle } from "react-native-svg";
import { BackgroundImage } from "../helpers/getIcons";
import { useSelector } from "react-redux";
import {
    selectCellSelection,
    selectDiceNo,
    selectPocketPileSelection,
} from "../redux/reducers/gameSelectors";

const Pile = ({ color, cell, player, onPress, pieceId }) => {
    const pileImage = BackgroundImage.GetImage(color);
    const rotation = useRef(new Animated.Value(0)).current;

    const currentPlayerPileSelection = useSelector(selectPocketPileSelection);
    const currentPlayerCellSelection = useSelector(selectCellSelection);

    const diceNo = useSelector(selectDiceNo);
    const playerPieces = useSelector((state) => state.game[`player${player}`]);

    const isPileEnabled = useMemo(
        () => player == currentPlayerPileSelection,
        [currentPlayerPileSelection, player]
    );

    const isCellEnabled = useMemo(
        () => player == currentPlayerCellSelection,
        [currentPlayerCellSelection, player]
    );

    const isForwardable = useCallback(() => {
        const piece = playerPieces?.find((item) => item.id == pieceId);
        return Boolean(piece) && piece.travelCount + diceNo <= 57;
    }, [playerPieces, pieceId, diceNo]);

    useEffect(() => {
        const rotatrAnimation = Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        rotatrAnimation.start();
        return () => rotatrAnimation.stop();
    }, [rotation]);

    const rotateInterpolate = useMemo(
        () =>
            rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
            }),
        [rotation]
    );

    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
            disabled={!(cell ? isCellEnabled && isForwardable() : isPileEnabled)}
        >
            {(cell ? isCellEnabled && isForwardable() : isPileEnabled) && (
                <View style={styles.hollowCircle}>
                    <View style={styles.dashedCircleContainer}>
                        <Animated.View
                            style={[
                                styles.dashedCircle,
                                { transform: [{ rotate: rotateInterpolate }] },
                            ]}
                        >
                            <Svg height={18} width={18}>
                                <Circle
                                    cx={9}
                                    cy={9}
                                    r={8}
                                    fill="transparent"
                                    stroke="white"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    strokeDashoffset={0}
                                />
                            </Svg>
                        </Animated.View>
                    </View>
                </View>
            )}
            <Image
                source={pileImage}
                style={{ width: 30, height: 30, position: "absolute", top: -16 }}
            />
        </Pressable>
    );
};

export default Pile;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        alignSelf: "center",
    },
    hollowCircle: {
        width: 15,
        height: 15,
        position: "absolute",
        borderRadius: 100,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
});
