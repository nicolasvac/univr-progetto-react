import color from "../color"

import React from 'react';

import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import { StyleSheet } from 'react-native';
import { Line } from 'react-native-svg'
import { View } from 'react-native'
import * as scale from 'd3-scale'


const MyBarChart = ({ data, height, threshold }) => {

    const fill = 'rgb(134, 65, 244)'


    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 30

    const HorizontalLine = (({ y }) => (
        <Line
            key={'zero-axis'}
            x1={'0%'}
            x2={'100%'}
            y1={y(threshold)}
            y2={y(threshold)}
            stroke={'red'}
            strokeDasharray={[4, 8]}
            strokeWidth={2}
        />
    ))

    return (<>
        <View style={{ height: height, padding: 10, flexDirection: 'column' }}>
            <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row', }}>
                <YAxis
                    data={data?.cal}
                    style={{ marginBottom: xAxisHeight, height: height - xAxisHeight * 1.6 }}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <BarChart
                    style={{ flex: 4, marginBottom: xAxisHeight, marginLeft: 10, height: height - xAxisHeight * 1.6 }}
                    data={data?.cal}
                    gridMin={0}
                    svg={{ fill }}
                    contentInset={verticalContentInset}>

                    <Grid />
                    <HorizontalLine />
                </BarChart>
            </View>
            <View style={{ height: xAxisHeight }}>
                <XAxis
                    style={{ height: xAxisHeight, flex: 1 }}
                    data={data?.time}
                    scale={scale.scaleBand}
                    formatLabel={(value, index) => data?.time[index]}
                    labelStyle={{ color: 'black', }}
                    svg={{ fontSize: 8, rotation: -30, fill: 'black', translateY: 14, translateX: 0, }}
                    contentInset={{ left: 30 }}
                />
            </View>
        </View >
    </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    },

});

export default MyBarChart