import axios from '../lib/axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUser(email, password) {
    console.log('vô getuser');
    console.log('email: ', email);
    console.log('password: ', password);

    const response = await axios.post('/Auth/login', {
        email: email,
        password: password
    })
    console.log('response: ', response.data);
    const token = response.data.accessToken
    const userID = response.data.userViewLogin.id;
    console.log(userID)

    await AsyncStorage.setItem('userID', userID);

    return token

}