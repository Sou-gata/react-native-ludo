import { Image, StyleSheet, Animated, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import Logo from "../assets/images/logo.png";
import { deviceHeight, deviceWidth } from "../constants/Scalling";
import { prepareNavigation, resetAndNavigate } from "../helpers/NavigationUtil";

const Splash = () => {
    const [isStop, setIsStop] = useState(false);
    const scale = new Animated.Value(1);

    useEffect(() => {
        prepareNavigation();
        const timeout = setTimeout(() => {
            resetAndNavigate("Home");
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        const breathingAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        if (!isStop) {
            breathingAnimation.start();
        }
        return () => {
            breathingAnimation.stop();
        };
    }, [isStop]);

    return (
        <Wrapper>
            <Animated.View style={[styles.imgContainer, { transform: [{ scale }] }]}>
                <Image source={Logo} style={styles.logo} />
            </Animated.View>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.creator}>By Sougata Talukdar</Text>
        </Wrapper>
    );
};

export default Splash;

const styles = StyleSheet.create({
    imgContainer: {
        width: deviceWidth * 0.7,
        height: deviceHeight * 0.6,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    creator: {
        color: "white",
        fontSize: 20,
        position: "absolute",
        bottom: 20,
    },
});
