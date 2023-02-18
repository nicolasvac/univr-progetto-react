import color from "../color"

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import X from "../icons/x.svg"
import Check from "../icons/check.svg"
import ArrowDown from "../icons/arrowDown.svg"
import Time from "../icons/time.svg"
import { useTranslation } from 'react-i18next'
import { dateToMomentYYYYMMDDHHMM } from "../utility/DateUtilities"


import DateTimePicker from '@react-native-community/datetimepicker';



const ExerciseAddItemCard = ({ title, onDiscardAddItem, onConfirmAddItem, types, tabIndex }) => {
    const [exerciseOfNow, setExerciseOfNow] = useState();
    const [durationOfNow, setDurationOfNow] = useState();

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

    const getDateYesterday = () => {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        return date
    }

    const renderMenuOptions = () => {
        return (
            <>
                {types.map((element, index) =>
                    <MenuOption onSelect={() => setExerciseOfNow(index)} key={index}>
                        <Text style={{ color: color.black }}>{types[index]}</Text>
                    </MenuOption>)}
            </>
        )
    }

    const getCurrentDate = () => {
        return dateToMomentYYYYMMDDHHMM(new Date())
    }

    useEffect(() => {
        setExerciseOfNow("")
        setDurationOfNow("")
    }, [1]);

    const onCheckPressed = () => {

        if (exerciseOfNow == null || durationOfNow == "") {
            alert(t("exercisediary:fillAllFields"))
            return
        }
        var body = new FormData();
        body.append("type", exerciseOfNow);
        body.append("duration", parseInt(durationOfNow));
        body.append("time", dateToMomentYYYYMMDDHHMM(date))

        onConfirmAddItem(body)
    }


    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                {title}
            </Text>
            <View style={styles.row}>
                <Text style={styles.labelDate}>{t("exercisediary:date")}</Text>

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
                    />
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.labelExercise} >{t("exercisediary:exercise")}</Text>
                <Menu style={styles.menu}>
                    <MenuTrigger style={{ width: "100%" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", }}>
                            <Text style={{ color: color.black, width: "100%", paddingLeft: 5 }}>{types[exerciseOfNow]}</Text>
                            <ArrowDown width={20} fill={"black"} />
                        </View>
                    </MenuTrigger>
                    <MenuOptions >
                        <ScrollView style={{ maxHeight: 200 }}>
                            {renderMenuOptions()}
                        </ScrollView>
                    </MenuOptions>
                </Menu>
            </View>

            <View style={styles.row}>
                <Text style={styles.labelDuration}>{types[exerciseOfNow] == 'Passi' ? t("exercisediary:numOfsteps") : t("exercisediary:duration")}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setDurationOfNow}
                    keyboardType="numeric"
                    value={durationOfNow}
                />
            </View>



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
    labelDate: {
        color: color.black,
        fontWeight: "bold",
        width: "16%"
    },
    labelExercise: {
        color: color.black,
        fontWeight: "bold",
        width: "30%"
    },
    labelDuration: {
        color: color.black,
        fontWeight: "bold",
        width: "30%"
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
    menu: {
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        backgroundColor: color.white,
        padding: 5,
        width: "43%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: -10,
        maxHeight: 500
    },

});

export default ExerciseAddItemCard