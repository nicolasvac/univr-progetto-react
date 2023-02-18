import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, FlatList, ScrollView } from 'react-native';
import color from "../color"
import { Overlay, Divider, FAB } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';



import Hamburger from "../icons/hamburger.svg"
import Logout from "../icons/logout.svg"

import PencilDrawing from "../icons/pencilDrawing.svg"
import Dot from "../icons/dry-clean.svg"
import X from "../icons/x.svg"
import Check from "../icons/check.svg"
import Trash from "../icons/trash.svg"
import { Animated } from "react-native";
import ExerciseDiaryFade from "../components/ExerciseDiaryFade"
import { useTranslation } from 'react-i18next'
import { logout, get, post } from "../api/restManager"
import { dateToMomentYYYYMMDDHHMM, dateToMomentYYYYMMDD } from "../utility/DateUtilities"
import LogoutOverlay from '../components/LogoutOverlay';
import MyBarChart from '../components/BarChart';


export default function ExerciseDiary({ navigation }) {

    const { t } = useTranslation()

    const [overlayLogoutVisible, setOverlayLogoutVisible] = useState(false);
    const [overlayRemoveEntryVisible, setOverlayRemoveEntryVisible] = useState(false);

    const [tabIndex, setTabIndex] = useState(1)

    const [indexItemToRemove, setIndexItemToRemove] = useState(-1)

    const [itemToModify, setItemToModify] = useState()
    const [indexItemToModify, setIndexItemToModify] = useState()


    const [fadeTitle, setFadeTitle] = useState("")
    const [fadeType, setFadeType] = useState()

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [types, setTypes] = useState([])
    const [entries, setEntries] = useState([])

    const [dataToday, setDataToday] = useState([])
    const [dataYesterday, setDataYesterday] = useState([])
    const [threshold, setThreshold] = useState(0)
    const [barchartData, setBarchartData] = useState({ "time": [], "cal": [] })
    const scrollViewRef = useRef();


    useEffect(() => {
        getData()
    }, []);

    async function getData() {
        try {
            let data = await get("/workout-diary");
            // console.log("$$ DBG getData success", data)
            // data = JSON.parse(JSON.stringify(data))
            if (data) {
                setEntries(data.entries)
                setData(data)
            }

            let history = await get("/workout-history");
            // console.log("$$ DBG getData success", history)
            if (history) {
                setHistory(history)
            }

        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG ExerciseDiary getData error", error)
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

    const setHistory = ({ history, threshold }) => {
        setThreshold(threshold)
        let time = []
        let cal = []

        history = history.map(d => ({ ...d, formattedTime: dateToMomentYYYYMMDD(d.time) }))
        history.sort((a, b) => {
            if (a.formattedTime > b.formattedTime) return 1
            if (a.formattedTime < b.formattedTime) return -1
            return 0
        })
        history.forEach((e, index) => {
            time[index] = e?.time
            cal[index] = e?.calories
        })
        // console.log("DBG time ",time)
        setBarchartData({ "time": time, "cal": cal })
    }



    const setData = ({ entries, types, yesterday_entries }) => {


        // console.log("$$Types", types)

        var array = [];
        for (var i in types) {
            if (types.hasOwnProperty(i)) {
                array[i] = types[i];
            }
        }

        // console.log("$$TypesArray", array)
        setTypes(array)

        let d0 = []
        let d1 = []

        entries.forEach(element => {
            let new_item = {
                id: element.id,
                exercise: element.type,
                duration: element.duration,
                kcal_h: element.energy,
                date: dateToMomentYYYYMMDDHHMM(element.time)
            }
            // console.log("$$new_item",new_item)
            d1.push(new_item)
        })

        setDataToday(d1)


        yesterday_entries.forEach(element => {
            let new_item = {
                id: element.id,
                exercise: element.type,
                duration: element.duration,
                kcal_h: element.energy,
                date: dateToMomentYYYYMMDDHHMM(element.time)
            }
            // console.log("$$new_item",new_item)
            d0.push(new_item)
        })

        setDataYesterday(d0)
    }


    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        }).start();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const removeEntry = async () => {
        let item
        if (tabIndex == 0) {
            item = dataYesterday[indexItemToRemove]
        } else {
            item = dataToday[indexItemToRemove]
        }
        try {
            var body = new FormData();
            body.append("id", item.id,);

            await post("/delete-workout", body);
            discardChanges()
            getData()
        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG /delete-workout", error)
        }
        toggleOverlayRemoveEntry()
    }

    const setDataOfModifyCard = (index) => {
        if (tabIndex == 0) {
            setItemToModify(dataYesterday[index])
        } else {
            setItemToModify(dataToday[index])
        }
        setIndexItemToModify(index)
        setFadeType("Modify")
        setFadeTitle(t("exercisediary:modify"))
        fadeIn()
    }

    const onChangesConfirmed = async (item) => {
        try {
            await post("/edit-workout", item);
            discardChanges()
            getData()
        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG /edit-workout", error)
        }
    }

    const discardChanges = () => {
        fadeOut()
        setIndexItemToModify(null)
        setItemToModify(null)
        setFadeType("")
    }

    const toggleOverlayLogOut = () => {
        setOverlayLogoutVisible(!overlayLogoutVisible);
    };

    const toggleOverlayRemoveEntry = (index) => {
        fadeOut()
        setIndexItemToRemove(index)
        setOverlayRemoveEntryVisible(!overlayRemoveEntryVisible);
    };
    const changeTab = (index) => {
        if (index == 1 && tabIndex == 0) {
            fadeOut()
            setTabIndex(1)
        }
        else if (index == 0 && tabIndex == 1) {
            fadeOut()
            setTabIndex(0)
        }
    };

    const showAddEntryCard = () => {
        setFadeTitle(t("exercisediary:newEntry"))
        setFadeType("Add")
        fadeIn()
    }

    const onConfirmAddItem = async (item) => {
        // console.log("onConfirmAddItem", item)
        try {
            await post("/insert-workout", item);
            onDiscardAddItem()
            getData()
        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG /insert-workout error", error)
        }
    }

    const onDiscardAddItem = () => {
        fadeOut()
        setFadeType("")
    }


    const renderItemList = ({ item, index }) => {
        // console.log("item", item)
        return <ItemList exercise={types[item.exercise]} duration={item.duration} kcal_h={item.kcal_h} date={item.date} index={index} />

    }


    const ItemList = ({ exercise, duration, kcal_h, date, index }) => {

        // console.log("$$ItemList", exercise, duration, kcal_h, date, index)
        return (
            <>
                <View style={styles.itemContent} flexDirection={"row"}>
                    <View width={"10%"}>
                        <Dot style={styles.itemIcon} fill={color.black} />

                    </View>
                    <View flexDirection={"column"} width={"90%"}>
                        <View marginBottom={20} flexDirection={"row"} justifyContent={"space-between"}>
                            <Text style={styles.itemTextLong}>{exercise}</Text>
                            <Text style={styles.itemTextShort}>{duration} {exercise!='PASSI'?t("exercisediary:m"):''}</Text>
                            <Pressable onPress={() => { setDataOfModifyCard(index); scrollViewRef.current.scrollToEnd({ animated: true }) }} android_ripple={{ color: color.lightBlue, borderless: true }}>
                                <PencilDrawing style={styles.itemIconModify} />
                            </Pressable>
                        </View>
                        <View marginBottom={5} flexDirection={"row"} justifyContent={"space-between"}  >
                            <Text style={styles.itemTextLong}>{date}</Text>
                            <Text style={styles.itemTextShort}>{kcal_h} {t("exercisediary:kcal_h")}</Text>
                            <Pressable onPress={() => toggleOverlayRemoveEntry(index)} android_ripple={{ color: color.lightBlue, borderless: true }}>
                                <Trash style={styles.itemIconModify} />
                            </Pressable>
                        </View>
                    </View>
                </View>
                <Divider orientation="horizontal" />

            </>
        );
    }



    return (
        <>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => (navigation.openDrawer(), fadeOut())} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Hamburger style={styles.topBarIcon} />
                    </Pressable>
                    <Text style={styles.topBarText}>{t("exercisediary:exercisediary")}</Text>
                    <Pressable onPress={toggleOverlayLogOut} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Logout style={styles.topBarIcon} />
                    </Pressable>
                </View>
                <ScrollView nestedScrollEnabled={true} ref={scrollViewRef}>
                    <View style={styles.barchartCard}>
                        <Text style={styles.barchartTitle}>{t("exercisediary:chartTitle")}</Text>
                        <MyBarChart data={barchartData} height={200} threshold={500} />
                    </View>

                    <View style={styles.card}>
                        <View flexDirection={"row"} style={styles.tabContainer}>
                            <Pressable onPress={() => changeTab(0)} style={styles.tabLeft} backgroundColor={tabIndex == 0 ? color.lightBlue : color.background} android_ripple={{ color: color.lightBlue, borderless: true }}>
                                <Text style={{ color: color.white }}>{t("exercisediary:yesterday")}</Text></Pressable>
                            <Pressable onPress={() => changeTab(1)} style={styles.tabRight} backgroundColor={tabIndex == 1 ? color.lightBlue : color.background} android_ripple={{ color: color.lightBlue, borderless: true }}>
                                <Text style={{ color: color.white }}>{t("exercisediary:today")}</Text></Pressable>
                        </View>

                        <SafeAreaView style={styles.contentCardContainer}>
                            <FlatList
                                data={tabIndex == 1 ? dataToday : dataYesterday}
                                renderItem={renderItemList}
                                keyExtractor={item => item.id}
                                height={"90%"}
                                toggleOverlay={toggleOverlayLogOut}
                                nestedScrollEnabled={true}
                            />
                        </SafeAreaView>
                    </View>




                    <ExerciseDiaryFade fadeAnim={fadeAnim} title={fadeTitle} fadeType={fadeType} onDiscardChanges={discardChanges} onConfirmedChanges={onChangesConfirmed}
                        itemToModify={itemToModify} types={types} onConfirmAddItem={onConfirmAddItem} onDiscardAddItem={onDiscardAddItem} tabIndex={tabIndex}></ExerciseDiaryFade>

                </ScrollView>

                <FAB placement={"right"} color={color.lightBlue} onPress={() => { showAddEntryCard(); scrollViewRef.current.scrollToEnd({ animated: true }) }} icon={
                    <Icon
                        name="plus"
                        size={25}
                        color="white"
                    />
                } />

                <LogoutOverlay overlayLogoutVisible={overlayLogoutVisible} setOverlayLogoutVisible={setOverlayLogoutVisible} navigation={navigation} />


                <Overlay isVisible={overlayRemoveEntryVisible} onBackdropPress={toggleOverlayRemoveEntry} borderRadius={10}>
                    <Text style={{ fontSize: 20, color: color.black }}>{t("exercisediary:remove")}</Text>
                    <View flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                        <Pressable onPress={toggleOverlayRemoveEntry} android_ripple={{ color: color.edalabBlue, borderless: false }}
                            backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                            <X height={"20"} width={"30"} fill={"white"} />
                        </Pressable>
                        <Pressable onPress={removeEntry} android_ripple={{ color: color.edalabBlue, borderless: false }}
                            backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                            <Check height={"20"} width={"30"} fill={"white"} />
                        </Pressable>
                    </View>
                </Overlay>
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
    tabLeft: {
        borderTopLeftRadius: 7,
        borderColor: color.gray,
        width: "50%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    tabRight: {
        borderTopRightRadius: 7,
        borderColor: color.gray,
        width: "50%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
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
    barchartCard: {
        backgroundColor: color.white,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        height: 250
    },
    cardChart: {
        backgroundColor: color.white,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        height: 220,
        alignItems: "center"
    },
    cardNewEntry: {
        backgroundColor: color.white,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        height: "15%"
    },
    contentCardContainer: {
        margin: 15,
        flex: 1
    },
    cardTitle: {
        color: color.black,
        fontSize: 20,
        fontWeight: "bold",
    },
    barchartTitle: {
        color: color.black,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: 'center',
        marginTop: 10
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
    itemIcon: {
        width: 8,
        height: 8,
        color: color.black,
        marginTop: 5,
    },
    itemIconModify: {
        width: 20,
        height: 20,
        color: color.black,
    },
    arrowChart: {
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: color.lightBlue,
        borderRadius: 7,
        width: "10%",
        padding: 5,
        alignItems: "center"
    },
    chartTitle: {
        color: color.black,
        fontWeight: "bold",
        fontSize: 18
    },
});

