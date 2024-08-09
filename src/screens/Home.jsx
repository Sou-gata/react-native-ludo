import {
    Text,
    Animated,
    Image,
    StyleSheet,
    Alert,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import SoundPlayer from "react-native-sound-player";
import {
    ComputerDesktopIcon,
    PlayCircleIcon,
    PlayPauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
} from "react-native-heroicons/solid";
import Wrapper from "../components/Wrapper";
import Logo from "../assets/images/logo.png";
import { deviceHeight, deviceWidth } from "../constants/Scalling";
import GradientButton from "../components/GradientButton";
import { selectCurrentPositions, selectSoundStatus } from "../redux/reducers/gameSelectors";
import { playSound } from "../helpers/SoundUtility";
import { navigate } from "../helpers/NavigationUtil";
import Witch from "../assets/animation/witch.json";
import { changeSoundStatus } from "../redux/reducers/gameSlices";
import { RFValue } from "react-native-responsive-fontsize";
import LinearGradient from "react-native-linear-gradient";
import NewGameModal from "../components/NewGameModal";

const Home = () => {
    const dispatch = useDispatch();
    const currentPosition = useSelector(selectCurrentPositions);
    const isSilent = useSelector(selectSoundStatus);
    const isFocused = useIsFocused();

    const witchAnim = useRef(new Animated.Value(-deviceWidth)).current;
    const scaleXAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        if (isFocused && !isSilent) playSound("home", true);
    }, [isFocused, isSilent]);

    const RenderButton = useCallback(
        (title, onPress, icon) => <GradientButton title={title} onPress={onPress} icon={icon} />,
        []
    );

    const handleNewGame = useCallback(() => {
        setIsVisible({ sub: true });
    }, []);

    const handleResumeGame = useCallback(() => {
        SoundPlayer.stop();
        navigate("LudoBoard");
        if (!isSilent) playSound("game_start");
    }, []);
    const handleSoundBtn = useCallback(() => {
        dispatch(changeSoundStatus());
    }, []);

    const loopAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(witchAnim, {
                        toValue: deviceWidth * 0.02,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleXAnim, {
                        toValue: -1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ]),

                Animated.delay(3000),

                Animated.parallel([
                    Animated.timing(witchAnim, {
                        toValue: deviceWidth * 2,
                        duration: 8000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleXAnim, {
                        toValue: -1,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),

                Animated.parallel([
                    Animated.timing(witchAnim, {
                        toValue: -deviceWidth * 0.05,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleXAnim, {
                        toValue: 1,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),

                Animated.delay(3000),

                Animated.parallel([
                    Animated.timing(witchAnim, {
                        toValue: -deviceWidth * 2,
                        duration: 8000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleXAnim, {
                        toValue: 1,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    };
    useEffect(() => {
        const cleanUpAnimation = () => {
            Animated.timing(witchAnim).stop();
            Animated.timing(scaleXAnim).stop();
        };
        loopAnimation();
        return cleanUpAnimation;
    }, [witchAnim, scaleXAnim]);

    const [isVisible, setIsVisible] = useState({ sub: false });

    const iconSize = RFValue(20);
    return (
        <Wrapper style={{ justifyContent: "flex-start" }}>
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
            <Animated.View style={[styles.imgContainer]}>
                <Image source={Logo} style={styles.img} />
            </Animated.View>
            {currentPosition.length != 0 &&
                RenderButton(
                    "RESUME",
                    handleResumeGame,
                    <PlayPauseIcon color="#d5be3e" size={iconSize} />
                )}
            {RenderButton(
                "NEW GAME",
                handleNewGame,
                <PlayCircleIcon color="#d5be3e" size={iconSize} />
            )}
            {RenderButton(
                "VS CPU",
                () => Alert.alert("Coming Soon! Click on New Game"),
                <ComputerDesktopIcon color="#d5be3e" size={iconSize} />
            )}

            <Animated.View
                style={[
                    styles.witchContainer,
                    { transform: [{ translateX: witchAnim }, { scaleX: scaleXAnim }] },
                ]}
            >
                <Pressable
                    onPress={() => {
                        const random = Math.floor(Math.random() * 3) + 1;
                        if (!isSilent) playSound(`girl${random}`);
                    }}
                >
                    <LottieView
                        hardwareAccelerationAndroid
                        source={Witch}
                        autoPlay
                        loop
                        speed={1}
                        style={styles.witch}
                    />
                </Pressable>
            </Animated.View>
            {isVisible && (
                <NewGameModal setMenuVisible={setIsVisible} visible={isVisible} source="home" />
            )}
            <Text style={styles.author}>Made by - Sougata Talukdar</Text>
        </Wrapper>
    );
};

export default Home;

const styles = StyleSheet.create({
    img: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    imgContainer: {
        width: deviceWidth * 0.6,
        height: deviceHeight * 0.2,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 40,
        alignSelf: "center",
    },
    author: {
        position: "absolute",
        bottom: 40,
        color: "white",
        fontWeight: "bold",
        opacity: 0.5,
        fontStyle: "italic",
    },
    witchContainer: {
        position: "absolute",
        top: "70%",
        left: "24%",
    },
    witch: {
        height: 250,
        width: 250,
        transform: [{ rotate: "25deg" }],
    },
    soundBtnContainer: {
        position: "absolute",
        top: "5%",
        left: "7%",
        width: 35,
        height: 35,
        borderWidth: 2,
        borderRadius: 7,
        shadowColor: "#d5be3e",
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 10,
        borderColor: "#d5be3e",
    },
    soundBtn: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#000",
    },
});
