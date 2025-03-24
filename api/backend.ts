import {Alert} from "react-native";
import {router} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';


const HostName = "http://192.168.1.168:3000";

export const signIn = async (email: string, name: string, password: string) => {
    try {
        console.log(HostName);
        const response = await fetch(`${HostName}/api/parents/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                name,
                password,
            }),
        });
        const data = await response.json();
        if (response.ok) {
            await AsyncStorage.setItem('userId', data.userId.toString());
            await AsyncStorage.setItem('isLoggedIn', 'true');
            Alert.alert('Success', data.message, [
                {text: 'OK', onPress: () => router.replace('/(root)/home')}
            ]);
        } else {
            Alert.alert('Error', data.error || 'Something went wrong');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Network error');
    }
};

export const getDetails = async (userId: string) => {
    try {
        const response = await fetch(`${HostName}/api/parents/get-details/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            await AsyncStorage.setItem('userDetails', JSON.stringify(data));
        } else {
            Alert.alert('Error', data.message || 'Something went wrong');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Network error');
    }
};
export const signOut = async () => {
    try {
        await AsyncStorage.clear();
        router.replace('/(auth)/sign-in');
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Network error');
    }
}
