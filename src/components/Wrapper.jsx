import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import BG from "../assets/images/bg.jpg";
import { deviceHeight, deviceWidth } from "../constants/Scalling";

const Wrapper = ({ children, style }) => {
    return (
        <ImageBackground source={BG} resizeMode="cover" style={styles.container}>
            <View style={[styles.safeAreaView, { ...style }]}>{children}</View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    safeAreaView: {
        width: deviceWidth,
        height: deviceHeight,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Wrapper;
