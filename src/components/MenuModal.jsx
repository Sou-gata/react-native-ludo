import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import GradientButton from "./GradientButton";
import { announceWinner, changeSoundStatus, resetGame } from "../redux/reducers/gameSlices";
import { playSound } from "../helpers/SoundUtility";
import { goBack } from "../helpers/NavigationUtil";
import LinearGradient from "react-native-linear-gradient";
import { selectSoundStatus } from "../redux/reducers/gameSelectors";
import SoundPlayer from "react-native-sound-player";
import {
    HomeIcon,
    PlayCircleIcon,
    PlayPauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";

const MenuModal = ({ visible, setMenuVisible }) => {
    const dispatch = useDispatch();
    const isSilent = useSelector(selectSoundStatus);
    const onPressHide = () => {
        setMenuVisible((prev) => {
            return { ...prev, main: false };
        });
    };

    const handleNewGame = useCallback(() => {
        setMenuVisible({ main: false, sub: true });
    }, []);

    const handleHome = useCallback(() => {
        goBack();
    }, []);
    const handleSoundBtn = useCallback(() => {
        dispatch(changeSoundStatus());
    }, []);
    const iconSize = RFValue(20);

    return (
        <Modal
            style={styles.bottomModalView}
            isVisible={visible.main}
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
                            title="RESUME"
                            onPress={onPressHide}
                            icon={<PlayPauseIcon color="#d5be3e" size={iconSize} />}
                        />
                        <GradientButton
                            title="NEW GAME"
                            onPress={handleNewGame}
                            icon={<PlayCircleIcon color="#d5be3e" size={iconSize} />}
                        />
                        <GradientButton
                            title="HOME"
                            onPress={handleHome}
                            icon={<HomeIcon color="#d5be3e" size={iconSize} />}
                        />

                        <TouchableOpacity
                            style={styles.soundBtnContainer}
                            activeOpacity={0.8}
                            onPress={handleSoundBtn}
                        >
                            <LinearGradient
                                colors={["#4c669f", "#3b5998", "#192f6a"]}
                                style={styles.soundBtn}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                {isSilent ? (
                                    <SpeakerXMarkIcon color="#d5be3e" size={iconSize} />
                                ) : (
                                    <SpeakerWaveIcon color="#d5be3e" size={iconSize} />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    );
};

export default MenuModal;

const styles = StyleSheet.create({
    bottomModalView: {
        justifyContent: "center",
        width: "95%",
        alignSelf: "center",
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
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    soundBtnContainer: {
        width: 45,
        height: 45,
        borderWidth: 3,
        borderRadius: 10,
        shadowColor: "#d5be3e",
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 10,
        borderColor: "#d5be3e",
        marginTop: 15,
    },
    soundBtn: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#000",
    },
});
