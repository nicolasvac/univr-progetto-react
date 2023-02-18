//import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';
import Login from "./views/Login"
import Logged from "./views/Logged"
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';


const Stack = createStackNavigator();

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log('Message handled in the background!', remoteMessage);
});


export default function App() {


  checkPermission = async () => {
    if (Platform.OS === "ios") {
      try {
        await messaging().registerDeviceForRemoteMessages();
        await messaging().setAutoInitEnabled(true);
      } catch (iosErr) {
        // console.log("$$$ DBG iOS message register", iosErr)
      }
    }
    try {
      const enabled = await messaging().hasPermission();
      // If Premission granted proceed towards token fetch
      if (enabled) {
        this.getToken();
      } else {
        // If permission hasn’t been granted to our app, request user in requestPermission method. 
        this.requestPermission();
      }
    } catch (err) {
      console.log("Error in check permissions", err)
    }
  }

  getToken = async () => {
    try {
      let fcmToken = await EncryptedStorage.getItem('fcmToken');
      if (!fcmToken) {
        fcmToken = await messaging().getToken();
        // console.log("$$ DBG FCM Token is", fcmToken)
        if (fcmToken) {
          await EncryptedStorage.setItem('fcmToken', fcmToken);
        }
      } else {
        // console.log("$$ DBG Token from storage", fcmToken)
      }
    } catch (err) {
      console.log("Error in get token", err)
    }
  }

  requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected', error);
    }
  }

  useEffect(() => {
    checkPermission()
  }, []);

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log('£££ A new FCM message arrived!', JSON.stringify(remoteMessage));

      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: "jp-channel-id", // (required) channelId, if the channel doesn't exist, notification will not trigger.
        actions: "No", // (Android only) See the doc for notification actions to know more
        /* iOS and Android properties */
        title: remoteMessage?.notification?.title, // (optional)
        message: remoteMessage?.notification?.body, // (required)
        priority: 'high',
        visibility: 'public',
        invokeApp: true,
        allowWhileIdle: true,
        vibrate: true,

      });
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <MenuProvider>
        <StatusBar backgroundColor="#3198FF" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Logged" component={Logged} />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    </>
  );
}




const styles = StyleSheet.create({


});
