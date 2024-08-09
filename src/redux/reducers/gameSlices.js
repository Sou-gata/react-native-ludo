import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import SoundPlayer from "react-native-sound-player";

export const gameSlices = createSlice({
    name: "game",
    initialState: initialState,
    reducers: {
        resetGame: (state) => {
            return { ...initialState, isSilent: state.isSilent };
        },
        restartTwoPlayerMode: (state) => {
            return { ...initialState, isTwoPlayerMode: true, isSilent: state.isSilent };
        },
        updateDiceNo: (state, action) => {
            state.diceNo = action.payload.diceNo;
            state.isDiceRolled = true;
        },
        enablePileSelection: (state, action) => {
            state.touchDiceBlock = true;
            state.pileSelectionPlayer = action.payload.playerNo;
        },
        enableCellSelection: (state, action) => {
            state.touchDiceBlock = true;
            state.cellSelectionPlayer = action.payload.playerNo;
        },
        disableTouch: (state) => {
            state.touchDiceBlock = true;
            state.cellSelectionPlayer = -1;
            state.pileSelectionPlayer = -1;
        },
        unfreezeDice: (state) => {
            state.touchDiceBlock = false;
            state.isDiceRolled = false;
        },
        updateFireworks: (state, action) => {
            state.fireworks = action.payload;
        },
        announceWinner: (state, action) => {
            state.winner = action.payload;
        },
        updatePlayerChance: (state, action) => {
            state.chancePlayer = action.payload.chancePlayer;
            state.touchDiceBlock = false;
            state.isDiceRolled = false;
        },
        updatePlayerPieceValue: (state, action) => {
            const { playerNo, pieceId, pos, travelCount } = action.payload;
            const playerPieces = state[playerNo];
            const piece = playerPieces.find((p) => p.id == pieceId);
            state.pileSelectionPlayer = -1;

            if (piece) {
                piece.pos = pos;
                piece.travelCount = travelCount;
                const currentPositonIndex = state.currentPositions.findIndex(
                    (item) => item.id == pieceId
                );
                if (pos == 0) {
                    if (currentPositonIndex != -1) {
                        state.currentPositions.splice(currentPositonIndex, 1);
                    }
                } else {
                    if (currentPositonIndex != -1) {
                        state.currentPositions[currentPositonIndex] = {
                            id: pieceId,
                            pos,
                        };
                    } else {
                        state.currentPositions.push({
                            id: pieceId,
                            pos,
                        });
                    }
                }
            }
        },
        changeSoundStatus: (state) => {
            state.isSilent = !state.isSilent;
            if (state.isSilent) {
                SoundPlayer.stop();
            }
        },
        resetMoves: (state) => {
            state.moves = [];
        },
        updateMoves: (state, action) => {
            state.moves = action.payload.moves;
        },
        changeTwoPlayerMode: (state, action) => {
            state.isTwoPlayerMode = action.payload?.isEnable;
        },
    },
});

export const {
    resetGame,
    restartTwoPlayerMode,
    updateDiceNo,
    enablePileSelection,
    enableCellSelection,
    disableTouch,
    unfreezeDice,
    updateFireworks,
    announceWinner,
    updatePlayerChance,
    updatePlayerPieceValue,
    changeSoundStatus,
    setLastThreeMove,
    resetLastThreeMoves,
    updateMoves,
} = gameSlices.actions;

export default gameSlices.reducer;
