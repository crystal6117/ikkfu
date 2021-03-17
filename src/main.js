import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, View, useWindowDimensions, TouchableOpacity, Text } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { callAPI, deckNames, deckReview, showAnswer } from './api';
import HTML from "react-native-render-html";

const delayFunc = (mili) => {
    return new Promise((resolve, reject) => {
        if (typeof mili !== 'number') reject();
        setTimeout(() => {
            resolve();
        }, mili)
    })
}

const Screen = () => {
    const route = useRoute();
    const parameter = route.params?.parameter;
    const cardId = route.params?.cardId;
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [content, setContent] = useState('<div></div>');
    const [result, setResult] = useState({});
    const [answerShowed, setAnswerShowed] = useState(false);
    const [toast, showToast] = useState(true);

    const init = async () => {
        try {
            if (parameter != 'home') {
                await callAPI(parameter, cardId);

                switch(parameter) {
                    case 'left':
                        setContent("You got it right! Time for the next one!")
                        break;
                    case 'right':
                        setContent("We'll show this again soon! Let's keep going!")
                        break;
                    case 'down':
                        setContent("Let's show you more related to this prompt!")
                        break;
                }
                await delayFunc(2000);
            }

            const deck = await deckNames();
            const review = await deckReview(deck);
            const res = await callAPI('home')

            setResult({
                cardId: res?.result?.cardId,
                question: res?.result?.question,
                answer: res?.result?.answer,
            });
            setContent("<div class='card'>" + res?.result?.question + "</div>");
            setLoading(false);
            showToast(false)
        } catch (error) {
            setContent(error.toString());
            setLoading(false);
            showToast(false)
        }
    }

    useEffect(() => {
        init();
    }, [])

    const gotoNext = (target, param) => {
        navigation.dispatch(
            StackActions.replace(target, { cardId: param })
        );
    }

    const onSwipe = (gestureName, gestureState) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                gotoNext('up', result.cardId);
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

    const tapQuestion = async () => {
        const res = await showAnswer();
        console.log("res", res);
        setAnswerShowed(true);
        setContent("<div class='card'>" + result.answer + "</div>")
    }

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    const contentWidth = useWindowDimensions().width;
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
                        <HTML
                            source={{ html: content }}
                            contentWidth={contentWidth}
                        />
                    </View>
                )
            }
            {
                (!toast && !answerShowed) && (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 0,
                            right: 0,
                            height: 30,
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity onPress={tapQuestion}>
                            <Text>Tap to see answer.</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </GestureRecognizer>
    )
}

export default Screen;