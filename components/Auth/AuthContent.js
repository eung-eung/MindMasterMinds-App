import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AuthForm from './AuthForm'
import { GlobalStyles } from '../../constants/style'
import FlatButton from '../UI/FlatButton'
export default function AuthContent({ isLogin, onAuthenticate }) {
    const navigation = useNavigation()
    const [credentialsInvalid, setCredentialsInvalid] = useState({
        email: false,
        password: false,
        confirmPassword: false
    })

    const switchAuthModeHandler = () => {
        if (isLogin) {
            navigation.replace('Signup')
        } else {
            navigation.replace('Login')
        }
    }
    const submitHandler = (credentials) => {
        let { email, password, confirmPassword } = credentials;

        email = email.trim();
        password = password.trim();

        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 8;
        const passwordsAreEqual = password === confirmPassword;

        if (
            !emailIsValid ||
            !passwordIsValid ||
            (!isLogin && !passwordsAreEqual)
        ) {
            Alert.alert('Invalid input', 'Please check your entered value.');
            setCredentialsInvalid({
                email: !emailIsValid,
                password: !passwordIsValid,
                confirmPassword: !passwordIsValid || !passwordsAreEqual,
            });
            return;
        }
        onAuthenticate({ email, password });
    }
    return (
        <View style={styles.authContent}>
            <AuthForm
                isLogin={isLogin}
                onSubmit={submitHandler}
                credentialsInvalid={credentialsInvalid}
            />
            <View style={styles.buttons}>
                <FlatButton onPress={switchAuthModeHandler}>
                    {isLogin ? 'Dont have an account? Get started for free' : 'Log in instead'}
                </FlatButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    authContent: {
        marginHorizontal: 32,
        padding: 16,
        borderRadius: 8,
        flex: 1
    },
    buttons: {
        marginTop: 8,
    },
});