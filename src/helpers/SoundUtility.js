import SoundPlayer from "react-native-sound-player";

export const playSound = (soundName) => {
    try {
        const soundPath = getSoundPath(soundName);
        SoundPlayer.playAsset(soundPath);
    } catch (error) {
        console.log("Error playing sound", error);
    }
};

function getSoundPath(soundName) {
    if (soundName === "dice_roll") {
        return require("../assets/sfx/dice_roll.mp3");
    } else if (soundName === "cheer") {
        return require("../assets/sfx/cheer.mp3");
    } else if (soundName === "game_start") {
        return require("../assets/sfx/game_start.mp3");
    } else if (soundName === "collide") {
        return require("../assets/sfx/collide.mp3");
    } else if (soundName === "home_win") {
        return require("../assets/sfx/home_win.mp3");
    } else if (soundName === "home") {
        return require("../assets/sfx/home.mp3");
    } else if (soundName === "safe_spot") {
        return require("../assets/sfx/safe_spot.mp3");
    } else if (soundName === "ui") {
        return require("../assets/sfx/ui.mp3");
    } else if (soundName === "pile_move") {
        return require("../assets/sfx/pile_move.mp3");
    } else if (soundName === "girl1") {
        return require("../assets/sfx/girl1.mp3");
    } else if (soundName === "girl2") {
        return require("../assets/sfx/girl2.mp3");
    } else if (soundName === "girl3") {
        return require("../assets/sfx/girl3.mp3");
    } else {
        throw new Error(`Sound ${soundName} not found`);
    }
}
