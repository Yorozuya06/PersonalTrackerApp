import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Goal from './GoalsFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [goalInputVisible, setGoalInputVisible] = useState(false);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const storedGoals = await AsyncStorage.getItem('goals');
        if (storedGoals) {
          setGoals(JSON.parse(storedGoals));
        }
      } catch (error) {
        console.error('Failed to load goals:', error);
      }
    };

    loadGoals();
  }, []);

  useEffect(() => {
    const saveGoals = async () => {
      try {
        await AsyncStorage.setItem('goals', JSON.stringify(goals));
      } catch (error) {
        console.error('Failed to save goals:', error);
      }
    };

    saveGoals();
  }, [goals]);

  const handleAddGoal = () => {
    if (newGoalTitle.trim() !== '') {
      const newGoal = {
        id: Date.now().toString(),
        title: newGoalTitle,
        completed: false,
        subGoals: []
      };
      setGoals(prevGoals => [...prevGoals, newGoal]);
      setNewGoalTitle('');
      setGoalInputVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Goal added successfully'
      });

      Notifications.scheduleNotificationAsync({
        content: {
          title: "New Goal Added!",
          body: `Your goal "${newGoalTitle}" has been added.`,
        },
        trigger: { seconds: 1 },
      });
    }
  };

  const confirmDeleteGoal = (goalId) => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete it?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => handleDeleteGoal(goalId) }
      ]
    );
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    Toast.show({
      type: 'error',
      text1: 'Goal deleted'
    });
  };

  const confirmDeleteSubGoal = (goalId, subGoalId) => {
    Alert.alert(
      "Delete Sub-Goal",
      "Are you sure you want to delete it?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => handleDeleteSubGoal(goalId, subGoalId) }
      ]
    );
  };

  const handleDeleteSubGoal = (goalId, subGoalId) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subGoals: goal.subGoals.filter(subGoal => subGoal.id !== subGoalId)
          };
        }
        return goal;
      })
    );
    Toast.show({
      type: 'error',
      text1: 'Sub-goal deleted'
    });
  };

  const handleAddSubGoal = (goalId, newSubGoalTitle) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subGoals: [
              ...goal.subGoals,
              {
                id: Date.now().toString(),
                title: newSubGoalTitle,
                completed: false,
              },
            ],
          };
        }
        return goal;
      })
    );
    Toast.show({
      type: 'success',
      text1: 'Sub-goal added successfully'
    });
  };

  const handleMainGoalCheck = (goalId) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newCompletedStatus = !goal.completed;
          return {
            ...goal,
            completed: newCompletedStatus,
            subGoals: goal.subGoals.map(subGoal => ({ ...subGoal, completed: newCompletedStatus }))
          };
        }
        return goal;
      })
    );
  };

  const handleSubGoalCheck = (goalId, subGoalId) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedSubGoals = goal.subGoals.map(subGoal => {
            if (subGoal.id === subGoalId) {
              return { ...subGoal, completed: !subGoal.completed };
            }
            return subGoal;
          });
          const allSubGoalsCompleted = updatedSubGoals.every(subGoal => subGoal.completed);
          return {
            ...goal,
            subGoals: updatedSubGoals,
            completed: allSubGoalsCompleted
          };
        }
        return goal;
      })
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Goals</Text>
      {goals.length === 0 ? (
        <View style={styles.centeredTextContainer}>
          <Text style={styles.createGoalText}>Create your First Goal</Text>
          <Text style={styles.tapIconText}>Tap + icon to create a Goal</Text>
        </View>
      ) : (
        <ScrollView>
          {goals.map((goal) => (
            <Goal
              key={goal.id}
              goal={goal}
              handleMainGoalCheck={handleMainGoalCheck}
              handleDeleteGoal={confirmDeleteGoal}
              handleAddSubGoal={handleAddSubGoal}
              handleSubGoalCheck={handleSubGoalCheck}
              handleDeleteSubGoal={confirmDeleteSubGoal}
            />
          ))}
        </ScrollView>
      )}
      <Modal
        visible={goalInputVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGoalInputVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter New Goal"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              autoFocus={true}
              onSubmitEditing={handleAddGoal}
              selectionColor={"#696969"}
              textAlignVertical='center'
              textAlign='center'
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={handleAddGoal}>
                <Text style={styles.buttonText}>Add Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setGoalInputVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.addGoalButton} onPress={() => setGoalInputVisible(true)}>
        <Ionicons name="add-circle" size={70} color="#FFD708" />
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  centeredTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createGoalText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 1,
  },
  tapIconText: {
    fontSize: 16,
    color: '#888888',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    color: '#000000',
  },
  input: {
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#696969',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFD708',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addGoalButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default Goals;