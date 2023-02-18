import color from "../color"

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";
import { useTranslation } from 'react-i18next'
import X from "../icons/x.svg"
import Time from "../icons/time.svg"

import Check from "../icons/check.svg"
import ArrowDown from "../icons/arrowDown.svg"
import { dateToMomentYYYYMMDDHHMM } from "../utility/DateUtilities"
import SearchModal from "./SearchModal";
import colors from "../color";
import DateTimePicker from '@react-native-community/datetimepicker';

const FoodAddItemCard = ({ title, onDiscardAddItem, onConfirmAddItem, types, tabIndex }) => {
    const [dishOfNow, setDishOfNow] = useState();
    const [quantityOfNow, setQuantityOfNow] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const { t } = useTranslation()

    useEffect(() => {
        tabIndex == 1 ? setDate(new Date()) : setDate(getDateYesterday)
    }, [tabIndex]);


    const onDateTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        // console.log("&&DBG", dateToMomentYYYYMMDDHHMM(selectedDate) || dateToMomentYYYYMMDDHHMM(date))
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const onCheckPressed = () => {

        if (dishOfNow == null || quantityOfNow == "") {
            alert(t("fooddiary:fillAllFields"))
            return
        }

        var body = new FormData();
        body.append("type", dishOfNow);
        body.append("quantity", parseInt(quantityOfNow));
        body.append("time", dateToMomentYYYYMMDDHHMM(date))

        onConfirmAddItem(body)
    }
    const getDateYesterday = () => {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        return date
    }

    return (


        <View style={styles.card}>
            <Text style={styles.title}>
                {title}
            </Text>

            <View style={styles.row}>
                <Text style={styles.label}>{t("fooddiary:date")}</Text>

                <Text style={styles.date}>{dateToMomentYYYYMMDDHHMM(date)}</Text>

                <Pressable onPress={() => showTimepicker()} android_ripple={{ color: color.edalabBlue, borderless: false, width: "30%" }}
                    backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                    <Time height={"20"} width={"30"} fill={"white"} />
                </Pressable>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onDateTimeChange}
                        maximumDate={new Date()}
                        minimumDate={getDateYesterday()}
                    />
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.label} >{t("fooddiary:dish")}</Text>
                <Text style={styles.textStyle} numberOfLines={3} >
                    {dishOfNow ? types[dishOfNow]?.name : ""}
                </Text>

                <Pressable onPress={() => setModalVisible(true)} android_ripple={{ color: color.edalabBlue, borderless: false }}
                    backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}  >
                    <ArrowDown height={"20"} width={"30"} fill={"white"} />
                </Pressable>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>{t("fooddiary:quantity")}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setQuantityOfNow}
                    keyboardType="numeric"
                    value={quantityOfNow}
                />
                <Text style={styles.label}>{t("fooddiary:kcal")}</Text>
                <Text style={styles.text} >
                    {quantityOfNow && dishOfNow &&
                    parseInt(quantityOfNow * types[dishOfNow]?.calories / 100)}
                </Text>
            </View>


            <SearchModal types={types} modalVisible={modalVisible} setModalVisible={setModalVisible} setDishOfNow={setDishOfNow} />



            <View flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                <Pressable onPress={onDiscardAddItem} android_ripple={{ color: color.edalabBlue, borderless: false }}
                    backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                    <X height={"20"} width={"30"} fill={"white"} />
                </Pressable>
                <Pressable onPress={onCheckPressed} android_ripple={{ color: color.edalabBlue, borderless: false }}
                    backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                    <Check height={"20"} width={"30"} fill={"white"} />
                </Pressable>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    },
    card: {
        backgroundColor: color.white,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        display: "flex",
        justifyContent: "space-between",
        padding: 15,
    },
    input: {
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        backgroundColor: color.white,
        width: "15%",
        height: "80%",
        color: color.black,
        marginRight: 10

    },
    label: {
        color: color.black,
        fontWeight: "bold",
        width: "15%"
    },
    dish: {
        color: color.black,
        width: "45%"
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 5,
        color: color.black,
    },
    date: {
        width: "45%",
        color: color.black,
    },
    kcal: {
        width: "15%",
        color: color.black,
    },
    title: {
        color: color.black,
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10
    },
    textStyle: {
        color: color.black,
        width: "45%"
    },
    text:{
        color: color.black,
        width: "15%"
    }

});

export default FoodAddItemCard