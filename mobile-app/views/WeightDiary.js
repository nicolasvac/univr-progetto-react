import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, ScrollView } from 'react-native';
import color from "../color"
import { FAB } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';



import Hamburger from "../icons/hamburger.svg"
import Logout from "../icons/logout.svg"

import Arrow from "../icons/arrowDown.svg"
import { Animated } from "react-native";
import WeightDiaryFade from "../components/WeightDiaryFade"
import { useTranslation } from 'react-i18next'
import { logout, get, post } from "../api/restManager"
import { dateToMomentYYYYMMDD, dateToMomentYYYYMMDDHHMMSS } from "../utility/DateUtilities"
import LogoutOverlay from '../components/LogoutOverlay';


import {
    LineChart,
} from "react-native-chart-kit";


const chartConfig = {
    backgroundColor: color.white,
    backgroundGradientFrom: color.white,
    backgroundGradientTo: color.white,
    color: (opacity = 1) => `rgba(${0}, ${0}, ${0}, ${opacity})`,
    strokeWidth: 2, // optional, default 3
}


export default function WeightDiary({ navigation }) {
    const { t } = useTranslation()

    const [overlayLogoutVisible, setOverlayLogoutVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [arrayOfLabels, setArrayOfLabels] = useState([])
    const [arrayOfWeights, setArrayOfWeights] = useState([])
    const [arrayOfTimes, setArrayOfTimes] = useState([])

    const [chartData, setChartData] = useState({ labels: ["0",], datasets: [{ data: [0] }] })
    const [chartIndexStart, setChartIndexStart] = useState(0)
    const [fadeType, setFadeType] = useState()
    const [itemToModify, setItemToModify] = useState()
    const scrollViewRef = useRef();



    useEffect(() => {
        getData(chartIndexStart)
    }, []);

    async function getData(index) {
        try {
            const data = await get("/weight-history");
            // console.log("$$ DBG getWeightData success", data.weight)
            if (data) {
                addAllEntryToChart(data.weight, index)
            }

        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG WeightDiary getData error", error)
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


    const addAllEntryToChart = (data, index) => {
        let labelArray = []
        let weightArray = []
        let timeArray = []
        data = data.map(d => ({ ...d, formattedTime: dateToMomentYYYYMMDDHHMMSS(d.time) }))
        data.sort((a, b) => {
            if (a.formattedTime > b.formattedTime) return 1
            if (a.formattedTime < b.formattedTime) return -1
            return 0
        })

        data.forEach(element => {
            timeArray.push(element.time)
            labelArray.push(dateToMomentYYYYMMDD(element.time))
            weightArray.push(parseFloat(element.value))
        })

        setArrayOfLabels(labelArray)
        setArrayOfWeights(weightArray)
        setArrayOfTimes(timeArray)

        setChartData({
            time: timeArray.slice(index, index + 4),
            labels: labelArray.slice(index, index + 4),
            datasets: [{
                data: weightArray.slice(index, index + 4),
            }]
        })
    }

    const setChart = (value) => {
        setChartIndexStart(chartIndexStart + value)

        setChartData({
            time: arrayOfTimes.slice(chartIndexStart + value, chartIndexStart + value + 4),
            labels: arrayOfLabels.slice(chartIndexStart + value, chartIndexStart + value + 4),
            datasets: [{
                data: arrayOfWeights.slice(chartIndexStart + value, chartIndexStart + value + 4),
            }]
        })
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

    const toggleOverlayLogOut = () => {
        setOverlayLogoutVisible(!overlayLogoutVisible);
    };

    const showAddEntryCard = () => {
        setFadeType("Add")
        fadeIn()
    }
    const setDataOfModifyCard = (index) => {
        // setIndexItemToModify(index)
        setItemToModify({ time: arrayOfTimes[index], weight: arrayOfWeights[index] })
        setFadeType("Modify")
        fadeIn()
    }

    const onConfirmAddItem = async (item) => {
        try {
            const data = await post("/insert-weight", item);
            setChart(0)
            onDiscardAddItem()
            getData(chartIndexStart)
        } catch (error) {
            console.log("$$insert-weight error ", error)
            // There was an error on the native sideNo non ancora
        }
    }

    const onDiscardAddItem = () => {
        fadeOut()
    }

    const onChangesConfirmed = async (item) => {
        try {
            await post("/edit-weight", item);
            discardChanges()
            getData(chartIndexStart)
        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG /edit-weight", error)
        }
    }

    const discardChanges = () => {
        fadeOut()
        setFadeType("")
    }

    const onDelete = async (item) => {
        try {

            await post("/delete-weight", item);

            if (arrayOfWeights.length % 4 == 1 && chartIndexStart + 1 == arrayOfWeights.length) {
                // console.log("DBG arrayOfWeights.labels", arrayOfWeights.length, " chartIndexStart ", chartIndexStart)
                if (chartIndexStart != 0) {
                    setChartIndexStart(chartIndexStart - 4)
                    getData(chartIndexStart - 4)
                }
            } else {
                getData(chartIndexStart)
            }
            discardChanges()
        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG /delete-weight", error)
        }
    }


    return (
        <>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => (navigation.openDrawer(), fadeOut())} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Hamburger style={styles.topBarIcon} />
                    </Pressable>
                    <Text style={styles.topBarText}>{t("weightdiary:weightdiary")}</Text>
                    <Pressable onPress={toggleOverlayLogOut} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Logout style={styles.topBarIcon} />
                    </Pressable>
                </View>
                <ScrollView nestedScrollEnabled={true} ref={scrollViewRef}>
                    {/* LINECHART CARD */}

                    <View style={styles.cardChart}>

                        <Text style={styles.cardTitle}>{t("weightdiary:weightHistory")}</Text>

                        <LineChart
                            onDataPointClick={({ index }) => { setDataOfModifyCard(chartIndexStart + index); scrollViewRef.current.scrollToEnd({ animated: true }) }}
                            data={chartData}
                            width={Dimensions.get("window").width - 50}
                            height={200}
                            chartConfig={chartConfig}

                        />
                        <View flexDirection='row' alignItems='center'>
                            <Pressable onPress={() => chartIndexStart - 4 >= 0 && setChart(-4)} android_ripple={{ color: color.edalabBlue, borderless: false }}
                                backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                                <Arrow height={"20"} width={"30"} fill={"white"} style={{ transform: [{ rotate: '90deg' }] }} />
                            </Pressable>
                            <Pressable onPress={() => chartIndexStart + 4 < arrayOfWeights.length && setChart(4)} android_ripple={{ color: color.edalabBlue, borderless: false }}
                                backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                                <Arrow height={"20"} width={"30"} fill={"white"} style={{ transform: [{ rotate: '-90deg' }] }} />
                            </Pressable>
                        </View>
                    </View>

                    {/* FADE */}
                    <WeightDiaryFade fadeAnim={fadeAnim} fadeType={fadeType} onConfirmAddItem={onConfirmAddItem} onDiscardAddItem={onDiscardAddItem}
                        onDiscardChanges={discardChanges} onConfirmedChanges={onChangesConfirmed} itemToModify={itemToModify} onDelete={onDelete}></WeightDiaryFade>
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

            </View >
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
        padding: 10,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        height: 300,
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
        marginBottom: 10
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

