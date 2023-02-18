import {StyleSheet, View, Text} from 'react-native';
import {Slider} from 'react-native-elements';
import React from 'react';

function VideoTimeSlider(props) {
  // Estrai le proprietà in maniera leggibile da props
  let minTime = 0;
  let totalTime = props.videoTotalTime;
  let currentTime = props.videoCurrentTime;

  // Trasforma i secondi in DateTime formattabili all'utente testualmente
  let totalTimeText =
    totalTime != null
      ? new Date(totalTime * 1000).toISOString().slice(11, 19)
      : '00:00:00';
  let currentTimeText =
    currentTime != null
      ? new Date(currentTime * 1000).toISOString().slice(11, 19)
      : '00:00:00';

  // All'inizio del caricamento entrambi i valori sono a zero, quindi nascondiamo lo slider.

  // Tieni una variabile per mantenere traccia di dove salta il video.
  let internalValueChange = currentTime;

  return (
    <View style={styles.row}>
      <Text style={styles.timeTexts}>{currentTimeText}</Text>
      <Slider
        style={styles.timeSlider}
        minimumValue={minTime}
        maximumValue={totalTime}
        value={internalValueChange}
        onValueChange={value => {
          console.log('CAMBIO LO SLIDER IN ', value);
          internalValueChange = Math.round(value);
        }}
        onSlidingComplete={value => {
          props.onValueChange(internalValueChange);
        }}
      />
      <Text style={styles.timeTexts}>{totalTimeText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timeTexts: {
    color: 'black',
    fontSize: 16,
    flex: 1,
    marginHorizontal: 10,
  },
  timeSlider: {
    flex: 3,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default VideoTimeSlider;
