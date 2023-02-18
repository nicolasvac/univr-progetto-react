import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, Dimensions, FlatList, ScrollView } from 'react-native';
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
import FoodDiaryFade from "../components/FoodDiaryFade"
import {
    PieChart,
} from "react-native-chart-kit";

import { useTranslation } from 'react-i18next'
import { get, logout, post } from "../api/restManager"

import { dateToMomentYYYYMMDDHHMM } from "../utility/DateUtilities"
import LogoutOverlay from '../components/LogoutOverlay';

export default function FoodDiary({ navigation }) {
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

    const [dataChart, setDataChart] = useState([])
    const [chartErrorMessage, setChartErrorMessage] = useState("")

    const [types, setTypes] = useState(new Map())

    const [calToday, setCalToday] = useState([0, 0, 0, 0])
    const [calYesterday, setCalYesterday] = useState([0, 0, 0, 0])
    const [calThreshold, setCalThreshold] = useState(0)
    const [dataYesterday, setDataYesterday] = useState([])
    const [dataToday, setDataToday] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const scrollViewRef = useRef();



    useEffect(() => {
        getData()
        getFoodList()
    }, []);


    async function getFoodList() {
        try {
            let types = await get("/food-list");
            // console.log("$$ DBG /food-list success", types)
            types = JSON.parse(JSON.stringify(types))
            if (types) {
                setFoodList(types)
            }

        } catch (error) {
            console.log("$$ DBG /food-list", error)
            if (error && error.toString().includes("Signature has expired")) {
                handleLogout()
            }
        }
    }


    async function getData() {
        try {
            let data = await get("/food-diary");
            // console.log("$$ DBG /food-diary success", data)
            data = JSON.parse(JSON.stringify(data))

            if (data) {
                setData(data)
            }

        } catch (error) {
            console.log("$$ DBG getData /food-diary error", error)
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

    const setFoodList = ({ food }) => {
        // console.log("$$Food", food)
        var array = [];
        food.forEach(e => array[e.id] = e)
        setTypes(array)
    }

    const setData = ({ today, yesterday, cal_threshold }) => {

        cal_threshold=parseInt(cal_threshold)

        let calYest = []
        let calTod = []

        calYest[0] = parseInt(yesterday?.cal_actual)
        calYest[1] = parseInt(yesterday?.carbs)
        calYest[2] = parseInt(yesterday?.proteins)
        calYest[3] = parseInt(yesterday?.fats)

        calTod[0] = parseInt(today?.cal_actual)
        calTod[1] = parseInt(today?.carbs)
        calTod[2] = parseInt(today?.proteins)
        calTod[3] = parseInt(today?.fats)

        setCalToday(calTod)
        setCalYesterday(calYest)
        setCalThreshold(cal_threshold)

        if (tabIndex == 1)
            setChart(calTod, cal_threshold)
        else
            setChart(calYest, cal_threshold)

        let d0 = []
        let d1 = []

        today?.entries?.forEach(element => {
            let new_item = {
                id: element.id,
                dish: element.type,
                quantity: element.quantity,
                date: dateToMomentYYYYMMDDHHMM(element.time)
            }
            // console.log("$$new_item",new_item)
            d1.push(new_item)

        })
        setDataToday(d1)


        yesterday?.entries?.forEach(element => {
            let new_item = {
                id: element.id,
                dish: element.type,
                quantity: element.quantity,
                date: dateToMomentYYYYMMDDHHMM(element.time)
            }
            // console.log("$$new_item",new_item)           
            d0.push(new_item)
        })

        setDataYesterday(d0)

        // console.log("$DATE", d0)
        // console.log("$DATE", d1)

    }


    const setChart = (cal, calThreshold) => {

        let dataToSet = []

        dataToSet = [
            {
                name: t("fooddiary:carbs") + " " + cal[1] + " " + t("fooddiary:kcal"),
                kcal: cal[1],
                color: "rgb(0, 0, 255)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 10
            },
            {
                name: t("fooddiary:proteins") + " " + cal[2] + " " + t("fooddiary:kcal"),
                kcal: cal[2],
                color: "#0F0",
                legendFontColor: "#7F7F7F",
                legendFontSize: 10
            },
            {
                name: t("fooddiary:fats") + " " + cal[3] + " " + t("fooddiary:kcal"),
                kcal: cal[3],
                color: "#F00",
                legendFontColor: "#7F7F7F",
                legendFontSize: 10
            },
        ];
        let leftCalories = parseInt(calThreshold - cal[0])
        if (leftCalories >= 0) {
            dataToSet.push({
                name: "Rimaste" + " " + leftCalories + " " + t("fooddiary:kcal"),
                kcal: leftCalories,
                color: "rgba(131, 167, 234, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 10
            })
            setChartErrorMessage("")
        }
        else {
            setChartErrorMessage(t("fooddiary:exceededOf") + " " + -leftCalories + " kcal")
        }

        console.log("%%DBG threshold ", calThreshold, " calActual ", cal[0])

        setDataChart(dataToSet)
        // console.log("&&DBG setChart")

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
            await post("/delete-food-entry", body);
            discardChanges()
            getData()
        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG /delete-food-entry", error)
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
        setFadeTitle(t("fooddiary:modify"))
        fadeIn()
    }

    const onChangesConfirmed = async (item) => {
        try {
            await post("/edit-food-entry", item);
            discardChanges()
            getData()
        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG /edit-food-entry", error)
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
            setChart([...calToday], calThreshold)
        }
        else if (index == 0 && tabIndex == 1) {
            fadeOut()
            setTabIndex(0)
            setChart([...calYesterday], calThreshold)
        }
    };

    const showAddEntryCard = () => {
        setFadeTitle(t("fooddiary:newEntry"))
        setFadeType("Add")
        fadeIn()
        // setModalVisible(true)
    }

    const onConfirmAddItem = async (item) => {
        try {
            await post("/insert-food-entry", item);
            onDiscardAddItem()
            getData()
        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG /insert-food-entry error", error)
        }
    }

    const onDiscardAddItem = () => {
        fadeOut()
        setFadeType("")
        setModalVisible(false)
    }

    const renderItemList = ({ item, index }) => {

        // console.log("item", item)
        return <ItemList dish={types[item.dish]} quantity={item.quantity} date={item.date} index={index} />
    }

    const ItemList = ({ dish, quantity, date, index }) => (
        <>
            <View style={styles.itemContent} flexDirection={"row"}>
                <View width={"10%"}>
                    <Dot style={styles.itemIcon} fill={color.black} />

                </View>
                <View flexDirection={"column"} width={"90%"}>
                    <View marginBottom={20} flexDirection={"row"} justifyContent={"space-between"}>
                        <Text style={styles.itemTextLong}>{dish.name}</Text>
                        <Text style={styles.itemTextShort}>{quantity} {t("fooddiary:gg")}</Text>
                        <Pressable onPress={() => { setDataOfModifyCard(index); scrollViewRef.current.scrollToEnd({ animated: true }) }} android_ripple={{ color: color.lightBlue, borderless: true }}>
                            <PencilDrawing style={styles.itemIconModify} />
                        </Pressable>
                    </View>
                    <View marginBottom={5} flexDirection={"row"} justifyContent={"space-between"}  >
                        <Text style={styles.itemTextLong}>{date}</Text>
                        <Text style={styles.itemTextShort}>{parseInt(quantity * dish.calories / 100)} {t("fooddiary:kcal")}</Text>
                        <Pressable onPress={() => toggleOverlayRemoveEntry(index)} android_ripple={{ color: color.lightBlue, borderless: true }}>
                            <Trash style={styles.itemIconModify} />
                        </Pressable>
                    </View>
                </View>
            </View>
            <Divider orientation="horizontal" />

        </>
    );


    return (
        <>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => (navigation.openDrawer(), fadeOut())} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Hamburger style={styles.topBarIcon} />
                    </Pressable>
                    <Text style={styles.topBarText}>{t("fooddiary:fooddiary")}</Text>
                    <Pressable onPress={toggleOverlayLogOut} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Logout style={styles.topBarIcon} />
                    </Pressable>
                </View>
                <ScrollView nestedScrollEnabled={true} ref={scrollViewRef}>
                    <View style={styles.cardChart}>
                        <Text style={styles.chartTitle}>
                            {t("fooddiary:assumedKcal")} - {tabIndex == 1 ? t("fooddiary:today") : t("fooddiary:yesterday")}
                        </Text>
                        <PieChart
                            data={dataChart}
                            height={150}
                            width={Dimensions.get("window").width}
                            chartConfig={{
                                backgroundColor: color.white,
                                backgroundGradientFrom: '#0091EA',
                                backgroundGradientTo: '#0091EA',
                                color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`,
                            }}
                            style={{ height: 150, marginLeft: -20 }}
                            accessor="kcal"
                            avoidFalseZero="true"
                        />
                        <Text style={styles.chartError}>{chartErrorMessage}</Text>

                    </View>



                    <View style={styles.card}>
                        <View flexDirection={"row"} style={styles.tabContainer}>
                            <Pressable onPress={() => changeTab(0)} style={styles.tabLeft} backgroundColor={tabIndex == 0 ? color.lightBlue : color.background} android_ripple={{ color: color.lightBlue, borderless: true }}>
                                <Text style={{ color: color.white }}>{t("fooddiary:yesterday")}</Text></Pressable>
                            <Pressable onPress={() => changeTab(1)} style={styles.tabRight} backgroundColor={tabIndex == 1 ? color.lightBlue : color.background} android_ripple={{ color: color.lightBlue, borderless: true }}>
                                <Text style={{ color: color.white }}>{t("fooddiary:today")}</Text></Pressable>
                        </View>

                        <SafeAreaView style={styles.contentCardContainer}>
                            <FlatList
                                data={tabIndex == 1 ? dataToday : dataYesterday} renderItem={renderItemList}
                                keyExtractor={item => item.id}
                                height={"90%"}
                                toggleOverlay={toggleOverlayLogOut}
                                nestedScrollEnabled={true}
                            />
                        </SafeAreaView>
                    </View>




                    <FoodDiaryFade fadeAnim={fadeAnim} title={fadeTitle} fadeType={fadeType} onDiscardChanges={discardChanges} onConfirmedChanges={onChangesConfirmed}
                        itemToModify={itemToModify} types={types} onConfirmAddItem={onConfirmAddItem} onDiscardAddItem={onDiscardAddItem} tabIndex={tabIndex}>

                    </FoodDiaryFade>
                </ScrollView>


                <FAB placement={"right"} color={color.lightBlue} onPress={() => { showAddEntryCard(); scrollViewRef.current.scrollToEnd({ animated: true }) }}
                    icon={
                        <Icon
                            name="plus"
                            size={25}
                            color="white"
                        />
                    } />

                <LogoutOverlay overlayLogoutVisible={overlayLogoutVisible} setOverlayLogoutVisible={setOverlayLogoutVisible} navigation={navigation} />

                <Overlay isVisible={overlayRemoveEntryVisible} onBackdropPress={toggleOverlayRemoveEntry} borderRadius={10}>
                    <Text style={{ fontSize: 20, color: color.black }}>{t("fooddiary:remove")}</Text>
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
        marginRight: 20,
        marginLeft: 20,
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
    chartError: {
        color: color.red,
        fontWeight: "bold",
        fontSize: 13
    }
});

