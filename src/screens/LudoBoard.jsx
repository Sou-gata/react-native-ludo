import { StyleSheet, View, TouchableOpacity, Image, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import Wrapper from "../components/Wrapper";
import MenuIcon from "../assets/images/menu.png";
import { deviceHeight, deviceWidth } from "../constants/Scalling";
import Dice from "../components/Dice";
import { colors } from "../constants/Colors";
import Pocket from "../components/Pocket";
import VerticalPath from "../components/VerticalPath";
import { Plot1Data, Plot2Data, Plot3Data, Plot4Data } from "../helpers/PlotData";
import HorizontalPath from "../components/HorizontalPath";
import FourTriangles from "../components/FourTriangles";
import StartGame from "../assets/images/start.png";
import {
    selectDiceTouch,
    selectPlayer1,
    selectPlayer2,
    selectPlayer3,
    selectPlayer4,
    selectWinner,
} from "../redux/reducers/gameSelectors";
import MenuModal from "../components/MenuModal";
import WinModel from "../components/WinModel";
import NewGameModal from "../components/NewGameModal";

const LudoBoard = () => {
    const player1 = useSelector(selectPlayer1);
    const player2 = useSelector(selectPlayer2);
    const player3 = useSelector(selectPlayer3);
    const player4 = useSelector(selectPlayer4);
    const isDiceTouch = useSelector(selectDiceTouch);
    const winner = useSelector(selectWinner);

    const isFocused = useIsFocused();
    const [showStartImage, setShowStartImage] = useState(false);
    const [menuVisible, setMenuVisible] = useState({ main: false, sub: false });
    opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isFocused) {
            setShowStartImage(true);
            const blinkAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            );
            blinkAnimation.start();
            const timeout = setTimeout(() => {
                setShowStartImage(false);
            }, 2500);
            return () => {
                blinkAnimation.stop();
                clearTimeout(timeout);
            };
        }
    }, [isFocused]);

    return (
        <Wrapper>
            <TouchableOpacity
                style={{ position: "absolute", top: 60, left: 20 }}
                onPress={() => setMenuVisible({ main: true, sub: false })}
            >
                <Image source={MenuIcon} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.flexRow} pointerEvents={isDiceTouch ? "none" : "auto"}>
                    <Dice color={colors.green} player={2} data={player2} />
                    <Dice color={colors.yellow} rotate player={3} data={player3} />
                </View>
                <View style={styles.ludoBoard}>
                    <View style={styles.plotContainer}>
                        <Pocket color={colors.green} player={2} data={player2} />
                        <VerticalPath color={colors.yellow} cells={Plot2Data} />
                        <Pocket color={colors.yellow} player={3} data={player3} />
                    </View>
                    <View style={styles.pathContainer}>
                        <HorizontalPath color={colors.green} cells={Plot1Data} />
                        <FourTriangles players={{ player1, player2, player3, player4 }} />
                        <HorizontalPath color={colors.blue} cells={Plot3Data} />
                    </View>
                    <View style={styles.plotContainer}>
                        <Pocket color={colors.red} player={1} data={player1} />
                        <VerticalPath color={colors.red} cells={Plot4Data} />
                        <Pocket color={colors.blue} player={4} data={player4} />
                    </View>
                </View>
                <View style={styles.flexRow} pointerEvents={isDiceTouch ? "none" : "auto"}>
                    <Dice color={colors.red} player={1} data={player1} />
                    <Dice color={colors.blue} rotate player={4} data={player4} />
                </View>
            </View>

            {showStartImage && (
                <Animated.Image
                    source={StartGame}
                    style={{
                        width: deviceWidth * 0.5,
                        height: deviceHeight * 0.2,
                        position: "absolute",
                        opacity,
                    }}
                />
            )}

            {menuVisible.main && (
                <MenuModal
                    onPressHide={() => setMenuVisible(false)}
                    setMenuVisible={setMenuVisible}
                    visible={menuVisible}
                />
            )}
            {menuVisible.sub && (
                <NewGameModal setMenuVisible={setMenuVisible} visible={menuVisible} />
            )}
            {winner != null && <WinModel winner={winner} />}
        </Wrapper>
    );
};

export default LudoBoard;

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        justifyContent: "center",
        height: Math.min(deviceHeight * 0.5, deviceWidth),
        width: Math.min(deviceHeight * 0.5, deviceWidth),
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 30,
    },

    ludoBoard: {
        width: "100%",
        height: "100%",
        alignSelf: "center",
        padding: 10,
    },
    plotContainer: {
        width: "100%",
        height: "40%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#ccc",
    },
    pathContainer: {
        flexDirection: "row",
        height: "20%",
        width: "100%",
        justifyContent: "space-between",
        backgroundColor: "#1e5162",
    },
});
