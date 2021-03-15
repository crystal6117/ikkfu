import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './main';
import HomeScreen from './home';
import { Animated, Easing } from 'react-native';

const Stack = createStackNavigator();

function forHorizontalModal({
    current,
    next,
    inverted,
    layouts: { screen }
}) {
    const translateFocused = Animated.multiply(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screen.width, 0],
            extrapolate: "clamp"
        }),
        inverted
    );

    const overlayOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.07],
        extrapolate: "clamp"
    });

    const shadowOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
        extrapolate: "clamp"
    });

    return {
        cardStyle: {
            transform: [
                // Translation for the animation of the current card
                { translateX: translateFocused },
                // Translation for the animation of the card in back
                { translateX: 0 }
            ]
        },
        overlayStyle: { opacity: overlayOpacity },
        shadowStyle: { shadowOpacity }
    };
}

function forVerticalModal({
    current,
    next,
    inverted,
    layouts: { screen }
}) {
    const translateFocused = Animated.multiply(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screen.height, 0],
            extrapolate: "clamp"
        }),
        inverted
    );

    const overlayOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.07],
        extrapolate: "clamp"
    });

    const shadowOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
        extrapolate: "clamp"
    });

    return {
        cardStyle: {
            transform: [
                // Translation for the animation of the current card
                { translateY: translateFocused },
                // Translation for the animation of the card in back
                { translateY: 0 }
            ]
        },
        overlayStyle: { opacity: overlayOpacity },
        shadowStyle: { shadowOpacity }
    };
}

const AppNavigator = () => {
    const config = {
        animation: 'timing',
        config: {
            duration: 1000,
            easing: Easing.ease
        },
    };

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="home" headerMode="none">
                <Stack.Screen
                    name="home"
                    component={HomeScreen}
                    initialParams={{ parameter: "home" }}
                />
                <Stack.Screen
                    name="right"
                    component={MainScreen}
                    initialParams={{ parameter: "right" }}
                    options={{
                        gestureDirection: 'horizontal-inverted',
                        cardStyleInterpolator: forHorizontalModal
                    }}
                />
                <Stack.Screen
                    name="left"
                    component={MainScreen}
                    initialParams={{ parameter: "left" }}
                    options={{
                        gestureDirection: 'horizontal',
                        cardStyleInterpolator: forHorizontalModal
                    }}
                />
                <Stack.Screen
                    name="up"
                    component={MainScreen}
                    initialParams={{ parameter: "up" }}
                    options={{
                        gestureDirection: 'vertical',
                        cardStyleInterpolator: forVerticalModal
                    }}
                />
                <Stack.Screen
                    name="down"
                    component={MainScreen}
                    initialParams={{ parameter: "down" }}
                    options={{
                        gestureDirection: 'vertical-inverted',
                        cardStyleInterpolator: forVerticalModal
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;