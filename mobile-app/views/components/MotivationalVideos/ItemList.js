import {Pressable, StyleSheet, Text, View} from 'react-native';
import Dot from '../../../icons/dry-clean.svg';
import color from '../../../color';
import Play from '../../../icons/play.svg';
import {Divider} from 'react-native-elements';
import React from 'react';

function ItemList(props) {
  const videoItem = props.item;

  return (
    <>
      <View style={styles.itemContent} flexDirection={'row'}>
        <View flexDirection={'column'} width={'100%'}>
          <View
            marginBottom={20}
            marginLeft={5}
            marginRight={5}
            marginTop={5}
            flexDirection={'row'}
            justifyContent={'space-between'}>
            <Dot style={styles.itemIcon} fill={color.black} />
            <Text style={styles.itemTextLong}>{videoItem.title}</Text>
            <Pressable
              onPress={() => {
                props.onPress(videoItem.link);
              }}
              android_ripple={{color: color.lightBlue, borderless: true}}>
              <Play style={styles.itemIconPlay} />
            </Pressable>
          </View>
        </View>
      </View>
      <Divider orientation="horizontal" />
    </>
  );
}

const styles = StyleSheet.create({
  itemContent: {
    marginTop: 18,
    backgroundColor: color.white,
  },
  itemTextLong: {
    color: color.black,
  },
  itemTextShort: {
    color: color.black,
  },
  itemIcon: {
    width: 8,
    height: 8,
    color: color.black,
    marginTop: 7,
  },
  itemIconPlay: {
    width: 25,
    height: 25,
    color: color.black,
  },
});

export default ItemList;
