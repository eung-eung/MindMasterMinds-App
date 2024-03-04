import axios from '../lib/axios'

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
    return token

}