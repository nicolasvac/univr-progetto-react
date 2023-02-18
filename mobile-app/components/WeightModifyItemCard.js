import color from "../color"

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";

import Bin from "../icons/trash.svg"
import X from "../icons/x.svg"
import Check from "../icons/check.svg"
import { useTranslation } from 'react-i18next'
import { dateToMomentYYYYMMDDHHMM,dateToMomentYYYYMMDDHHMMSS  } from "../utility/DateUtilities"


const WeightModifyItemCard = ({ onDiscardChanges, onChangesConfirmed, item, onDelete }) => {


    const [weightOfNow, setWeightOfNow] = useState(item.weight.toString());
    const { t } = useTranslation()

    useEffect(() => {
        setWeightOfNow(item.weight.toString())
    }, [item]);

    const onCheckPressed = () => {

        if (weightOfNow == "") {
            alert(t("weightdiary:fillAllFields"))
            return
        }
        var body = new FormData();
        body.append('value', weightOfNow);
        body.append('time', dateToMomentYYYYMMDDHHMMSS(item.time));
        // console.log("%%DBG", body)

        onChangesConfirmed(body)
    }

    const onDeletePressed = () => {
    
        var body = new FormData();
        body.append('time', dateToMomentYYYYMMDDHHMMSS(item.time));

        onDelete(body)
    }


    return (
        <View style={styles.card}>
            <View flexDirection='row' alignItems='center' justifyContent='space-between' style={{ marginBottom: 10 }}>
                <Text style={styles.title}>
                    {t("weightdiary:modifyEntry")}
                </Text>
                <Pressable onPress={onDeletePressed} android_ripple={{ color: color.edalabBlue, borderless: false }}
                    backgroundColor={color.lightBlue} borderRadius={7} width={50} padding={5} alignItems={"center"} margin={10}>
                    <Bin height={"20"} width={"30"} fill={"white"} />
                </Pressable>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>{t("weightdiary:date")}</Text>
                <Text style={styles.date}>{dateToMomentYYYYMMDDHHMM(item.time)}</Text>



                <Text style={styles.label}>{t("weightdiary:weight")}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setWeightOfNow}
                    keyboardType="numeric"
                    value={weightOfNow}
                />
            </View>

            <View flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                <Pressable onPress={onDiscardChanges} android_ripple={{ color: color.edalabBlue, borderless: false }}
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
        color: color.black,

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

export default WeightModifyItemCard