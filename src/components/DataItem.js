import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DataItem({ dataLabel, dataValue, iconName, iconColor }) {
  return (
    <View style={styles.dataItem}>
      <View style={styles.dataIconContainer}>
        <Icon name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.dataTextContainer}>
        <Text style={styles.dataLabel}>{dataLabel}:</Text>
        <Text style={styles.dataValue}>{dataValue}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dataItem: {
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dataIconContainer: {
    marginRight: 10,
  },
  dataTextContainer: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataValue: {
    fontSize: 16,
  },
});