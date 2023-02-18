import axios from 'axios'
import EncryptedStorage from 'react-native-encrypted-storage';
import configuration from '../config.js'


const IP = configuration.ip
const PORT = configuration.port
const CLIENT_ID = configuration.clientId

const STORAGE_TOKEN = 'token'
const STORAGE_REFRESH = 'refresh_token'
const STORAGE_EXPIRE = 'expires_in'
const LOGGED = 'logged'

const getBaseUrl = () => {
    if (configuration.ssl)
        return `https://${IP}:${PORT}`
    else
        return `http://${IP}:${PORT}`
}

export const getClientId = () => {
    return configuration.clientId
}

const getConfiguration = async () => {
    let conf = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    try {
        const token = await EncryptedStorage.getItem(STORAGE_TOKEN);
        if (token) {
            conf.headers['Authorization'] = `Bearer ${token}`
        }
    } catch (err) {
    }
    return conf
}

export const get = async (api) => {


    const url = `${getBaseUrl()}${api}`
    try {
        const conf = await getConfiguration()
        const res = await axios.get(url, conf)
        console.log('RISPOSTA GET', res.status, res.statusText, res.data);
        return res.data
    } catch (err) {
        console.log("$$ DBG get error", Object.keys(err), err.config, err.request, err.response)
        throw err
    }
}

export const post = async (api, body) => {
    const url = `${getBaseUrl()}${api}`
    try {
        const conf = await getConfiguration()
        const res = await axios.post(url, body, conf)
        console.log('RISPOSTA POST', res.status, res.statusText, res.data);
        return res.data
    } catch (err) {
        console.log("$$ DBG post error", Object.keys(err), err.config, err.request, err.response)
        throw err
    }
}

export const deleteApi = async (api) => {
    const url = `${getBaseUrl()}/${api}`
    try {
        const conf = await getConfiguration()
        await axios.delete(url, conf)
    } catch (err) {
        throw err
    }
}

export const login = async (email, password) => {
    console.log(getBaseUrl());
    const url = `${getBaseUrl()}/login?email=${email}&password=${password}`

    try {
        const conf = await getConfiguration()
        const res = await axios.get(url, conf)
        console.log('RISPOSTA LOGIN', res.status, res.statusText, res.data);

        const {token, refresh_token, expiry} = res.data
        // console.log("$$$$LOgin token ", token)
        await EncryptedStorage.setItem(STORAGE_TOKEN, token)
        await EncryptedStorage.setItem(STORAGE_REFRESH, refresh_token)
        await EncryptedStorage.setItem(STORAGE_EXPIRE, expiry.toString())
        await EncryptedStorage.setItem(LOGGED, "true")
    } catch (err) {
        console.log("$$ DBG login error", err.toString())
        throw err
    }
}

export const logout = async ({navigation}) => {
    try {
        clearStorage();
        navigation.navigate('Login')
    } catch (err) {
        console.log("$$ DBG logout error", err.toString())
        throw err
    }
}

export const clearStorage = async () => {
    try {
        await EncryptedStorage.clear();
        // Congrats! You've just cleared the device storage!
    } catch (error) {
        // There was an error on the native side
    }
}


export const refreshApi = () => {
}
