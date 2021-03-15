import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ANKI_SERVER_ADDRESS, ANKI_SERVER_PORT } from "./constraints";

export const callAPI = (type) => {
    return new Promise(async (resolve, reject) => {
        const serverAddr = await AsyncStorage.getItem(ANKI_SERVER_ADDRESS);
        const port = await AsyncStorage.getItem(ANKI_SERVER_PORT);
        let data = null;
        switch (type) {
            case 'right':
                data = { action: "guiCurrentCard", version: 6 };
                break;
            case 'down':
                data = { action: "guiAnswerCard", version: 6, params: { ease: 1 } };
                break;
            case 'left':
                data = { action: "guiAnswerCard", version: 6, params: { ease: 1 } };
                break;
            case 'up':
                data = { action: "suspend", version: 6, params: { cards: [] } };
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