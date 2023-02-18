import color from "../color"

import React from "react";
import { Animated, StyleSheet, SafeAreaView } from "react-native";

import FoodModifyItemCard from "./FoodModifyItemCard";
import FoodAddItemCard from "./FoodAddItemCard";



const FoodDiaryFade = ({ fadeAnim, title, fadeType, onDiscardChanges, onConfirmedChanges, types, itemToModify, onConfirmAddItem, onDiscardAddItem, tabIndex }) => {


  const renderContent = () => {
    if (fadeType == "Modify")
      return <FoodModifyItemCard title={title} onDiscardChanges={onDiscardChanges} onChangesConfirmed={onConfirmedChanges} types={types} item={itemToModify} ></FoodModifyItemCard>

    else if (fadeType == "Add")
      return <FoodAddItemCard title={title} onDiscardAddItem={onDiscardAddItem} onConfirmAddItem={onConfirmAddItem} types={types} tabIndex={tabIndex} ></FoodAddItemCard>
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

export default FoodDiaryFade;
