import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LudoBoard from "../screens/LudoBoard";
import Splash from "../screens/Splash";
import Home from "../screens/Home";
import { navigationRef } from "../helpers/NavigationUtil";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="LudoBoard"
                    component={LudoBoard}
                    options={{
                        animation: "fade",
                    }}
                />
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                    options={{
                        animation: "fade",
                    }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        animation: "fade",
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
