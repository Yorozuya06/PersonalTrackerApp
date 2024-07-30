import "react-native-gesture-handler";
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl, TextInput, TouchableOpacity, Modal } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome6 } from '@expo/vector-icons';
import { supabase } from "./../ExpensesTab/SupabaseConfig";
import { MaterialIcons, Entypo } from '@expo/vector-icons';

export default function Statistics() {
    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState('');
    const [newBudget, setNewBudget] = useState('');

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('category').select('*');
        setLoading(false);
        if (error) {
            console.error('Error fetching categories:', error);
        } else {
            setCategoryList(data || []);
        }
    };

    // Handle category deletion
    const deleteCategory = async (id) => {
        const { error } = await supabase
            .from('category')
            .delete()
            .match({ id });

        if (error) {
            console.error('Error deleting category:', error);
        } else {
            fetchCategories();
        }
    };

    // Handle category update
    const updateCategory = async () => {
        const { error } = await supabase
            .from('category')
            .update({
                name: newName,
                icon: newIcon,
                assigned_budget: newBudget
            })
            .match({ id: currentCategory.id });

        if (error) {
            console.error('Error updating category:', error);
        } else {
            setIsEditing(false);
            fetchCategories();
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1, padding: 20 }}
                refreshControl={
                    <RefreshControl onRefresh={() => fetchCategories()} refreshing={loading} />
                }
            >
                {categoryList.map((category) => (
                    <View key={category.id} style={styles.categoryContainer}>
                        <FontAwesome6 name={category.icon} size={24} color="black" />
                        <Text style={styles.categoryText}>{category.name}</Text>
                        <Text>₱ {category.assigned_budget}</Text>
                        <TouchableOpacity onPress={() => deleteCategory(category.id)}>
                            <MaterialIcons name="delete" size={24} color="red" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setCurrentCategory(category);
                            setNewName(category.name);
                            setNewIcon(category.icon);
                            setNewBudget(category.assigned_budget);
                            setIsEditing(true);
                        }}>
                            <Entypo name="edit" size={24} color="green" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={isEditing}
                animationType="slide"
                onRequestClose={() => setIsEditing(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Category</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Category Name"
                        value={newName}
                        onChangeText={setNewName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Assigned Budget"
                        value={newBudget}
                        keyboardType="numeric"
                        onChangeText={setNewBudget}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.button} onPress={updateCategory}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setIsEditing(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'space-between',
    },
    categoryText: {
        marginLeft: 10,
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});
