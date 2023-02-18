import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, FlatList, ScrollView } from 'react-native';
import color from "../color"
import { Divider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next'



import Hamburger from "../icons/hamburger.svg"
import Logout from "../icons/logout.svg"

import Dot from "../icons/dry-clean.svg"
import { get, logout } from "../api/restManager"
import LogoutOverlay from '../components/LogoutOverlay';


// const mapDayIndex=new Map([[0,"mon"],[1,"tue"],[2,"wed"],[3,"thu"],[4,"fri"],[5,"sat"],[6,"sun"]]);


export default function FoodAgenda({ navigation }) {

    const [overlayLogoutVisible, setOverlayLogoutVisible] = useState(false);
    const [diet, setDiet] = useState()
    const [dayIndex, setDayIndex] = useState(new Date().getDay())
    const [mapDayIndex, setMapDayIndex] = useState(new Map())
    const { t } = useTranslation()

    const days = [
        t("days:sunday"),
        t("days:monday"),
        t("days:tuesday"),
        t("days:wednesday"),
        t("days:thursday"),
        t("days:friday"),
        t("days:saturday")]



    useEffect(() => {
        getFoodAgenda()
        let sup = new Map();
        sup.set(1, "mon")
        sup.set(2, "tue")
        sup.set(3, "wed")
        sup.set(4, "thu")
        sup.set(5, "fri")
        sup.set(6, "sat")
        sup.set(0, "sun")
        setMapDayIndex(sup)
    }, []);


    const getFoodAgenda = async () => {

        try {
            const data = await get("/diet");
            // console.log("$$ DBG getFoodagenda success", data)
            if (data) {
                setDiet(data)
            }

        } catch (err) {
            console.log("$$ DBG getFoodagenda error", err)
            if (err && err.toString().includes("Signature has expired")) {
                handleLogout()
            }
        }
    }

    const handleLogout = async () => {
        try {
            await logout(navigation = { navigation })
        }
        catch (err) { }
    }


    const toggleOverlayLogOut = () => {
        setOverlayLogoutVisible(!overlayLogoutVisible);
    };


    const renderBreakfast = () => {
        const getArray = () => {
            if (diet)
                return diet[mapDayIndex?.get(dayIndex)]?.breakfast
            else
                return []
        }
        return (
            <>
                <View style={styles.itemContent} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:breakfast")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.food_id}
                        nestedScrollEnabled={true}

                    />

                    <Divider orientation="horizontal" />
                </SafeAreaView>

            </>
        )
    }



    const renderMorningBreak = () => {
        const getArray = () => {
            if (diet)
                return diet[mapDayIndex?.get(dayIndex)]?.morning_break
            else
                return []
        }
        return (
            <>
                <View style={styles.itemContent} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:morningBreak")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.food_id}
                        nestedScrollEnabled={true}
                    />
                    <Divider orientation="horizontal" />

                </SafeAreaView>

            </>
        )
    }

    const renderLunch = () => {
        const getArray = () => {
            if (diet)
                return diet[mapDayIndex?.get(dayIndex)]?.lunch
            else
                return []
        }
        return (
            <>
                <View style={styles.itemContent} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:lunch")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.food_id}
                        nestedScrollEnabled={true}
                    />
                    <Divider orientation="horizontal" />

                </SafeAreaView>

            </>
        )
    }

    const renderAfternoonBreak = () => {
        const getArray = () => {
            if (diet)
                return diet[mapDayIndex?.get(dayIndex)]?.afternoon_break
            else
                return []
        }
        return (
            <>
                <View style={styles.itemContent} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:afternoonBreak")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.food_id}
                        nestedScrollEnabled={true}
                    />
                    <Divider orientation="horizontal" />

                </SafeAreaView>

            </>
        )
    }

    const renderDinner = () => {
        const getArray = () => {
            if (diet)
                return diet[mapDayIndex?.get(dayIndex)]?.dinner
            else
                return []
        }
        return (
            <>
                <View style={styles.itemContent} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:dinner")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.food_id}
                        nestedScrollEnabled={true}
                    />
                    <Divider orientation="horizontal" />

                </SafeAreaView>

            </>
        )

    }




    const renderItemList = ({ item, index }) => (
        <>
            <ItemList dish={item.food} quantity={item.quantity} />
        </>
    );

    const ItemList = ({ dish, quantity, kcal, date, index }) => (
        <>
            <View flexDirection={"column"} width={"100%"}>
                <View marginLeft={20} marginBottom={10} flexDirection={"row"} justifyContent={"space-between"} >
                    <Text style={styles.itemTextLong}>{dish}</Text>
                    <Text style={styles.itemTextShort}> {quantity} {quantity && "g"}</Text>
                </View>
            </View>

        </>
    );



    return (
        <>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => (navigation.openDrawer())} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Hamburger style={styles.topBarIcon} />
                    </Pressable>
                    <Text style={styles.topBarText}>{t("foodagenda:foodagenda")}</Text>
                    <Pressable onPress={toggleOverlayLogOut} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Logout style={styles.topBarIcon} />
                    </Pressable>
                </View>
                {/* FOOD AGENDA CARD */}
                <View style={styles.card}>
                    <View flexDirection={"row"} style={styles.tabContainer}>
                        <Pressable style={styles.arrowLeft} onPress={() => { dayIndex != 0 && setDayIndex(dayIndex - 1) }}
                            backgroundColor={color.edalabBlue} android_ripple={{ color: color.edalabBlue, borderless: true }}>
                            <Icon
                                name="arrow-left"
                                size={15}
                                color="white"
                            />
                        </Pressable>
                        <Pressable style={styles.tabToday} backgroundColor={color.lightBlue}
                            android_ripple={{ color: color.lightBlue, borderless: true }}>
                            <Text style={{ color: color.white }}>{days[dayIndex]}</Text>
                        </Pressable>

                        <Pressable style={styles.arrowRight} onPress={() => { dayIndex != 6 && setDayIndex(dayIndex + 1) }}
                            backgroundColor={color.edalabBlue} android_ripple={{ color: color.edalabBlue, borderless: true }}>
                            <Icon
                                name="arrow-right"
                                size={15}
                                color="white"
                            />
                        </Pressable>
                    </View>

                    <View style={{ marginLeft: 10, marginTop: 10 }}>
                        <ScrollView nestedScrollEnabled={true} style={{ height: "85%" }}>
                            {renderBreakfast()}
                            {renderMorningBreak()}
                            {renderLunch()}
                            {renderAfternoonBreak()}
                            {renderDinner()}
                        </ScrollView>

                    </View>
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
    tabContainer: {
        borderRadius: 7,
        borderColor: color.gray,
        borderBottomWidth: 1,
        color: color.white,
        height: 35,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    tabToday: {
        borderColor: color.gray,
        width: "50%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: color.lightBlue
    },
    card: {
        backgroundColor: color.white,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        height: "90%",
        flexDirection: "column"
    },
    contentCardContainer: {
        margin: 15,
        alignItems: "center"
    },
    dateLabel: {
        color: color.black,
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center"
    },
    itemContent: {
        marginTop: 10,
        marginBottom: 10,
    },
    itemTextLong: {
        color: color.black,
        width: "50%",
    },
    itemTextShort: {
        color: color.black,
        width: "25%",
    },
    itemTextBold: {
        color: color.black,
        width: "50%",
        fontWeight: "bold"
    },
    itemIcon: {
        width: 8,
        height: 8,
        color: color.black,
        marginTop: 7,
        marginRight: 5
    },
    itemIconModify: {
        width: 20,
        height: 20,
        color: color.black,
    },
    arrowLeft: {
        backgroundColor: color.edalabBlue,
        borderTopLeftRadius: 7,
        width: "10%",
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "25%",
        height: "100%",
    },
    arrowRight: {
        backgroundColor: color.edalabBlue,
        borderTopRightRadius: 7,
        width: "10%",
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "25%",
        height: "100%",
    },
});
