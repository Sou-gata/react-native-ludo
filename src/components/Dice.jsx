import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import { useDispatch, useSelector } from "react-redux";
import SoundPlayer from "react-native-sound-player";
import { BackgroundImage } from "../helpers/getIcons";
import DiceRoll from "../assets/animation/diceroll.json";
import Arrow from "../assets/images/arrow.png";
import {
    selectCurrentPlayerChance,
    selectDiceNo,
    selectDiceRolled,
    selectMoves,
    selectSoundStatus,
    selectTwoPlayerMode,
} from "../redux/reducers/gameSelectors";
import {
    enableCellSelection,
    enablePileSelection,
    updateDiceNo,
    updateMoves,
    updatePlayerChance,
} from "../redux/reducers/gameSlices";
import { playSound } from "../helpers/SoundUtility";

const Dice = React.memo(({ color, rotate, player, data }) => {
    const dispatch = useDispatch();
    const currentPlayerChance = useSelector(selectCurrentPlayerChance);
    const isDiceRolled = useSelector(selectDiceRolled);
    const diceNo = useSelector(selectDiceNo);
    const playerPieces = useSelector((state) => state.game[`player${currentPlayerChance}`]);
    const isSilent = useSelector(selectSoundStatus);
    const moves = useSelector(selectMoves);
    const isTwoPlayerMode = useSelector(selectTwoPlayerMode);

    const pileIcon = BackgroundImage.GetImage(color);
    const diceIcon = BackgroundImage.GetImage(diceNo);
    const arrowAnim = useRef(new Animated.Value(0)).current;

    const [diceRolling, setDiceRolling] = useState(false);
    const [lastMoves, setLastMoves] = useState([]);

    useEffect(() => {
        const amimateArrow = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(arrowAnim, {
                        toValue: 10,
                        duration: 600,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(arrowAnim, {
                        toValue: 0,
                        duration: 600,
                        easing: Easing.in(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };
        amimateArrow();

        setLastMoves(moves);
    }, []);

    useEffect(() => {
        dispatch(updateMoves({ moves: lastMoves }));
    }, [lastMoves]);
    useEffect(() => {
        setLastMoves([]);
    }, [currentPlayerChance]);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    const genRandomNum = () => Math.floor(Math.random() * 6) + 1;
    const genNonSixNum = () => Math.floor(Math.random() * 5) + 1;

    async function handleDicePress() {
        let newDiceNo = genRandomNum();
        if (lastMoves.length >= 2) {
            if (newDiceNo == 6) newDiceNo = genNonSixNum();
        } else {
            setLastMoves((prev) => [...prev, newDiceNo]);
        }

        if (!isSilent) playSound("dice_roll");
        else SoundPlayer.stop();
        setDiceRolling(true);
        await delay(1200);
        dispatch(updateDiceNo({ diceNo: newDiceNo }));
        setDiceRolling(false);

        const isAnyPieceAlive = data?.findIndex((item) => item?.pos != 0 && item.pos != 57);
        const isAnyPieceLocked = data?.findIndex((item) => item?.pos == 0);

        if (isAnyPieceAlive == -1) {
            if (newDiceNo == 6) {
                dispatch(enablePileSelection({ playerNo: player }));
            } else {
                let nextPlayer;
                if (isTwoPlayerMode) nextPlayer = player + 2;
                else nextPlayer = player + 1;
                if (nextPlayer > 4) {
                    nextPlayer = 1;
                }
                await delay(600);
                dispatch(updatePlayerChance({ chancePlayer: nextPlayer }));
                selectDiceNo([]);
            }
        } else {
            const canMove = playerPieces.some(
                (pile) => pile.travelCount + newDiceNo <= 57 && pile.pos != 0
            );

            if (
                (!canMove && newDiceNo == 6 && isAnyPieceLocked == -1) ||
                (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) ||
                (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)
            ) {
                let nextPlayer;
                if (isTwoPlayerMode) nextPlayer = player + 2;
                else nextPlayer = player + 1;
                if (nextPlayer > 4) {
                    nextPlayer = 1;
                }
                await delay(600);
                selectDiceNo([]);
                dispatch(updatePlayerChance({ chancePlayer: nextPlayer }));
                return;
            }
            if (newDiceNo == 6) {
                dispatch(enablePileSelection({ playerNo: player }));
            }
            dispatch(enableCellSelection({ playerNo: player }));
        }
    }

    return (
        <View style={[styles.flexRow, { transform: [{ scaleX: rotate ? -1 : 1 }] }]}>
            <View style={styles.border1}>
                <LinearGradient
                    colors={["#0052be", "#5f9fcb", "#97c6c9"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.linearGradient}
                >
                    <View>
                        <Image source={pileIcon} style={styles.pileIcon} />
                    </View>
                </LinearGradient>
            </View>
            <View style={styles.border2}>
                <LinearGradient
                    colors={["#aac8ab", "#aac8ab", "#aac8ab"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.diceGradient}
                >
                    <View style={styles.diceContainer}>
                        {currentPlayerChance == player ? (
                            <>
                                {!diceRolling && (
                                    <TouchableOpacity activeOpacity={0.4} onPress={handleDicePress}>
                                        <Image source={diceIcon} style={styles.dice} />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : null}
                    </View>
                </LinearGradient>
            </View>

            {currentPlayerChance == player && !isDiceRolled && (
                <Animated.View style={{ transform: [{ translateX: arrowAnim }] }}>
                    <Image source={Arrow} style={{ width: 50, height: 50 }} />
                </Animated.View>
            )}

            {currentPlayerChance == player && diceRolling && (
                <LottieView
                    source={DiceRoll}
                    style={styles.rollingDice}
                    loop={false}
                    autoPlay={true}
                    cacheComposition={true}
                    hardwareAccelerationAndroid={true}
                />
            )}
        </View>
    );
});

export default Dice;

const styles = StyleSheet.create({
    flexRow: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    border1: {
        borderWidth: 3,
        borderRightWidth: 0,
        borderColor: "#f0ce2c",
    },
    border2: {
        borderWidth: 3,
        padding: 1,
        backgroundColor: "#aac8ab",
        borderRadius: 10,
        borderColor: "#aac8ab",
    },
    linearGradient: {},
    pileIcon: {
        width: 35,
        height: 35,
    },
    pileContainer: {
        paddingHorizontal: 3,
    },
    diceGradient: {
        borderWidth: 3,
        borderColor: "#f0ce2c",
        justifyContent: "center",
        alignItems: "center",
    },
    diceContainer: {
        backgroundColor: "#e8c0c1",
        borderWidth: 1,
        borderRadious: 5,
        width: 55,
        height: 55,
        paddingHorizontal: 8,
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
    },
    dice: {
        width: 45,
        height: 45,
    },
    rollingDice: {
        width: 80,
        height: 80,
        position: "absolute",
        zIndex: 99,
        top: -25,
        left: 30,
    },
});
