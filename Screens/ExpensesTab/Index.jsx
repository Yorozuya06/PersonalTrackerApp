import "react-native-gesture-handler";
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ColorPicker from './ColorPicker';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { supabase } from "./SupabaseConfig";
import { AntDesign } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function Spent({}) {

    // States for the modal and inputs
    const [date, setDate] = useState(new Date());
    const [selectedIcon, setSelectedIcon] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [totalBudget, setTotalBudget] = useState('');
    const [categoryIcons, setCategoryIcons] = useState('');
    const [calendar, setCalendar] = useState('');
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        const formatDate = (date) => {
            const options = { month: 'long', day: '2-digit', year: 'numeric' };
            return date.toLocaleDateString('en-US', options).replace(',', '').replace(' ', '/').replace(' ', '/');
        };
        setCalendar(formatDate(date));
    }, [date]);

    const onCreateCategory = async () => {
        const { data, error } = await supabase.from('category').insert([{
            name: categoryName,
            assigned_budget: totalBudget,
            icon: selectedIcon,
            color: selectedColor,
            category_icons: categoryIcons,
            date_created: calendar,
        }]).select('*');
        if (data) {
            ToastAndroid.show('Category Created!', ToastAndroid.SHORT);
        } else if (error) {
            console.error(error);
        }
    };

    const showDatePicker = (mode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: (event, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
            },
            mode,
        });
    };

    const handleIconSelect = (iconName, iconCategory) => {
        setSelectedIcon(iconName);
        setCategoryIcons(iconCategory); // Store the category for backend usage
        setOpen(false); // Close the modal
    };

    function ForModal() {
        return (
            <BottomSheet
                index={isOpen ? 0 : -1}
                snapPoints={['50%']}
                onChange={(index) => setOpen(index === 0)}
            >
                <View style={styles.sheetContent}>
                    <View style={styles.exitButton}>
                        <TouchableOpacity onPress={() => setOpen(false)} style={{ padding: 1, gap: 10 }}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity style={{padding: 10, alignItems: 'center', justifyContent: 'center',}} onPress={() => handleIconSelect('gas-pump', 'Gas')}>
                            <FontAwesome6 name="gas-pump" size={24} color="black" />
                            <Text>Gas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding: 10, alignItems: 'center', justifyContent: 'center',}} onPress={() => handleIconSelect('bowl-food', 'Food')}>
                            <FontAwesome6 name="bowl-food" size={24} color="black" />
                            <Text>Food</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding: 10, alignItems: 'center', justifyContent: 'center',}} onPress={() => handleIconSelect('receipt', 'Receipt')}>
                            <FontAwesome6 name="receipt" size={24} color="black" />
                            <Text>Loan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding: 10, alignItems: 'center', justifyContent: 'center',}} onPress={() => handleIconSelect('cart-shopping', 'Grocery')}>
                            <FontAwesome6 name="cart-shopping" size={24} color="black" />
                            <Text>Grocery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding: 10, alignItems: 'center', justifyContent: 'center',}} onPress={() => handleIconSelect('comment-dots', 'Uncategorized')}>
                            <FontAwesome6 name="comment-dots" size={24} color="black" />
                            <Text>Uncategorized</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ marginTop: 20, padding: 20 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={[styles.IconInputContainer, { backgroundColor: selectedColor || 'transparent' }]}>
                            {selectedIcon ? (
                                <FontAwesome6 name={selectedIcon} size={30} color="black" />
                            ) : (
                                <Text style={styles.IconInputPlaceholder}>Select Icon</Text>
                            )}
                        </View>
                        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                    </View>
                    <View style={styles.categoryContainer}>
                        <TextInput
                            editable={false}
                            placeholder="Category"
                            style={{ width: '100%' }}
                            value={categoryIcons} // Display the selected category in text format
                        />
                        <TouchableOpacity
                            style={{ margin: 'auto', borderLeftWidth: 1, borderColor: '#696969' }}
                            onPress={() => setOpen(!isOpen)}
                        >
                            <AntDesign name="down" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.budgetView}>
                        <FontAwesome6 name="peso-sign" size={24} color="#696969" />
                        <TextInput
                            placeholder="Total Budget"
                            style={{ width: '100%' }}
                            keyboardType="numeric"
                            onChangeText={(v) => setTotalBudget(v)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="note-add" size={24} color="#696969" />
                        <TextInput
                            placeholder="Note"
                            style={{ width: '100%' }}
                            onChangeText={(v) => setCategoryName(v)}
                        />
                    </View>
                    <View style={styles.calendarContainer}>
                        <TextInput
                            style={{ width: '85%' }}
                            placeholder="Date and Time created"
                            value={calendar}
                            editable={false}
                        />
                        <View style={styles.calendarButtons}>
                            <TouchableOpacity style={styles.calendarButton} onPress={() => showDatePicker('date')}>
                                <Entypo name="calendar" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        disabled={!categoryName || !totalBudget}
                        onPress={onCreateCategory}
                    >
                        <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Create</Text>
                    </TouchableOpacity>
                    {isOpen && <ForModal />}
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    IconInputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#696969',
    },
    IconInputPlaceholder: {
        textAlign: 'center',
        fontSize: 18,
        color: '#696969',
    },
    inputView: {
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        padding: 14,
        borderRadius: 10,
        borderColor: '#696969',
        marginTop: 20,
        alignItems: 'center',
    },
    budgetView: {
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        padding: 14,
        borderRadius: 10,
        borderColor: '#696969',
        marginTop: 20,
        alignItems: 'center',
    },
    buttonContainer: {
        backgroundColor: 'purple',
        padding: 15,
        borderRadius: 20,
        marginTop: 30,
    },
    categoryContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 10,
        padding: 14,
        borderColor: '#696969',
        marginTop: 20,
        alignContent: 'space-between',
    },
    sheetContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconsContainer: {
        gap: 10,
        flexDirection: 'row',
        padding: 10,
        color: 'white',
    },
    exitButton: {
        padding: 10,
        gap: 10,
        backgroundColor: 'red',
        position: 'absolute',
        right: 10,
        top: 10,
    },
    calendarContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 10,
        padding: 14,
        borderColor: '#696969',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calendarButtons: {
        flexDirection: 'row',
    },
    calendarButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderColor: '#696969',
        paddingLeft: 10,
    },
    clockContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#696969',
        paddingLeft: 10,
    },
});
