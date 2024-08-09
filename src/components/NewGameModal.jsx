import { Alert, StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { UserGroupIcon, UserIcon, UsersIcon } from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import SoundPlayer from "react-native-sound-player";
import GradientButton from "./GradientButton";
import { announceWinner, resetGame, restartTwoPlayerMode } from "../redux/reducers/gameSlices";
import { selectSoundStatus } from "../redux/reducers/gameSelectors";
import { playSound } from "../helpers/SoundUtility";
import { navigate } from "../helpers/NavigationUtil";

const NewGameModal = ({ visible, setMenuVisible, source = "menu" }) => {
    const dispatch = useDispatch();
    const isSilent = useSelector(selectSoundStatus);

    const onPressHide = () => {
        setMenuVisible((prev) => {
            return { ...prev, sub: false };
        });
    };

    const handleFourPlayerNewGame = useCallback(() => {
        dispatch(resetGame());
        if (!isSilent) playSound("game_start");
        else SoundPlayer.stop();
        dispatch(announceWinner(null));
        onPressHide();
        if (source == "home") navigate("LudoBoard");
    }, [dispatch]);
    const handleTwoPlayerNewGame = useCallback(() => {
        SoundPlayer.stop();
        dispatch(restartTwoPlayerMode());
        if (!isSilent) playSound("game_start");
        onPressHide();
        if (source == "home") navigate("LudoBoard");
    }, []);

    const iconSize = RFValue(20);
    return (
        <Modal
            style={styles.bottomModalView}
            isVisible={visible.sub}
            backdropColor="black"
            backdropOpacity={0.8}
            onBackdropPress={onPressHide}
            animationIn="zoomIn"
            animationOut="zoomOut"
            onBackButtonPress={onPressHide}
        >
            <View style={styles.modalContainer}>
                <LinearGradient
                    colors={["#0f0c29", "#302b63", "#24243e"]}
                    style={styles.gradientContainer}
                >
                    <View style={styles.subView}>
                        <GradientButton
                            title="2 Players"
                            onPress={handleTwoPlayerNewGame}
                            icon={<UsersIcon color="#d5be3e" size={iconSize} />}
                        />
                        <GradientButton
                            title="3 Players"
                            onPress={() => {
                                Alert.alert("Comming soon! Plese select other option");
                            }}
                            icon={<UserGroupIcon color="#d5be3e" size={iconSize} />}
                        />
                        <GradientButton
                            title="4 Players"
                            onPress={handleFourPlayerNewGame}
                            icon={<UserIcon color="#d5be3e" size={iconSize} />}
                        />
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    );
};

export default NewGameModal;

const styles = StyleSheet.create({
    bottomModalView: {
        justifyContent: "center",
        width: "95%",
        alignSelf: "center",
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    gradientContainer: {
        borderRadius: 20,
        overflow: "hidden",
        padding: 20,
        paddingVertical: 40,
        width: "96%",
        borderWidth: 2,
        borderColor: "gold",
        justifyContent: "center",
        alignItems: "center",
    },
    subView: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
});
