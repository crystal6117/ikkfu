import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ANKI_SERVER_ADDRESS, ANKI_SERVER_PORT } from "./constraints";

export const callAPI = (type, param) => {
    return new Promise(async (resolve, reject) => {
        const serverAddr = await AsyncStorage.getItem(ANKI_SERVER_ADDRESS);
        const port = await AsyncStorage.getItem(ANKI_SERVER_PORT);
        let data = null;
        switch (type) {
            case 'home':
                data = { action: "guiCurrentCard", version: 6 };
                break;
            case 'right':
                data = { action: "guiAnswerCard", version: 6, params: { ease: 2 } };
                break;
            case 'down':
                data = { action: "guiAnswerCard", version: 6, params: { ease: 3 } };
                break;
            case 'left':
                data = { action: "guiAnswerCard", version: 6, params: { ease: 1 } };
                break;
            case 'up':
                data = { action: "suspend", version: 6, params: { cards: [param] } };
                break;
            default:
                data = null;
                break;
        }

        axios.post(`http://${serverAddr}:${port}`, data).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(JSON.stringify(error));
            reject(error);
        })
    })
}

export const deckNames = () => {
    return new Promise(async (resolve, reject) => {

        const serverAddr = await AsyncStorage.getItem(ANKI_SERVER_ADDRESS);
        const port = await AsyncStorage.getItem(ANKI_SERVER_PORT);
        axios.post(
            `http://${serverAddr}:${port}`,
            {
                action: "deckNames",
                version: 6,
                params: {}
            }
        ).then(res => {
            const decks = res.data.result;
            resolve(decks[decks.length - 1]);
        }).catch(error => {
            console.log(JSON.stringify(error));
            reject(error);
        })
    })
}

export const deckReview = (deck) => {
    return new Promise(async (resolve, reject) => {

        const serverAddr = await AsyncStorage.getItem(ANKI_SERVER_ADDRESS);
        const port = await AsyncStorage.getItem(ANKI_SERVER_PORT);
        axios.post(
            `http://${serverAddr}:${port}`,
            {
                action: "guiDeckReview",
                version: 6,
                params: {name: deck}
            }
        ).then(res => {
            resolve(res.data.result);
        }).catch(error => {
            console.log(JSON.stringify(error));
            reject(error);
        })
    })
}

export const showAnswer = () => {
    return new Promise(async (resolve, reject) => {

        const serverAddr = await AsyncStorage.getItem(ANKI_SERVER_ADDRESS);
        const port = await AsyncStorage.getItem(ANKI_SERVER_PORT);
        axios.post(
            `http://${serverAddr}:${port}`,
            {
                action: "guiShowAnswer",
                version: 6,
                params: {}
            }
        ).then(res => {
            resolve(res.data.result);
        }).catch(error => {
            console.log(JSON.stringify(error));
            reject(error);
        })
    })
}