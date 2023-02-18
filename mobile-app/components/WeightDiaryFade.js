import color from "../color"

import React from "react";
import { Animated, StyleSheet, SafeAreaView } from "react-native";
import WeightAddItemCard from "./WeightAddItemCard"
import WeightModifyItemCard from "./WeightModifyItemCard"



const WeightDiaryFade = ({ fadeAnim, fadeType, onDiscardChanges, onConfirmedChanges, itemToModify, onConfirmAddItem, onDiscardAddItem, onDelete }) => {


  const renderContent = () => {

    if (fadeType == "Modify")
      return <WeightModifyItemCard onDiscardChanges={onDiscardChanges} onChangesConfirmed={onConfirmedChanges} item={itemToModify} onDelete={onDelete}></WeightModifyItemCard>
    else if (fadeType == "Add")
      return <WeightAddItemCard onDiscardAddItem={onDiscardAddItem} onConfirmAddItem={onConfirmAddItem} />
    else
      return null

  }


  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim
          }
        ]}
      >
        {renderContent()}
      </Animated.View>
    </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
});

export default WeightDiaryFade;
