import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, TextInput, Image, TouchableOpacity } from 'react-native';
import color from "../color"
import { useTranslation } from 'react-i18next'
import { login, post } from "../api/restManager"
import EncryptedStorage from 'react-native-encrypted-storage';



export default function Login({ navigation }) {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const { t } = useTranslation()



  const handleClickButton = async () => {
    if (loginChecks()) {
      setError(t("error:emptyFields"))
      return
    }

    try {
      setError("")
      await login(email.trim(), password.trim())
      let fcmToken = await EncryptedStorage.getItem('fcmToken');

      var body = new FormData();
      body.append('fb_token', fcmToken)

      await post('/add-firebase-token', body)
      navigation.navigate(t("nav:logged"))
      setError("")
      setEmail("")
      setPassword("")
      // console.log("$$$ Token succes")
    } catch (err) {
      console.log("err",err)
      if (err && (err.toString().includes("Network Error")))
        setError(t("error:noConnection"))
      else if (!err.toString().includes("Network Error"))
        setError(t("error:wrongCredentials"))
      else
        setError(t("error:generic"))
    }
  }

  const loginChecks = () => {
    if (password == "" || email == "")
      return true
    else return false
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.logo}
            source={
              require('../images/logo.jpg')
            }
          />
        </View>

        <SafeAreaView style={styles.safeAreaView}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {setEmail(text), setError("")}}
            placeholder={t("login:email")}
            secureTextEntry={false}
            value={email}

          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => {setPassword(text), setError("")}}
            placeholder={t("login:password")}
            secureTextEntry={true}
            value={password}
          />
          <Text style={styles.errorLabel}>
            {error}
          </Text>
        </SafeAreaView>
        <TouchableOpacity onPress={() => handleClickButton()} style={styles.appButtonContainer}>
          <Text style={styles.appButtonText}>{t("login:login")}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background,
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    backgroundColor: color.white,
    paddingLeft: 10,
    borderRadius: 7,
    color: 'black',
  },
  errorLabel: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center'
  },
  safeAreaView: {
    marginBottom: 30,
  },
  imageContainer: {
    height: 100,
    width: 350,
    paddingLeft: 3,
    paddingRight: 3,
    backgroundColor: color.white,
    borderRadius: 7,
    marginBottom: 100,
  },
  logo: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
    borderRadius: 7,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: color.lightBlue,
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 100,
  },
  appButtonText: {
    fontSize: 15,
    color: color.white,
    alignSelf: "center",
    textTransform: "uppercase"
  },

});
