import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { playSound } from "../helpers/SoundUtility";
import { useSelector } from "react-redux";
import { selectSoundStatus } from "../redux/reducers/gameSelectors";

const GradientButton = ({ title, onPress, icon }) => {
    const isSilent = useSelector(selectSoundStatus);
    return (
        <View
            style={{
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#000",
                marginVertical: 10,
            }}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    if (!isSilent) playSound("ui");
                    onPress();
                }}
                style={styles.btnContainer}
            >
                <LinearGradient
                    colors={["#4c669f", "#3b5998", "#192f6a"]}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {icon}
                    <Text style={styles.buttonText}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default GradientButton;

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    btnContainer: {
        borderWidth: 2,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: "#fff",
        shadowColor: "#d5be3e",
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 10,
        borderColor: "#d5be3e",
        width: 220,
    },
    buttonText: {
        color: "#fff",
        fontSize: RFValue(16),
        width: "70%",
        textAlign: "left",
        fontFamily: "Philosopher-Bold",
        textTransform: "uppercase",
    },
});
