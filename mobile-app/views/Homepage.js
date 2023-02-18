import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, FlatList, ScrollView } from 'react-native';
import color from "../color"
import { Divider } from 'react-native-elements'


import Hamburger from "../icons/hamburger.svg"
import Info from "../icons/info.svg"
import Phone from "../icons/phone.svg"
import Dot from "../icons/dry-clean.svg"
import Logout from "../icons/logout.svg"
import ForkKnife from "../icons/fork_knife.svg"

import { useTranslation } from 'react-i18next'
import { get, logout } from "../api/restManager"

import { dateToMomentYYYYMMDDHHMM} from "../utility/DateUtilities"
import LogoutOverlay from '../components/LogoutOverlay';

export default function Homepage({ navigation }) {

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [appointments, setAppointments] = useState([])
    const [mapDayIndex, setMapDayIndex] = useState(new Map())
    const [diet, setDiet] = useState()
    const [todayIndex, setTodayIndex] = useState(new Date().getDay())
    const { t } = useTranslation()


    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };

    useEffect(() => {
        let sup = new Map();
        sup.set(0, "sun")
        sup.set(1, "mon")
        sup.set(2, "tue")
        sup.set(3, "wed")
        sup.set(4, "thu")
        sup.set(5, "fri")
        sup.set(6, "sat")
        setMapDayIndex(sup)
        setTodayIndex(new Date().getDay())

        getUserInfo()
        getFoodAgendaOfToday()
    }, []);

    async function getUserInfo() {
        try {
            const userInfo = await get("/user-info");
            // console.log("$$ DBG getUserInfo success", userInfo)
            if (userInfo) {
                setName(userInfo.name)
                setSurname(userInfo.surname)
                setAppointments(userInfo.appointments)
            }

        } catch (error) {
            // There was an error on the native side
        }
    }
    async function getFoodAgendaOfToday() {

        try {
            const diet = await get("/diet");
            // console.log("$$ DBG getFoodagenda success", diet)
            if (diet) {
                setDiet(diet)
            }

        } catch (error) {
            console.log("$$ DBG getFoodagenda error", error)
            if (error && error.toString().includes("Signature has expired")) {
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


    const renderItemAppointment = ({ item, index }) => (
        <ItemAppointment item={item} key={index} />
    );

    const ItemAppointment = ({ item }) => (
        <>
            <View style={styles.itemTitleContainer}>
                <Dot style={styles.itemIcon} fill={color.black} />
                <Text style={styles.itemTitle}>{t("homepage:appointment")}{" "}{appointments.indexOf(item) + 1}</Text>
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{t("homepage:date")}{": "}{dateToMomentYYYYMMDDHHMM(item)}</Text>
            </View>

        </>
    );

    const renderBreakfast = () => {
        const getArray = () => {
            if (diet && mapDayIndex) {

                return diet[mapDayIndex?.get(todayIndex)]?.breakfast
            }
            else
                return []
        }
        return (
            <>
                <View style={styles.itemTitleContainer} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:breakfast")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.key}
                        nestedScrollEnabled={true}

                    />

                    <Divider orientation="horizontal" />
                </SafeAreaView>

            </>
        )
    }

    const renderMorningBreak = () => {
        const getArray = () => {
            if (diet){
                // console.log("&&DBG morning break", diet[mapDayIndex?.get(todayIndex)]?.morning_break)
                return diet[mapDayIndex?.get(todayIndex)]?.morning_break
            
            }
            else
                return []
        }
        return (
            <>
                <View style={styles.itemTitleContainer} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:morningBreak")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.key}
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
                return diet[mapDayIndex?.get(todayIndex)]?.lunch
            else
                return []
        }
        return (
            <>
                <View style={styles.itemTitleContainer} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:lunch")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.key}
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
                return diet[mapDayIndex?.get(todayIndex)]?.afternoon_break
            else
                return []
        }
        return (
            <>
                <View style={styles.itemTitleContainer} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:afternoonBreak")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.key}
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
                return diet[mapDayIndex?.get(todayIndex)]?.dinner
            else
                return []
        }
        return (
            <>
                <View style={styles.itemTitleContainer} flexDirection={"row"}>
                    <Dot style={styles.itemIcon} fill={color.black} />
                    <Text style={styles.itemTextBold}>{t("foodagenda:dinner")}</Text>
                </View>
                <SafeAreaView>
                    <FlatList
                        data={getArray()}
                        renderItem={renderItemList}
                        keyExtractor={item => item.key}
                        nestedScrollEnabled={true}
                    />
                    <Divider orientation="horizontal" />

                </SafeAreaView>

            </>
        )

    }

    const renderItemList = ({ item, index }) => (
        <>
            <ItemList dish={item.food} quantity={item.quantity} key={index} />
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
                    <Pressable onPress={() => navigation.openDrawer()} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Hamburger style={styles.topBarIcon} />
                    </Pressable>
                    <Text style={styles.topBarText}>{t("homepage:homepage")}</Text>
                    <Pressable onPress={toggleOverlay} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Logout style={styles.topBarIcon} />
                    </Pressable>
                </View>

                <LogoutOverlay overlayLogoutVisible={overlayVisible} setOverlayLogoutVisible={setOverlayVisible} navigation={navigation} />


                <ScrollView nestedScrollEnabled={true}>
                    <View style={styles.card} >
                        <View style={styles.titleCardContainer} flexDirection="row">
                            <Info style={styles.titleCardIcon} ></Info>
                            <Text style={styles.cardTitle}>
                                {t("homepage:userInfo")}
                            </Text>
                        </View>
                        <View style={{ marginLeft: 5, marginBottom: 5, flexDirection: "row", justifyContent: "space-around" }} >
                            <Text style={styles.userInfoContentLabel}>
                                {t("homepage:name")}
                            </Text>
                            <Text style={styles.userInfoContentTextLong}>
                                {name}
                            </Text>
                            <Text style={styles.userInfoContentLabel}>
                            </Text>
                            <Text style={styles.userInfoContentTextShort}>
                            </Text>
                        </View>
                        <View style={{ marginLeft: 5, marginBottom: 5, flexDirection: "row", justifyContent: "space-around" }} >
                            <Text style={styles.userInfoContentLabel}>
                                {t("homepage:surname")}
                            </Text>
                            <Text style={styles.userInfoContentTextLong}>
                                {surname}
                            </Text>
                            <Text style={styles.userInfoContentLabel}>
                            </Text>
                            <Text style={styles.userInfoContentTextShort}>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.titleCardContainer}>
                            <Phone style={styles.titleCardIcon} ></Phone>

                            <Text style={styles.cardTitle}>
                                {t("homepage:nextAppointments")}
                            </Text>
                        </View>
                        <View style={styles.contentCardContainer}>
                            <FlatList
                                data={appointments}
                                renderItem={renderItemAppointment}
                                keyExtractor={item => appointments.indexOf(item)}
                                height={150}
                                nestedScrollEnabled={true}
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.titleCardContainer}>
                            <ForkKnife style={styles.titleCardIcon} fill={color.black} />

                            <Text style={styles.cardTitle}>
                                {t("homepage:whatToEatToday")}
                            </Text>
                        </View>
                        <View style={styles.contentCardContainer}>

                            <ScrollView nestedScrollEnabled={true}>
                                {renderBreakfast()}
                                {renderMorningBreak()}
                                {renderLunch()}
                                {renderAfternoonBreak()}
                                {renderDinner()}
                            </ScrollView>

                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
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
    card: {
        backgroundColor: color.white,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        padding: 10,
        borderColor: color.gray,
        borderWidth: 2
    },
    titleCardContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row', // row
        alignItems: 'center',
        marginBottom: 15,
    },
    contentCardContainer: {
        marginLeft: 5,
    },
    userInfoContentTextLong: {
        color: color.black,
        marginLeft: 20,
        width: "40%",
    },
    userInfoContentTextShort: {
        color: color.black,
        marginLeft: 20,
        width: "10%",
    },
    userInfoContentLabel: {
        color: color.black,
        marginLeft: 20,
        width: "19%",
        fontWeight: "bold",
    },
    cardTitle: {
        color: color.black,
        fontSize: 20,
        fontWeight: "bold",
    },
    titleCardIcon: {
        width: 20,
        height: 20,
        marginRight: 15,
        color: color.black,
    },
    itemContent: {
        marginLeft: 20,
        marginBottom: 10,
    },
    itemTitle: {
        color: color.black,
    },
    itemTitleContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row', // row
        alignItems: 'center',
        marginBottom: 6,
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
        marginTop: 1,
        marginRight: 5
    },
    itemTextLong: {
        color: color.black,
        width: "50%",
    },
    itemTextShort: {
        color: color.black,
        width: "25%",
    },
});
