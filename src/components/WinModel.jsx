import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import GradientButton from "./GradientButton";
import Pile from "./Pile";
import { announceWinner, resetGame } from "../redux/reducers/gameSlices";
import { resetAndNavigate } from "../helpers/NavigationUtil";
import { playSound } from "../helpers/SoundUtility";
import Trophy from "../assets/animation/trophy.json";
import Firework from "../assets/animation/firework.json";
import { colorPlayer, playerColors } from "../helpers/PlotData";
import { colors } from "../constants/Colors";
import { selectSoundStatus } from "../redux/reducers/gameSelectors";

const WinModel = ({ winner }) => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(!!winner);
    const isSilent = useSelector(selectSoundStatus);

    useEffect(() => {
        setVisible(!!winner);
    }, [winner]);
    const handleNewGame = () => {
        dispatch(resetGame());
        dispatch(announceWinner(null));
        if (!isSilent) playSound("game_start");
    };

    const handleHome = () => {
        dispatch(resetGame());
        dispatch(announceWinner(null));
        resetAndNavigate("Home");
    };

    return (
        <Modal
            style={styles.modal}
            isVisible={visible}
            backdropColor="black"
            backdropOpacity={0.8}
            animationIn="zoomIn"
            animationOut="zoomOut"
            onBackButtonPress={() => {}}
            onBackdropPress={() => {}}
        >
            <LinearGradient
                colors={["#0f0c29", "#302b63", "#24243e"]}
                style={styles.gradientContainer}
            >
                <View style={styles.content}>
                    <View style={styles.pileContainer}>
                        <Pile player={1} color={colorPlayer[winner - 1]} />
                    </View>
                    <Text style={styles.congratsText}>🥳 Congratulations!</Text>
                    <Text style={styles.congratsText}>
                        PLAYER{" "}
                        <Text style={{ color: colors[playerColors[winner - 1]] }}>
                            {playerColors[winner - 1].toLocaleUpperCase()}
                        </Text>
                    </Text>
                    <LottieView
                        autoPlay
                        hardwareAccelerationAndroid
                        loop={false}
                        source={Trophy}
                        style={styles.trophyAnimation}
                    />
                    <LottieView
                        autoPlay
                        hardwareAccelerationAndroid
                        loop={true}
                        source={Firework}
                        style={styles.fireworkAnimation}
                    />
                    <GradientButton title="NEW GAME" onPress={handleNewGame} />
                    <GradientButton title="HOME" onPress={handleHome} />
                </View>
            </LinearGradient>
        </Modal>
    );
};

export default WinModel;

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        alignSelf: "center",
    },
    gradientContainer: {
        borderRadius: 20,
        padding: 20,
        width: "96%",
        borderWidth: 2,
        borderColor: "gold",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        width: "100%",
        alignItems: "center",
    },
    pileContainer: {
        width: 90,
        height: 40,
    },
    congratsText: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "Philosopher-Bold",
        marginTop: 10,
    },
    trophyAnimation: {
        width: 200,
        height: 200,
        marginTop: 20,
        zIndex: 99,
    },
    fireworkAnimation: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 0,
        marginTop: 20,
    },
});
