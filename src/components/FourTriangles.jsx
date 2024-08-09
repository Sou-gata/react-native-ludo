import { StyleSheet, View } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import LottieView from "lottie-react-native";
import { colors } from "../constants/Colors";
import FireWork from "../assets/animation/firework.json";
import { Polygon, Svg } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { selectFireworks } from "../redux/reducers/gameSelectors";
import { updateFireworks } from "../redux/reducers/gameSlices";
import PlayerPieces from "./PlayerPieces";

const FourTriangles = ({ players }) => {
    const { player1, player2, player3, player4 } = players;
    const isFireWork = useSelector(selectFireworks);
    const dispatch = useDispatch();

    const size = 300;

    const [blast, setBlast] = useState(false);

    useEffect(() => {
        if (isFireWork) {
            let timer;
            setBlast(true);
            timer = setTimeout(() => {
                setBlast(false);
                dispatch(updateFireworks(false));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isFireWork]);

    const playerData = useMemo(
        () => [
            {
                player: player1,
                bottom: "-10%",
                left: "-4%",
                pieceColor: colors.red,
                translate: "translateX",
            },
            {
                player: player2,
                top: "15%",
                left: "-30%",
                pieceColor: colors.green,
                translate: "translateY",
            },
            {
                player: player3,
                top: "5%",
                left: "-4%",
                pieceColor: colors.yellow,
                translate: "translateX",
            },
            {
                player: player4,
                top: "15%",
                right: "-30%",
                pieceColor: colors.blue,
                translate: "translateY",
            },
        ],
        [player1, player2, player3, player4]
    );

    const renderPlayerPieces = useCallback(
        (data, index) => (
            <PlayerPieces
                key={index}
                player={data?.player.filter((item) => item?.travelCount == 57)}
                style={{ top: data.top, left: data.left, bottom: data.bottom, right: data.right }}
                pieceColor={data.pieceColor}
                translate={data.translate}
            />
        ),
        []
    );

    return (
        <View style={styles.mainContainer}>
            {blast && (
                <LottieView
                    source={FireWork}
                    autoPlay
                    loop
                    style={{ width: "100%", height: "100%", position: "absolute", zIndex: 99 }}
                    resizeMode="cover"
                    hardwareAccelerationAndroid
                    speed={1}
                />
            )}
            <Svg height={size} width={size}>
                <Polygon points={`0,0 ${size / 2},${size / 2} ${size},0`} fill={colors.yellow} />
                <Polygon
                    points={`${size},0 ${size / 2},${size / 2} ${size},${size}`}
                    fill={colors.blue}
                />
                <Polygon
                    points={`0,${size} ${size / 2},${size / 2} ${size},${size}`}
                    fill={colors.red}
                />
                <Polygon points={`0,0 ${size / 2},${size / 2} 0,${size}`} fill={colors.green} />
            </Svg>
            {playerData.map(renderPlayerPieces)}
        </View>
    );
};

export default FourTriangles;

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.8,
        width: "20%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "white",
        borderColor: colors.borderColor,
    },
});
