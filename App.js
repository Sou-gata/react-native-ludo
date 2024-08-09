import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./src/navigation/Navigation";

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <StatusBar hidden={true} />
                <Navigation />
            </PersistGate>
        </Provider>
    );
};

export default App;
