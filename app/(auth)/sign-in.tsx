import {View, Text, ScrollView, Alert} from 'react-native'
import React, {useState} from 'react'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import {icons} from '@/constants'
import {Link} from 'expo-router'
import OAuth from "@/components/OAuth"
import {signIn} from "@/api/backend"


const SignIn = () => {

    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
    });

    async function handleSignIn() {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill all the fields");
            return;
        }
        try {
            const response = await signIn(
                form.email,
                form.name,
                form.password
            );
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ScrollView className="flex-1 bg-white ">
            <View className="flex justify-center mt-10  bg-white mx-4 h-full">
                <Text className="text-4xl text-blue-500 font-JakartaExtraBold">Login</Text>
                <Text className="text-lg mt-2 font-JakartaBold  ">Welcome back! Sign in to your account</Text>
                <View className="py-5 px-2 flex justify-center">
                    <InputField
                        label="Email Address"
                        placeholder="Enter your Email"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) => setForm({...form, email: value})}
                    />
                    <InputField
                        label="Username"
                        placeholder="Enter your username"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) => setForm({...form, name: value})}
                    />
                    <InputField
                        label="Password"
                        placeholder="Enter your password"
                        icon={icons.lock}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(value) => setForm({...form, password: value})}
                    />
                    <CustomButton title="Sign In" className='py-4 mt-8' onPress={handleSignIn}/>
                </View>
            </View>
        </ScrollView>
    )
}

export default SignIn
