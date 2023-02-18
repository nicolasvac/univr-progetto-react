import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, FlatList } from 'react-native';
import color from "../color"
import {Divider,  } from 'react-native-elements'
import Hamburger from "../icons/hamburger.svg"
import Logout from "../icons/logout.svg"

import Link from "../icons/link.svg"
import Dot from "../icons/dry-clean.svg"
import { useTranslation } from 'react-i18next'
import { get } from "../api/restManager"
import LogoutOverlay from '../components/LogoutOverlay';

import { Linking } from 'react-native';

export default function MotivationalPdfs({ navigation }) {

    const { t } = useTranslation()

    const [overlayLogoutVisible, setOverlayLogoutVisible] = useState(false);
    const [pdfs, setPdfs] = useState([])

    useEffect(() => {
        getData()
    }, []);

    async function getData() {
        try {
            let data = await get("/multimedia");
            // console.log("$$ DBG getData success", data)
            // data = JSON.parse(JSON.stringify(data))
            if (data) {
                setData(data)
            }

        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG MotivationalPdfs getData error", error)
            if (err && err.toString().includes("Signature has expired")) {
                handleLogout()
            }
        }
    }


    const setData = ({ documents }) => {

        let d0 = []

        documents.forEach(element => {
            let new_item = {
                id: element.id,
                link: element.file_link,
                title: element.title,
                description: element.description
            }
            // console.log("$$new_item",new_item)
            d0.push(new_item)

        })
        // console.log("$$List", d0)

        setPdfs(d0)
    }


    const renderItemList = ({ item, index }) => (
        <ItemList title={item.title} link={item.link} />
    );

    const ItemList = ({ title, link, }) => (
        <>
            <View style={styles.itemContent} flexDirection={"row"}>
                <View flexDirection={"column"} width={"100%"}>
                    <View marginBottom={20} marginRight={5} marginLeft={5} marginTop={5} flexDirection={"row"} justifyContent={"space-between"}>
                        <Dot style={styles.itemIcon} fill={color.black} />
                        <Text style={styles.link} numberOfLines={3}
                            onPress={() => Linking.openURL(link)}>
                            {title}
                        </Text>
                        <Pressable onPress={() => { Linking.openURL(link) }} android_ripple={{ color: color.lightBlue, borderless: true }}>
                            <Link style={styles.itemIconDoc} />
                        </Pressable>
                    </View>
                </View>
            </View>
            <Divider orientation="horizontal" />

        </>
    );


    const toggleOverlayLogOut = () => {
        setOverlayLogoutVisible(!overlayLogoutVisible);
    };


    return (
        <>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => (navigation.openDrawer())} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Hamburger style={styles.topBarIcon} />
                    </Pressable>
                    <Text style={styles.topBarText}>{t("nav:motivationalpdfs")}</Text>
                    <Pressable onPress={toggleOverlayLogOut} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Logout style={styles.topBarIcon} />
                    </Pressable>
                </View>


                {/* LIST */}
                <View style={styles.card}>

                    <SafeAreaView style={styles.contentCardContainer}>
                        <FlatList
                            data={pdfs}
                            renderItem={renderItemList}
                            keyExtractor={item => item.id}

                            nestedScrollEnabled={true}
                        />
                    </SafeAreaView>
                </View>


                <LogoutOverlay overlayLogoutVisible={overlayLogoutVisible} setOverlayLogoutVisible={setOverlayLogoutVisible} navigation={navigation} />

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        paddingBottom: 20,
    },
    topBar: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.lightBlue,
        padding: 10,
    },
    topBarText: {
        color: color.white,
        fontSize: 25,
        fontWeight: "bold",
    },
    topBarIcon: {
        width: 35,
        height: 35,
        color: color.white,
    },
    contentCardContainer: {
        margin: 15,
    },
    card: {
        backgroundColor: color.white,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        height: 300
    },
    itemContent: {
        marginTop: 18,
        backgroundColor: color.white,
    },
    link: {
        color: "blue",
        marginTop: 1,
        width: 250,
        textAlign: 'center'
    },
    itemIcon: {
        width: 8,
        height: 8,
        color: color.black,
        marginTop: 8,
    },
    itemIconDoc: {
        width: 25,
        height: 25,
        color: color.black,
    },
});

