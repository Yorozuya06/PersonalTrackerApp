import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { supabase } from './../ExpensesTab/SupabaseConfig'; // Import Supabase client

export default function CategoryList({ categoryList, onUpdate }) {

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('category')
                .delete()
                .match({ id });

            if (error) {
                throw error;
            }

            Alert.alert('Success', 'Category deleted successfully!');
            onUpdate(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting category:', error);
            Alert.alert('Error', 'Failed to delete category.');
        }
    };

    const handleEdit = async (id) => {
        // This is a placeholder for the actual edit logic
        // For example, you might navigate to an edit screen or show a modal with a form
        Alert.alert('Edit', `Edit functionality for category ID ${id} not implemented.`);
    };

    return (
        <ScrollView style={styles.wholeContainer}>
            <Text style={styles.textContainer}>Latest Budget</Text>
            <View style={styles.overallContainer}>
                {categoryList.map((category) => (
                    <View 
                        style={styles.container} 
                        key={category.id} // Use category ID as key if available
                    >
                        <Text style={[styles.iconText, { backgroundColor: category.color }]}>{category.icon}</Text>
                        <View style={styles.subContainer}>
                            <View>
                                <Text>Date: <Text>{category.date_created}</Text></Text>
                                <Text style={styles.categoryContainer}>{category.name}</Text>
                            </View>
                            <View style={styles.amountDeleteContainer}>
                                <View style={styles.editDeleteContainer}>
                                    <TouchableOpacity onPress={() => handleDelete(category.id)}>
                                        <MaterialCommunityIcons name="delete" size={24} color="red" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleEdit(category.id)}>
                                        <MaterialIcons name="edit" size={24} color="green" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.totalAmountText}>₱ {category.assigned_budget}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    overallContainer: {},
    wholeContainer: {
        marginBottom: 10,
    },
    textContainer: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    iconText: {
        fontSize: 35,
        padding: 16,
        borderRadius: 15,
    },
    container: {
        marginTop: 10, 
        alignItems: 'baseline',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15,
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
        justifyContent: 'space-between',
    },
    totalAmountText: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    categoryContainer: {
        fontSize: 20,
        fontWeight: 'bold',
    }, 
    amountDeleteContainer: {
        flexDirection: 'column',
        gap: 10, 
    }, 
    editDeleteContainer: {
        flexDirection: 'row',
        gap: 15,
    }
});
