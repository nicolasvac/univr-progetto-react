import color from "../color"

import React from "react";
import { Text, View, Pressable } from "react-native";
import { Overlay } from 'react-native-elements'

import X from "../icons/x.svg"
import Check from "../icons/check.svg"
import { useTranslation } from 'react-i18next'
import { logout } from "../api/restManager"


const LogoutOverlay = ({ overlayLogoutVisible, setOverlayLogoutVisible, navigation}) => {

    const { t } = useTranslation()


    const handleLogout = async () => {
        try {
            await logout(navigation = { navigation })
        }
        catch (err) { }
    }

    const toggleOverlayLogOut = () => {
        setOverlayLogoutVisible(!overlayLogoutVisible);
    };

    return (
        <>

            <Overlay isVisible={overlayLogoutVisible} onBackdropPress={toggleOverlayLogOut} borderRadius={10}>
            <Text style={{ fontSize: 20, color: color.black }}>{t("nav:logout")}</Text>
            <View flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                <Pressable onPress={toggleOverlayLogOut} android_ripple={{ color: color.edalabBlue, borderless: false }}
                    backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                    <X height={"20"} width={"30"} fill={"white"} />
                </Pressable>
                <Pressable onPress={() => handleLogout()} android_ripple={{ color: color.edalabBlue, borderless: false }}
                    backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                    <Check height={"20"} width={"30"} fill={"white"} />
                </Pressable>
            </View>
        </Overlay>
        </>
    )
}

export default LogoutOverlay