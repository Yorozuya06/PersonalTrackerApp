import 'react-native-gesture-handler';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from './Colors';

export default function ColorPicker({ selectedColor, setSelectedColor }) {
    const colorpick = (color) => {
        setSelectedColor(color);
    };
    return (
        <View style={styles.ColorsContainer}>
            {Colors.Color_List.map((color, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        {
                            height: 30,
                            width: 30,
                            backgroundColor: color,
                            borderRadius: 99,
                        },
                        selectedColor === color && { borderWidth: 4, borderColor: 'black' }
                    ]}
                    onPress={() => colorpick(color)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    ColorsContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
    },
});
