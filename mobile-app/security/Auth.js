import EncryptedStorage from 'react-native-encrypted-storage';
import {get, getClientId} from "../api/restManager"

class Auth
{
    static instance = null
    static getInstance()
    {
        if (!Auth.instance)
            Auth.instance = new Auth()
        return Auth.instance;
    }

    constructor()
    {
        // this.isAuth = sessionStorage.getItem("isAuth") === "true"
        // this.token = sessionStorage.getItem("token")
        // this.refreshToken = sessionStorage.getItem("refreshToken")
        // if (!this.isAuth)
        // {
        //     this.setIsAuthenticated(false)
        //     this.setToken('')
        //     this.setRefreshToken('')
        // }
        // this.loggedUser = loggedUser
        // this.selectedPatient = {}
    }

    async retrieveUserSession() {
        //json.parse in caso di oggetto parserizzato
        try {   
            const session = await EncryptedStorage.getItem("user_session");
        
            if (session !== undefined) {
                // Congrats! You've just retrieved your first value!
            }
        } catch (error) {
            // There was an error on the native side
        }
    }

    async storeUserSession() {
        try {
            await EncryptedStorage.setItem(
                "user_session",
                JSON.stringify({
                    age : 21,
                    token : "ACCESS_TOKEN",
                    name : "Pippo",
                    surname:"Baudo",
                    gender:"M",
                })
            );
    
            // Congrats! You've just stored your first value!
        } catch (error) {
            // There was an error on the native side
        }
    }

    async removeUserSession() {
        try {
            await EncryptedStorage.removeItem("user_session");setIsAuthenticated
        } catch (error) {
            // There was an error on the native side
        }
    }
    
    async clearStorage() {
        try {
            await EncryptedStorage.clear();
            // Congrats! You've just cleared the device storage!
        } catch (error) {
            // There was an error on the native side
        }
    }


    login(email, password)
    {

        let rest = `/login?email=${email}&password=${password}`;

        var self = this;
        return new Promise(async (resolve, reject) => 
        {
            try 
            {
                let data = await get(rest)
                console.log("$$ DBG login success", data)

                self.setIsAuthenticated(true)
                self.setToken(data.token)
                self.setRefreshToken(data.refresh_token)
                // Just medic or admin can log
                if(self.loggedUser.group.groupName === "patient")
                    return reject("Paziente non ha i permessi")
                    
                return resolve()
            } catch( err) {
                // self.setIsAuthenticated(false)
                // self.setToken('')
                // self.setRefreshToken('') 
                return reject(err) 
            }
       });
    }
    
}

const auth = Auth.getInstance();
export default auth;