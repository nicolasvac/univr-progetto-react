import {Pressable, StyleSheet, Text, View} from 'react-native';
import color from '../../../color';
import Hamburger from '../../../icons/hamburger.svg';
import Logout from '../../../icons/logout.svg';
import React from 'react';
import {useTranslation} from 'react-i18next';

function TopBar(props) {
  // Importa handler delle traduzioni
  const {t} = useTranslation();

  // Estrai le props per leggibilità
  const navigation = props.navigation;

  return (
    <View style={styles.topBar}>
      <Pressable
        onPress={() => navigation.openDrawer()}
        android_ripple={{color: color.edalabBlue, borderless: false}}>
        <Hamburger style={styles.topBarIcon} />
      </Pressable>
      <Text style={styles.topBarText}>{t('nav:motivationalvideos')}</Text>
      <Pressable
        onPress={props.toggleOverlayLogOut}
        android_ripple={{color: color.edalabBlue, borderless: false}}>
        <Logout style={styles.topBarIcon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.lightBlue,
    padding: 10,
  },
  topBarText: {
    color: color.white,
    fontSize: 25,
    fontWeight: 'bold',
  },
  topBarIcon: {
    width: 35,
    height: 35,
    color: color.white,
  },
});

export default TopBar;
