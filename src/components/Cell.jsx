import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo } from "react";
import { colors } from "../constants/Colors";
import Pile from "./Pile";
import { SafeSpots, StarSpots, ArrowSpots, startingPoints } from "../helpers/PlotData";
import { ArrowRightIcon, StarIcon } from "react-native-heroicons/outline";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentPositions } from "../redux/reducers/gameSelectors";
import { handleForwordThunk } from "../redux/reducers/gameAction";

const Cell = ({ id, color }) => {
    const dispatch = useDispatch();
    const plottedPieces = useSelector(selectCurrentPositions);

    const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
    const isStarSpot = useMemo(() => StarSpots.includes(id), [id]);
    const isArrowSpot = useMemo(() => ArrowSpots.includes(id), [id]);
    const isStartingPoints = useMemo(() => startingPoints.includes(id), [id]);

    const piecesAtPosition = useMemo(
        () => plottedPieces.filter((item) => item.pos == id),
        [plottedPieces, id]
    );

    const handlePress = useCallback(
        (playerNo, pieceId) => {
            dispatch(handleForwordThunk(playerNo, pieceId, id));
        },
        [dispatch, id]
    );

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isSafeSpot ? color : "white",
                },
            ]}
        >
            {isStarSpot && <StarIcon size={20} color="gray" />}
            {isArrowSpot && (
                <ArrowRightIcon
                    size={RFValue(12)}
                    color={color}
                    style={{
                        transform: [
                            {
                                rotate:
                                    id == 38
                                        ? "180deg"
                                        : id == 25
                                        ? "90deg"
                                        : id == 51
                                        ? "-90deg"
                                        : "0deg",
                            },
                        ],
                    }}
                />
            )}
            {isStartingPoints && <StarIcon size={20} color="white" />}
            {piecesAtPosition?.map((item, index) => {
                const playerNo =
                    item.id[0] == "A" ? 1 : item.id[0] == "B" ? 2 : item.id[0] == "C" ? 3 : 4;
                const pieceColor =
                    playerNo == 1
                        ? colors.red
                        : playerNo == 2
                        ? colors.green
                        : playerNo == 3
                        ? colors.yellow
                        : colors.blue;

                return (
                    <View
                        key={item.id}
                        style={[
                            styles.pieceContainer,
                            {
                                transform: [
                                    {
                                        scale: piecesAtPosition.length == 1 ? 1 : 0.6,
                                    },
                                    {
                                        translateX:
                                            piecesAtPosition.length == 1
                                                ? 0
                                                : index % 2 == 0
                                                ? 6
                                                : -6,
                                    },
                                    {
                                        translateY:
                                            piecesAtPosition.length == 1 ? 0 : index == 0 ? 6 : -6,
                                    },
                                ],
                            },
                        ]}
                    >
                        <Pile
                            cell={true}
                            player={playerNo}
                            onPress={() => handlePress(playerNo, item.id)}
                            pieceId={item.id}
                            color={pieceColor}
                        />
                    </View>
                );
            })}
        </View>
    );
};

export default React.memo(Cell);

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.4,
        borderColor: colors.borderColor,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    pieceContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        zIndex: 100,
    },
});
