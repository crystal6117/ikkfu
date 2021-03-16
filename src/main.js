import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, View, useWindowDimensions, TouchableOpacity } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { callAPI, deckNames, deckReview, showAnswer } from './api';
import HTML from "react-native-render-html";

const Screen = () => {
    const route = useRoute();
    const parameter = route.params?.parameter;
    const cardId = route.params?.cardId;
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [content, setContent] = useState('');
    const [result, setResult] = useState({});
    const [answerShowed, setAnswerShowed] = useState(false);

    const init = async () => {
        try {
            if (parameter != 'home') {
                console.log(parameter, cardId);
                await callAPI(parameter, cardId);
            }

            const deck = await deckNames();
            const review = await deckReview(deck);
            console.log(deck, review)
            const res = await callAPI('home')

            setResult({
                cardId: res?.result?.cardId,
                question: res?.result?.question,
                answer: res?.result?.answer,
            });
            setContent("<div class='card'>" + res?.result?.question + "</div>");
            setLoading(false);
        } catch (error) {
            setContent("Error in calling api.")
            setLoading(false);
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
                        {
                            answerShowed ? (
                                <HTML
                                    source={{ html: content }}
                                    contentWidth={contentWidth}
                                />
                            ) : (
                                <TouchableOpacity onPress={tapQuestion}>
                                    <HTML
                                        source={{ html: content }}
                                        contentWidth={contentWidth}
                                    />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                )
            }
        </GestureRecognizer>
    )
}

export default Screen;