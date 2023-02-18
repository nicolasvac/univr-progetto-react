import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, FlatList, ScrollView } from 'react-native';
import color from "../color"
import {Divider } from 'react-native-elements'
import Hamburger from "../icons/hamburger.svg"
import Logout from "../icons/logout.svg"

import Play from "../icons/play.svg"
import Pause from "../icons/pause.svg"
import Dot from "../icons/dry-clean.svg"
import { useTranslation } from 'react-i18next'

import YoutubePlayer from 'react-native-youtube-iframe';
import { get } from "../api/restManager"
import LogoutOverlay from '../components/LogoutOverlay';



export default function MotivationalVideos({ navigation }) {

    const { t } = useTranslation()

    const [overlayLogoutVisible, setOverlayLogoutVisible] = useState(false);

    const [playing, setPlaying] = useState(false);

    const [videoId, setVideoId] = useState('')
    const [videos, setVideos] = useState([])




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
            console.log("$$ DBG MotivationalVideos getData error", error)
            if (err && err.toString().includes("Signature has expired")) {
                handleLogout()
            }
        }
    }
    const setData = ({ videos }) => {

        let d0 = []

        videos.forEach(element => {
            let new_item = {
                id: element.id,
                link: element.video_link,
                title: element.title,
                description: element.description
            }
            // console.log("$$new_item",new_item)
            d0.push(new_item)

        })
        // console.log("$$List", d0)
        d0[0].link.split("/")[2] == "youtu.be" ? setVideoId(d0[0].link.split("/")[3]) : setVideoId(d0[0].link.split("v=")[1])
        setVideos(d0)
    }



    const renderItemList = ({ item, index }) => (
        <ItemList title={item.title} index={index} id={item.id} link={item.link} />
    );

    const ItemList = ({ title, id, link, index }) => (
        <>
            <View style={styles.itemContent} flexDirection={"row"}>
                <View flexDirection={"column"} width={"100%"}>
                    <View marginBottom={20} marginLeft={5} marginRight={5} marginTop={5} flexDirection={"row"} justifyContent={"space-between"}>
                        <Dot style={styles.itemIcon} fill={color.black} />
                        <Text style={styles.itemTextLong}>{title}</Text>
                        <Pressable onPress={() => { link.split("/")[2] == "youtu.be" ? setVideoId(link.split("/")[3]) : setVideoId(link.split("v=")[1]); setPlaying(true) }} android_ripple={{ color: color.lightBlue, borderless: true }} >
                            <Play style={styles.itemIconPlay} />
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

    const togglePlaying = () => {
        setPlaying((prev) => !prev);
    }


    return (
        <>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => (navigation.openDrawer())} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Hamburger style={styles.topBarIcon} />
                    </Pressable>
                    <Text style={styles.topBarText}>{t("nav:motivationalvideos")}</Text>
                    <Pressable onPress={toggleOverlayLogOut} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Logout style={styles.topBarIcon} />
                    </Pressable>
                </View>


                <ScrollView nestedScrollEnabled={true}>


                    {/* VIDEO */}

                    <View style={styles.containerVideo}>
                        <Pressable
                            onPress={() => {
                                // handle or ignore
                            }}
                            onLongPress={() => {
                                // handle or ignore
                            }}>
                            <View pointerEvents="none">

                                <YoutubePlayer
                                    height={250}
                                    play={playing}
                                    videoId={videoId}
                                />
                            </View>
                        </Pressable>
                    </View>
                    <View style={{
                        alignItems: "center",
                    }}>

                        <Pressable onPress={() => { setPlaying(!playing) }} android_ripple={{ color: color.edalabBlue, borderless: false }}
                            backgroundColor={color.lightBlue} borderRadius={7} width={60} padding={5} alignItems={"center"} margin={10}>
                            {playing ?
                                <Pause height={"25"} width={"40"} fill={"white"} />
                                :
                                <Play height={"25"} width={"40"} fill={"white"} />

                            }
                        </Pressable>
                    </View>
                    {/* VIDEO LIST */}
                    <View style={styles.card}>

                        <SafeAreaView style={styles.contentCardContainer}>
                            <FlatList
                                data={videos}
                                renderItem={renderItemList}
                                keyExtractor={item => item.id}

                                nestedScrollEnabled={true}
                            />
                        </SafeAreaView>
                    </View>

                    <LogoutOverlay overlayLogoutVisible={overlayLogoutVisible} setOverlayLogoutVisible={setOverlayLogoutVisible} navigation={navigation} />
                </ScrollView>

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
    cardTitle: {
        color: color.black,
        fontSize: 20,
        fontWeight: "bold",
    },
    itemContent: {
        marginTop: 18,
        backgroundColor: color.white,
    },
    itemTextLong: {
        color: color.black,
    },
    itemTextShort: {
        color: color.black,
    },
    itemIcon: {
        width: 8,
        height: 8,
        color: color.black,
        marginTop: 7,
    },
    itemIconPlay: {
        width: 25,
        height: 25,
        color: color.black,
    },
    containerVideo: {
        padding: 3,
        backgroundColor: color.black,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 5,
        color: color.black,
        backgroundColor: color.black
    },
});

