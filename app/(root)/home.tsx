import {View, Text, TouchableOpacity, ScrollView, StatusBar, Linking, RefreshControl} from 'react-native'
import React, {useEffect, useState, useCallback} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage"
import {getDetails, signOut} from "@/api/backend"
import {Ionicons, MaterialIcons, FontAwesome5} from '@expo/vector-icons'
import MapView, {Marker} from 'react-native-maps'

interface Location {
    latitude: string;
    longitude: string;
}

interface Driver {
    name: string;
    phone: string;
}

interface Attendance {
    date: string;
    morning_ride_status: string;
    morning_attendance_status: string;
    afternoon_ride_status: string;
    afternoon_attendance_status: string;
}

interface Student {
    name: string;
    school: string;
    latest_attendance?: Attendance;
    pickup_location?: Location;
    dropoff_location?: Location;
    driver?: Driver;
}

interface Parent {
    name: string;
    phone: string;
}

interface UserDetails {
    parent?: Parent;
    students?: Student[];
}

// Add proper types to helper functions
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {weekday: 'short', day: 'numeric', month: 'short'});
};

interface AttendanceStatusProps {
    label: string;
    status: string;
    icon: string;
}



const Home = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const getUserDetails = async (): Promise<void> => {
        try {
            setLoading(true);
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                await getDetails(userId);
                const details = await AsyncStorage.getItem('userDetails');
                if (details) {
                    setUserDetails(JSON.parse(details));
                }
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async (): Promise<void> => {
        setRefreshing(true);
        await getUserDetails();
        setRefreshing(false);
    }, []);

    const handleCallDriver = (phone: string): void => {
        Linking.openURL(`tel:${phone}`);
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-primary-900 font-Jakarta-Bold">Loading...</Text>
            </View>
        );
    }
    return (
        <SafeAreaView className="flex-1 bg-primary-900">
            <StatusBar barStyle="light-content"/>

            {/* Header Section */}
            <View className="px-5 py-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-white font-Jakarta-Medium text-base">Welcome back,</Text>
                    <Text className="text-white font-Jakarta-Bold text-xl">
                        {userDetails?.parent?.name || "Parent"}
                    </Text>
                    <Text className="text-white/80 font-Jakarta-Medium text-sm">
                        {userDetails?.parent?.phone}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={signOut}
                    className="bg-white/20 p-2.5 rounded-full"
                >
                    <Ionicons name="log-out-outline" size={24} color="white"/>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView
                className="flex-1 bg-gray-50 rounded-t-3xl pt-5"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0057FF"]}/>
                }
            >
                {/* Children Section */}
                <View className="px-5 mb-5">
                    <Text className="font-Jakarta-Bold text-gray-800 text-lg mb-3">Your Children</Text>

                    {userDetails?.students?.map((student, index) => (
                        <View key={index} className="bg-white p-5 rounded-xl shadow-sm mb-5">
                            <View className="flex-row items-center mb-4">
                                <View
                                    className="w-12 h-12 bg-primary-900 rounded-full items-center justify-center mr-3">
                                    <Text className="font-Jakarta-Bold text-white text-lg">
                                        {student.name.charAt(0)}
                                    </Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="font-Jakarta-Bold text-gray-900 text-lg">{student.name}</Text>
                                    <Text className="font-Jakarta-Medium text-gray-600">{student.school}</Text>
                                </View>
                                <View className="bg-green-100 px-3 py-1.5 rounded-full">
                                    <Text className="font-Jakarta-Medium text-green-700 text-xs">Active</Text>
                                </View>
                            </View>

                            {/* Latest Attendance */}
                            {student.latest_attendance && (
                                <View className="bg-white border border-primary-900/10 rounded-xl mb-5 overflow-hidden">
                                    <View className="bg-primary-900 px-4 py-3 flex-row justify-between items-center">
                                        <Text className="font-Jakarta-Bold text-white text-base">Today's Status</Text>
                                        <Text className="font-Jakarta-Medium text-white/80 text-xs">
                                            {formatDate(student.latest_attendance.date)}
                                        </Text>
                                    </View>

                                    <View className="p-4">
                                        {/* Status Cards Row */}
                                        <View className="flex-col justify-between">
                                            {/* Morning Column */}
                                            <View>
                                                <View className="bg-gray-50 rounded-xl p-3">
                                                    <Text
                                                        className="font-Jakarta-SemiBold text-primary-900 text-center mb-2">
                                                        Morning
                                                    </Text>

                                                    {/* Morning Pickup Status */}
                                                    <View
                                                        className="bg-white rounded-lg p-3 mb-2 border border-gray-100">
                                                        <View className="flex-row items-center justify-between">
                                                            <View className="flex-row items-center">
                                                                <MaterialIcons name="directions-bus" size={16}
                                                                               color="#0057FF"/>
                                                                <Text
                                                                    className="font-Jakarta-Medium text-gray-700 text-sm ml-2">
                                                                    Transport
                                                                </Text>
                                                            </View>
                                                            <View className={`px-2 py-0.5 rounded-full ${
                                                                student.latest_attendance.morning_attendance_status === "ABSENT"
                                                                    ? "bg-gray-100"
                                                                    : (student.latest_attendance.morning_ride_status === "PICKED_UP"
                                                                        ? "bg-green-100"
                                                                        : "bg-amber-100")
                                                            }`}>
                                                                <Text className={`text-xs font-Jakarta-SemiBold ${
                                                                    student.latest_attendance.morning_attendance_status === "ABSENT"
                                                                        ? "text-gray-700"
                                                                        : (student.latest_attendance.morning_ride_status === "PICKED_UP"
                                                                            ? "text-green-700"
                                                                            : "text-amber-700")
                                                                }`}>
                                                                    {student.latest_attendance.morning_attendance_status === "ABSENT"
                                                                        ? "NOT AVAILABLE"
                                                                        : student.latest_attendance.morning_ride_status}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    {/* Morning School Status */}
                                                    <View className="bg-white rounded-lg p-3 border border-gray-100">
                                                        <View className="flex-row items-center justify-between">
                                                            <View className="flex-row items-center">
                                                                <MaterialIcons name="school" size={16} color="#0057FF"/>
                                                                <Text
                                                                    className="font-Jakarta-Medium text-gray-700 text-sm ml-2">
                                                                    School
                                                                </Text>
                                                            </View>
                                                            <View className={`px-2 py-0.5 rounded-full ${
                                                                student.latest_attendance.morning_attendance_status === "PRESENT"
                                                                    ? "bg-green-100"
                                                                    : "bg-amber-100"
                                                            }`}>
                                                                <Text className={`text-xs font-Jakarta-SemiBold ${
                                                                    student.latest_attendance.morning_attendance_status === "PRESENT"
                                                                        ? "text-green-700"
                                                                        : "text-amber-700"
                                                                }`}>
                                                                    {student.latest_attendance.morning_attendance_status}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                            {/* Afternoon Column */}
                                            <View>
                                                <View className="bg-gray-50 rounded-xl p-3">
                                                    <Text
                                                        className="font-Jakarta-SemiBold text-primary-900 text-center mb-2">
                                                        Afternoon
                                                    </Text>

                                                    {/* Afternoon Transport Status */}
                                                    <View
                                                        className="bg-white rounded-lg p-3 mb-2 border border-gray-100">
                                                        <View className="flex-row items-center justify-between">
                                                            <View className="flex-row items-center">
                                                                <MaterialIcons name="directions-bus" size={16}
                                                                               color="#0057FF"/>
                                                                <Text
                                                                    className="font-Jakarta-Medium text-gray-700 text-sm ml-2">
                                                                    Transport
                                                                </Text>
                                                            </View>
                                                            <View className={`px-2 py-0.5 rounded-full ${
                                                                student.latest_attendance.afternoon_attendance_status === "ABSENT"
                                                                    ? "bg-gray-100"
                                                                    : (student.latest_attendance.afternoon_ride_status === "DROPPED"
                                                                        ? "bg-green-100"
                                                                        : "bg-amber-100")
                                                            }`}>
                                                                <Text className={`text-xs font-Jakarta-SemiBold ${
                                                                    student.latest_attendance.afternoon_attendance_status === "ABSENT"
                                                                        ? "text-gray-700"
                                                                        : (student.latest_attendance.afternoon_ride_status === "DROPPED"
                                                                            ? "text-green-700"
                                                                            : "text-amber-700")
                                                                }`}>
                                                                    {student.latest_attendance.afternoon_attendance_status === "ABSENT"
                                                                        ? "NOT AVAILABLE"
                                                                        : student.latest_attendance.afternoon_ride_status}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    {/* Afternoon School Status */}
                                                    <View className="bg-white rounded-lg p-3 border border-gray-100">
                                                        <View className="flex-row items-center justify-between">
                                                            <View className="flex-row items-center">
                                                                <MaterialIcons name="school" size={16} color="#0057FF"/>
                                                                <Text
                                                                    className="font-Jakarta-Medium text-gray-700 text-sm ml-2">
                                                                    School
                                                                </Text>
                                                            </View>
                                                            <View className={`px-2 py-0.5 rounded-full ${
                                                                student.latest_attendance.afternoon_attendance_status === "PRESENT"
                                                                    ? "bg-green-100"
                                                                    : "bg-amber-100"
                                                            }`}>
                                                                <Text className={`text-xs font-Jakarta-SemiBold ${
                                                                    student.latest_attendance.afternoon_attendance_status === "PRESENT"
                                                                        ? "text-green-700"
                                                                        : "text-amber-700"
                                                                }`}>
                                                                    {student.latest_attendance.afternoon_attendance_status}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View className="flex-row justify-center mt-3">
                                            <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full">
                                                <MaterialIcons name="access-time" size={14} color="#6B7280"/>
                                                <Text className="text-gray-500 text-xs font-Jakarta-Medium ml-1">
                                                    Last updated {new Date().toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Locations Map */}
                            {(student.pickup_location || student.dropoff_location) && (
                                <View className="mb-5">
                                    <Text className="font-Jakarta-Bold text-gray-800 mb-3">Pickup & Dropoff
                                        Locations</Text>
                                    <View className="h-52 rounded-xl overflow-hidden shadow-sm">
                                        <MapView
                                            style={{width: '100%', height: '100%'}}
                                            initialRegion={{
                                                latitude: parseFloat(student.pickup_location?.latitude || student.dropoff_location?.latitude || "0"),
                                                longitude: parseFloat(student.pickup_location?.longitude || student.dropoff_location?.longitude || "0"),
                                                latitudeDelta: 0.01,
                                                longitudeDelta: 0.01,
                                            }}
                                            mapType="standard"
                                        >
                                            {student.pickup_location && (
                                                <Marker
                                                    coordinate={{
                                                        latitude: parseFloat(student.pickup_location.latitude),
                                                        longitude: parseFloat(student.pickup_location.longitude),
                                                    }}
                                                    title="Pickup Location"
                                                    pinColor="blue"
                                                />
                                            )}
                                            {student.dropoff_location && (
                                                <Marker
                                                    coordinate={{
                                                        latitude: parseFloat(student.dropoff_location.latitude),
                                                        longitude: parseFloat(student.dropoff_location.longitude),
                                                    }}
                                                    title="Dropoff Location"
                                                    pinColor="green"
                                                />
                                            )}
                                        </MapView>
                                    </View>
                                    <View className="flex-row mt-2.5">
                                        <View className="flex-row items-center mr-4">
                                            <View className="w-3 h-3 rounded-full bg-blue-500 mr-2"/>
                                            <Text className="text-xs font-Jakarta-Medium">Pickup</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <View className="w-3 h-3 rounded-full bg-green-500 mr-2"/>
                                            <Text className="text-xs font-Jakarta-Medium">Dropoff</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Driver Information */}
                            {student.driver && (
                                <View className="bg-gray-50 p-4 rounded-xl">
                                    <Text className="font-Jakarta-SemiBold text-gray-700 mb-2.5">Driver
                                        Information</Text>
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center flex-1">
                                            <View
                                                className="w-11 h-11 bg-yellow-100 rounded-full items-center justify-center mr-3">
                                                <FontAwesome5 name="user-tie" size={16} color="#F59E0B"/>
                                            </View>
                                            <View className="flex-1">
                                                <Text
                                                    className="font-Jakarta-SemiBold text-gray-800">{student.driver.name}</Text>
                                                <Text
                                                    className="font-Jakarta-Medium text-gray-600 text-sm">{student.driver.phone}</Text>
                                            </View>
                                        </View>
                                        {student.driver && (
                                            <TouchableOpacity
                                                onPress={() => handleCallDriver(student.driver!.phone)}
                                                className="bg-primary-900 p-2.5 rounded-full"
                                            >
                                                <Ionicons name="call" size={20} color="white" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <View className="px-5 mb-6">
                    <Text className="font-Jakarta-Bold text-gray-800 text-lg mb-3">Quick Actions</Text>
                    <View className="flex-row flex-wrap justify-between">
                        <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4 items-center">
                            <View className="w-14 h-14 bg-blue-50 rounded-full items-center justify-center mb-2">
                                <Ionicons name="notifications-outline" size={24} color="#0057FF"/>
                            </View>
                            <Text className="font-Jakarta-SemiBold text-gray-800">Notifications</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4 items-center">
                            <View className="w-14 h-14 bg-blue-50 rounded-full items-center justify-center mb-2">
                                <Ionicons name="location-outline" size={24} color="#0057FF"/>
                            </View>
                            <Text className="font-Jakarta-SemiBold text-gray-800">Live Tracking</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4 items-center">
                            <View className="w-14 h-14 bg-blue-50 rounded-full items-center justify-center mb-2">
                                <Ionicons name="calendar-outline" size={24} color="#0057FF"/>
                            </View>
                            <Text className="font-Jakarta-SemiBold text-gray-800">Attendance</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4 items-center">
                            <View className="w-14 h-14 bg-blue-50 rounded-full items-center justify-center mb-2">
                                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0057FF"/>
                            </View>
                            <Text className="font-Jakarta-SemiBold text-gray-800">Message Driver</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Emergency Contact */}
                <View className="px-5 mb-8">
                    <TouchableOpacity className="bg-red-50 p-4 rounded-xl border border-red-100 flex-row items-center">
                        <View className="w-11 h-11 bg-red-100 rounded-full items-center justify-center mr-3">
                            <Ionicons name="warning-outline" size={22} color="#DC2626"/>
                        </View>
                        <View className="flex-1">
                            <Text className="font-Jakarta-Bold text-red-700">Emergency Contact</Text>
                            <Text className="font-Jakarta-Medium text-red-600 text-sm">Call school admin in
                                emergency</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#DC2626"/>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home