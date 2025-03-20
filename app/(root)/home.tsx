import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getDetails, signOut } from "@/api/backend"
import { Ionicons } from '@expo/vector-icons'

const Home = () => {
    const [userDetails, setUserDetails] = useState(null)
    const [loading, setLoading] = useState(true)

    const getUserDetails = async () => {
        try {
            setLoading(true)
            const userId = await AsyncStorage.getItem('userId')
            if (userId) {
                await getDetails(userId)
                const details = await AsyncStorage.getItem('userDetails')
                if (details) {
                    setUserDetails(JSON.parse(details))
                }
            }
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUserDetails()
    }, [])

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-primary-900 font-JakartaBold">Loading...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-primary-900">
            <StatusBar barStyle="light-content" />

            {/* Header Section */}
            <View className="px-4 py-2 flex-row justify-between items-center">
                <View>
                    <Text className="text-white font-JakartaBold text-lg">Welcome back,</Text>
                    <Text className="text-white font-JakartaExtraBold text-xl">
                        {userDetails?.parent?.name || "Parent"}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleSignOut}
                    className="bg-white/20 p-2 rounded-full"
                >
                    <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView className="flex-1 bg-gray-50 rounded-t-3xl mt-2 pt-4">
                {/* Children Section */}
                <View className="px-4 mb-4">
                    <Text className="font-JakartaBold text-gray-800 text-lg mb-2">Your Children</Text>

                    {userDetails?.students?.map((student, index) => (
                        <View key={index} className="bg-white p-4 rounded-xl shadow mb-3">
                            <View className="flex-row items-center mb-3">
                                <View className="w-12 h-12 bg-primary-900/10 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="person" size={24} color="#0057FF" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-JakartaBold text-gray-900 text-lg">{student.name}</Text>
                                    <Text className="font-JakartaMedium text-gray-600">{student.school}</Text>
                                </View>
                            </View>

                            {/* Latest Attendance */}
                            {student.latest_attendance && (
                                <View className="bg-primary-900/5 p-3 rounded-lg mb-3">
                                    <Text className="font-JakartaBold text-primary-900 mb-1">Latest Activity</Text>
                                    <Text className="font-JakartaMedium text-gray-700">
                                        {student.latest_attendance.status === "picked_up" ? "Picked up" : "Dropped off"}
                                        {" at "}
                                        {new Date(student.latest_attendance.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </Text>
                                </View>
                            )}

                            {/* Travel Info */}
                            <View className="flex-row justify-between">
                                <View className="flex-1 bg-blue-50 p-3 rounded-lg mr-2">
                                    <Text className="font-JakartaBold text-blue-800 mb-1">Pick-up</Text>
                                    <Text className="font-JakartaMedium text-gray-700 text-sm">
                                        {student.pickup_location?.address || "Not specified"}
                                    </Text>
                                </View>
                                <View className="flex-1 bg-green-50 p-3 rounded-lg">
                                    <Text className="font-JakartaBold text-green-800 mb-1">Drop-off</Text>
                                    <Text className="font-JakartaMedium text-gray-700 text-sm">
                                        {student.dropoff_location?.address || "Not specified"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Driver Section */}
                {userDetails?.students?.[0]?.driver && (
                    <View className="px-4 mb-4">
                        <Text className="font-JakartaBold text-gray-800 text-lg mb-2">Driver Information</Text>
                        <View className="bg-white p-4 rounded-xl shadow">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="car" size={24} color="#F59E0B" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-JakartaBold text-gray-900">{userDetails.students[0].driver.name}</Text>
                                    <Text className="font-JakartaMedium text-gray-600">{userDetails.students[0].driver.phone}</Text>
                                </View>
                                <TouchableOpacity
                                    className="bg-primary-900 p-2 rounded-full"
                                >
                                    <Ionicons name="call" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <Text className="font-JakartaMedium text-gray-700">
                                    Vehicle: {userDetails.students[0].driver.vehicle_number || "Not specified"}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Quick Actions */}
                <View className="px-4 mb-8">
                    <Text className="font-JakartaBold text-gray-800 text-lg mb-2">Quick Actions</Text>
                    <View className="flex-row flex-wrap justify-between">
                        <TouchableOpacity className="bg-white p-4 rounded-xl shadow w-[48%] mb-3 items-center">
                            <Ionicons name="notifications-outline" size={28} color="#0057FF" />
                            <Text className="font-JakartaBold text-gray-800 mt-2">Notifications</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-xl shadow w-[48%] mb-3 items-center">
                            <Ionicons name="map-outline" size={28} color="#0057FF" />
                            <Text className="font-JakartaBold text-gray-800 mt-2">Track Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-xl shadow w-[48%] mb-3 items-center">
                            <Ionicons name="calendar-outline" size={28} color="#0057FF" />
                            <Text className="font-JakartaBold text-gray-800 mt-2">Attendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-4 rounded-xl shadow w-[48%] mb-3 items-center">
                            <Ionicons name="settings-outline" size={28} color="#0057FF" />
                            <Text className="font-JakartaBold text-gray-800 mt-2">Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home