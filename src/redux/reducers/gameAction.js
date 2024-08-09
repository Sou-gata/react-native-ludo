import SoundPlayer from "react-native-sound-player";
import {
    SafeSpots,
    StarSpots,
    startingPoints,
    turningPoints,
    victoryStart,
} from "../../helpers/PlotData";
import { playSound } from "../../helpers/SoundUtility";
import { selectCurrentPositions, selectDiceNo } from "./gameSelectors";
import {
    announceWinner,
    disableTouch,
    unfreezeDice,
    updateFireworks,
    updatePlayerChance,
    updatePlayerPieceValue,
} from "./gameSlices";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const handleForwordThunk = (playerNo, id, pos) => async (dispatch, getState) => {
    let state = getState();
    const plottedPieces = selectCurrentPositions(state);
    const diceNo = selectDiceNo(state);

    let alpha = playerNo == 1 ? "A" : playerNo == 2 ? "B" : playerNo == 3 ? "C" : "D";
    const piecesAtPosition = plottedPieces.filter((item) => item.pos == pos);
    const piece = piecesAtPosition[piecesAtPosition.findIndex((item) => item.id[0] == alpha)];

    dispatch(disableTouch());
    let finalPath = piece.pos;
    const beforePlayerPieces = state.game[`player${playerNo}`].find((item) => item.id == id);
    let travelCount = beforePlayerPieces.travelCount;
    for (let i = 0; i < diceNo; i++) {
        const updatedPosition = getState();
        const playerPiece = updatedPosition.game[`player${playerNo}`].find((item) => item.id == id);
        let path = playerPiece.pos + 1;
        if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
            path = victoryStart[playerNo - 1];
        }
        if (path == 53) {
            path = 1;
        }
        finalPath = path;
        travelCount += 1;
        dispatch(
            updatePlayerPieceValue({
                playerNo: `player${playerNo}`,
                pieceId: playerPiece.id,
                pos: path,
                travelCount,
            })
        );
        if (!updatedPosition.game.isSilent) playSound("pile_move");
        else SoundPlayer.stop();
        await delay(150);
    }

    const updatedState = getState();
    const updatedPlottedPieces = selectCurrentPositions(updatedState);

    const finalPlot = updatedPlottedPieces.filter((item) => item.pos == finalPath);
    const ids = finalPlot.map((item) => item.id[0]);
    const uniqueIds = new Set(ids);
    const areDifferentIds = uniqueIds.size > 1;
    if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) {
        if (!updatedState.game.isSilent) playSound("safe_spot");
        else SoundPlayer.stop();
    }
    if (
        areDifferentIds &&
        !SafeSpots.includes(finalPlot[0].pos) &&
        !StarSpots.includes(finalPlot[0].pos)
    ) {
        const enemyPiece = finalPlot.find((item) => item.id[0] != id[0]);
        const enemyId = enemyPiece.id[0];
        let no = enemyId == "A" ? 1 : enemyId == "B" ? 2 : enemyId == "C" ? 3 : 4;
        let backwardPath = startingPoints[no - 1];
        let i = enemyPiece.pos;
        if (!updatedState.game.isSilent) playSound("collide");
        else SoundPlayer.stop();
        while (i != backwardPath) {
            dispatch(
                updatePlayerPieceValue({
                    playerNo: `player${no}`,
                    pieceId: enemyPiece.id,
                    pos: i,
                    travelCount: 0,
                })
            );
            await delay(150);
            i--;
            if (i == 0) {
                i = 52;
            }
        }
        dispatch(
            updatePlayerPieceValue({
                playerNo: `player${no}`,
                pieceId: enemyPiece.id,
                pos: 0,
                travelCount: 0,
            })
        );
        dispatch(unfreezeDice());
        return;
    }

    if (diceNo == 6 || travelCount == 57) {
        dispatch(updatePlayerChance({ chancePlayer: playerNo }));
        if (travelCount == 57) {
            const finalPlayerState = getState();
            if (!finalPlayerState.game.isSilent) playSound("home_win");
            else SoundPlayer.stop();
            const playerAllPieces = finalPlayerState.game[`player${playerNo}`];
            if (checkWinningCriteria(playerAllPieces)) {
                dispatch(announceWinner(playerNo));
                if (!finalPlayerState.game.isSilent) playSound("cheer");
                else SoundPlayer.stop();
                return;
            }
            dispatch(updateFireworks(true));
            dispatch(unfreezeDice());
            return;
        }
    } else {
        const state = getState();
        const isTwoPlayerMode = state.game.isTwoPlayerMode;
        let chancePlayer;
        if (isTwoPlayerMode) chancePlayer = playerNo + 2;
        else chancePlayer = playerNo + 1;
        if (chancePlayer > 4) {
            chancePlayer = 1;
        }
        dispatch(updatePlayerChance({ chancePlayer }));
    }
};

function checkWinningCriteria(playerAllPieces) {
    for (let piece of playerAllPieces) {
        if (piece.pos < 57) {
            return false;
        }
    }
    return true;
}
