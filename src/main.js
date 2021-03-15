import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { callAPI } from './api';

const Screen = () => {
    const route = useRoute();
    const parameter = route.params?.parameter;
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [content, setContent] = useState('');

    useEffect(() => {
        if (parameter === 'home') {
            setLoading(false)
            setContent("Now you can swipe.")
        }
        else {
            callAPI(parameter).then(res => {
                setContent(JSON.stringify(res));
                setLoading(false);
            }).catch(error => {
                setContent("Error in calling api.")
                setLoading(false);
            })
        }
    }, [])

    const gotoNext = (target) => {
        navigation.dispatch(
            StackActions.replace(target)
        );
    }

    const onSwipe = (gestureName, gestureState) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                gotoNext('up');
                break;
            case SWIPE_DOWN:
                gotoNext('down');
                break;
            case SWIPE_LEFT:
                gotoNext('left');
                break;
            case SWIPE_RIGHT:
                gotoNext('right');
                break;
        }
    }

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    return (
        <GestureRecognizer
            onSwipe={(direction, state) => onSwipe(direction, state)}
            config={config}
            style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {
                loading ? (
                        <ActivityIndicator size='large' color="gray" />
                ) : (
                        <View>
                            <Text>{content}</Text>
                        </View>
                    )
            }
        </GestureRecognizer>
    )
}

export default Screen;