import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ANKI_SERVER_ADDRESS, ANKI_SERVER_PORT } from './constraints';
import SwipeScreen from './main';

const Screen = () => {
    const [loading, setLoading] = useState(true);
    const [serverAddr, setServerAddr] = useState('');
    const [serverPort, setServerPort] = useState('');
    const [swipable, setSwipable] = useState(false);

    useEffect(() => {
        (async () => {
            const addr = await AsyncStorage.getItem(ANKI_SERVER_ADDRESS);
            const port = await AsyncStorage.getItem(ANKI_SERVER_PORT);
            setServerAddr(addr);
            setServerPort(port ? port : 8765);
            setLoading(false);
        })();
    }, []);

    const saveInfo = () => {
        AsyncStorage.setItem(ANKI_SERVER_ADDRESS, `${serverAddr}`);
        AsyncStorage.setItem(ANKI_SERVER_PORT, `${serverPort}`);
        setSwipable(serverAddr ? true : false);
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="gray" />
            </View>
        )
    }

    return swipable ? (
        <SwipeScreen />
    ) : (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 20
                }}
            >
                <View style={styles.formRow}>
                    <View style={{ width: 100 }}>
                        <Text>IP Address:</Text>
                    </View>
                    <TextInput
                        onChangeText={(val) => setServerAddr(val)}
                        style={styles.input}
                        value={`${serverAddr ? serverAddr : ''}`}
                    />
                </View>

                <View style={styles.formRow}>
                    <View style={{ width: 100 }}>
                        <Text>Port:</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        onChangeText={(val) => setServerPort(val)}
                        style={styles.input}
                        value={`${serverPort ? serverPort : ''}`}
                    />
                </View>

                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <TouchableOpacity onPress={saveInfo}>
                        <Text style={{color: 'blue', fontSize: 16}}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
}

export default Screen;

const styles = StyleSheet.create({
    formRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    input: {
        borderColor: 'lightgray',
        borderWidth: 1,
        flex: 1,
        height: 37,
        paddingHorizontal: 10
    }
})