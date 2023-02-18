import color from "../color"

import React from "react";
import { Animated, StyleSheet, SafeAreaView } from "react-native";

import ExerciseModifyItemCard from "./ExerciseModifyItemCard";
import ExerciseAddItemCard from "./ExerciseAddItemCard";



const ExerciseDiaryFade = ({ fadeAnim, title, fadeType, onDiscardChanges, onConfirmedChanges, types, itemToModify, onConfirmAddItem, onDiscardAddItem, tabIndex }) => {


  const renderContent = () => {
    if (fadeType == "Modify")
      return <ExerciseModifyItemCard title={title} onDiscardChanges={onDiscardChanges} onChangesConfirmed={onConfirmedChanges} types={types} item={itemToModify} tabIndex={tabIndex}></ExerciseModifyItemCard>
    else if (fadeType == "Add")
      return <ExerciseAddItemCard title={title} onDiscardAddItem={onDiscardAddItem} onConfirmAddItem={onConfirmAddItem} types={types} tabIndex={tabIndex}></ExerciseAddItemCard>
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

export default ExerciseDiaryFade;
