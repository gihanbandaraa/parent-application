import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {Redirect} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const loginStatus = await AsyncStorage.getItem('isLoggedIn');
                setIsLoggedIn(loginStatus);
                setLoading(false);
            } catch (error) {
                console.error('AsyncStorage error:', error);
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }
    if (isLoggedIn === 'false' || isLoggedIn === null) {
        return <Redirect href="/(auth)/welcome"/>;
    }
    if (isLoggedIn === 'true') {
        return <Redirect href="/(root)/home"/>;
    }
    return null;
};

export default Home;
