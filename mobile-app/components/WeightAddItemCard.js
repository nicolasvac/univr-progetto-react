import color from "../color"

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";

import X from "../icons/x.svg"
import Check from "../icons/check.svg"
import { useTranslation } from 'react-i18next'
import { dateToMomentYYYYMMDDHHMM } from "../utility/DateUtilities"
import { dateToMomentYYYYMMDDHHMMSS } from "../utility/DateUtilities"


const WeightAddItemCard = ({ onDiscardAddItem, onConfirmAddItem }) => {


    const [weightOfNow, setWeightOfNow] = useState();
    const [dateOfNow, setDateOfNow] = useState();
    const { t } = useTranslation()



   
    const getCurrentDate = () => {
        return dateToMomentYYYYMMDDHHMMSS(new Date())
    }

    useEffect(() => {
        setWeightOfNow("")
        setDateOfNow("")
        setDateOfNow(getCurrentDate)
    }, [dateOfNow]);

    const onCheckPressed = () => {

        if (weightOfNow == "") {
            alert(t("weightdiary:fillAllFields"))
            return
        }
        var body = new FormData();
        body.append('value', weightOfNow);
        body.append('time', getCurrentDate());

        onConfirmAddItem(body)
    }


    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                {t("weightdiary:newEntry")}
            </Text>


            <View style={styles.row}>
                <Text style={styles.label}>{t("weightdiary:date")}</Text>
                <Text style={styles.date}>{dateToMomentYYYYMMDDHHMM(dateOfNow)}</Text>



                <Text style={styles.label}>{t("weightdiary:weight")}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setWeightOfNow}
                    keyboardType="numeric"
                    value={weightOfNow}
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
        marginLeft: -10


    },
    input: {
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        backgroundColor: color.white,
        width: "15%",
        height: "80%",
        color:color.black,

    },
    label: {
        color: color.black,
        fontWeight: "bold",
        width: "15%"
    },
    dish: {
        color: color.black,
        width: "25%"
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
        width: "30%",
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

    }

});

export default WeightAddItemCard