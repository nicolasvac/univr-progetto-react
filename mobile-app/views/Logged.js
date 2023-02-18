import React from 'react';
import {View, Button} from 'react-native';
import color from "../color"
import { createDrawerNavigator } from '@react-navigation/drawer';
import Homepage from "./Homepage"
import FoodDiary from './FoodDiary';
import FoodAgenda from './FoodAgenda';
import ExerciseDiary from './ExerciseDiary';
import WeightDiary from './WeightDiary';
import MotivationalVideos from './MotivationalVideos';
import { useTranslation } from 'react-i18next'
import MotivationalPdfs from './MotivationalPdfs';


const Drawer = createDrawerNavigator();


function NotificationsScreen({ navigation }) {

    const { t } = useTranslation()


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate(t("nav:homepage"))} title="Go back Homepage" />
        </View>
    );
}

export default function Logged({ navigation }) {

    const { t } = useTranslation()
    
    return (
        <Drawer.Navigator
            initialRouteName={t("nav:homepage")}
            drawerStyle={{
                backgroundColor: color.background,
                color: "#fff",
            }}
            drawerContentOptions={{
                activeTintColor: color.veryLightBlue,
                itemStyle: {
                },
                labelStyle: {
                    color: 'white',
                },

            }}
            screenOptions={{ headerShown: false }}
        >
            <Drawer.Screen name={t("nav:homepage")} component={Homepage} options={{ icon: 'Check' }}/>
            <Drawer.Screen name={t("nav:foodagenda")} component={FoodAgenda} />
            <Drawer.Screen name={t("nav:fooddiary")} component={FoodDiary} />
            <Drawer.Screen name={t("nav:exercisediary")} component={ExerciseDiary} />
            <Drawer.Screen name={t("nav:weightdiary")} component={WeightDiary} />
            <Drawer.Screen name={t("nav:motivationalvideos")} component={MotivationalVideos} />
            <Drawer.Screen name={t("nav:motivationalpdfs")} component={MotivationalPdfs} />


        </Drawer.Navigator>
    );
}