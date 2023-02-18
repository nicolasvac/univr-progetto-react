import color from "../color"

import React, { useState, useEffect } from 'react';

// import all the components we are going to use
import { SafeAreaView, Text, StyleSheet, View, FlatList, Modal, Pressable } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Search from "../icons/search.svg"
import XIcon from "../icons/x.svg"

const SearchModal = ({ types, modalVisible, setModalVisible, setDishOfNow }) => {
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);



    useEffect(() => {
        let l = []

        types.forEach((value, key) => {
            l.push({ id: key, title: value.name })
        })
        setFilteredDataSource(l);
        setMasterDataSource(l);

    }, []);

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const upperText = text.toUpperCase()
            const newData = masterDataSource.filter(item => item.title.toUpperCase().includes(upperText))

            if (newData.length == 0)
                setFilteredDataSource([{ id: 0, title: "No data found" }]);
            else
                setFilteredDataSource(newData);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(masterDataSource);
        }
        setSearch(text);
    };

    const ItemView = ({ item }) => {
        return (
            // Flat List Item

            <Text style={styles.itemStyle} onPress={() => manageItemClick(item)}>
             {/* <Text style={styles.itemStyle} onPress={() => createTwoButtonAlert(item)}> */}
                {item.id}
                {' - '}
                {item.title.toUpperCase()}
            </Text>
        );
    };

    const manageItemClick = (item) => {
        setDishOfNow(item.id)
        setModalVisible(false)
    }

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                }}
            />
        );
    };


    return (

        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View >

                    <SafeAreaView >
                        <View >
                            <SearchBar
                                style={{ flex: 2 }}
                                round
                                searchIcon={<Search height={"20"} width={"30"} fill={"white"} />}
                                clearIcon={
                                    <Pressable
                                        onPress={() => searchFilterFunction('')}
                                    >
                                        <XIcon
                                            height={"20"} width={"30"} fill={"white"}
                                        />
                                    </Pressable>
                                }
                                onChangeText={(text) => searchFilterFunction(text)}
                                //onClear={(text) => searchFilterFunction('')}
                                placeholder="Type Here..."
                                value={search}
                            />
                            <FlatList
                                style={{ padding: 10 }}
                                data={filteredDataSource}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={ItemView}
                            />
                        </View>
                    </SafeAreaView>

                </View>

            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 5,
        color: color.black,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    itemStyle: {
        color: color.black,
    },
});

export default SearchModal