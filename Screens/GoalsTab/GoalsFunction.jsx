import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'react-native-elements/dist/checkbox/CheckBox';

const GoalsFunction = ({ goal, handleMainGoalCheck, handleDeleteGoal, handleAddSubGoal, handleSubGoalCheck, handleDeleteSubGoal }) => {
  const [subGoalInputVisible, setSubGoalInputVisible] = useState(false);
  const [newSubGoalTitle, setNewSubGoalTitle] = useState('');

  const handleAddSubGoalWrapper = () => {
    if (newSubGoalTitle.trim() !== '') {
      handleAddSubGoal(goal.id, newSubGoalTitle);
      setNewSubGoalTitle('');
      setSubGoalInputVisible(false);
    }
  };

  return (
    <View style={styles.goalContainer}>
      <View style={styles.goalHeader}>
        <CheckBox
          checked={goal.completed}
          onPress={() => handleMainGoalCheck(goal.id)}
          checkedColor="#FFD708"
        />
        <Text style={[styles.goalTitle, goal.completed && styles.completedGoal]}>{goal.title}</Text>
        <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
          <Ionicons name="trash" size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>
      {goal.subGoals.map((subGoal) => (
        <View key={subGoal.id} style={styles.subGoalContainer}>
          <CheckBox
            checked={subGoal.completed}
            onPress={() => handleSubGoalCheck(goal.id, subGoal.id)}
            checkedColor="#FFD708"
            size={20}
          />
          <Text style={[styles.subGoalTitle, subGoal.completed && styles.completedSubGoal]}>{subGoal.title}</Text>
          <TouchableOpacity onPress={() => handleDeleteSubGoal(goal.id, subGoal.id)}>
            <Ionicons name="trash" size={20} color="#FF0000" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={() => setSubGoalInputVisible(true)} style={styles.addSubGoalButton}>
        <Ionicons name="add-circle" size={30} color="#FFD708" />
      </TouchableOpacity>
      <Modal
        visible={subGoalInputVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSubGoalInputVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter New Sub-Goal"
              value={newSubGoalTitle}
              onChangeText={setNewSubGoalTitle}
              autoFocus={true}
              onSubmitEditing={handleAddSubGoalWrapper}
              selectionColor={"#696969"}
              textAlignVertical='center'
              textAlign='center'
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={handleAddSubGoalWrapper}>
                <Text style={styles.buttonText}>Add Sub-Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setSubGoalInputVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  goalContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  goalTitle: {
    fontSize: 18,
    flex: 1,
    fontWeight: 'bold',
  },
  completedGoal: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  subGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 33,
    marginBottom: 5,
  },
  subGoalTitle: {
    fontSize: 16,
    flex: 1,
  },
  completedSubGoal: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  addSubGoalButton: {
    marginLeft: 45,
    marginTop: 5,
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
});

export default GoalsFunction;