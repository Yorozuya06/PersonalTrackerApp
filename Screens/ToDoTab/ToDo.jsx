import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StatusBar,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BackHandler } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const ToDo = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState({});
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [editEventModalVisible, setEditEventModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventHour, setEventHour] = useState("08");
  const [eventMinute, setEventMinute] = useState("00");
  const [eventAmPm, setEventAmPm] = useState("AM");
  const [selectedPriority, setSelectedPriority] = useState("low");
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [selectDateModalVisible, setSelectDateModalVisible] = useState(false);
  const [sortPreference, setSortPreference] = useState("time");
  const [viewListVisible, setViewListVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [selectedDate]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setSelectDateModalVisible(false);
  };

  const openEventModal = () => {
    setEventModalVisible(true);
  };

  const closeEventModal = () => {
    setEventModalVisible(false);
    clearEventForm();
  };

  useEffect(() => {
    const handleBackButtonPress = () => {
      if (editEventModalVisible) {
        closeEditEventModal();
        return true;
      } else if (eventModalVisible) {
        closeEventModal();
        return true;
      } else if (selectDateModalVisible) {
        setSelectDateModalVisible(false);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress);

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonPress
      );
    };
  }, [editEventModalVisible, eventModalVisible, selectDateModalVisible]);

  const openEditEventModal = (index) => {
    const event = events[selectedDate][index];
    setEventTitle(event.title);
    setEventDescription(event.description);
    const [time, amPm] = event.time.split(" ");
    const [hour, minute] = time.split(":");
    setEventHour(hour);
    setEventMinute(minute);
    setEventAmPm(amPm);
    setSelectedPriority(event.priority);
    setSelectedEventIndex(index);
    setEditEventModalVisible(true);
  };

  const closeEditEventModal = () => {
    setEditEventModalVisible(false);
    clearEventForm();
  };

  const handleAddEvent = () => {
    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      time: `${eventHour}:${eventMinute} ${eventAmPm}`,
      priority: selectedPriority,
    };

    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      if (!updatedEvents[selectedDate]) {
        updatedEvents[selectedDate] = [];
      }
      updatedEvents[selectedDate].push(newEvent);

      return updatedEvents;
    });

    closeEventModal();
  };

  const handleEditEvent = () => {
    const updatedEvent = {
      title: eventTitle,
      description: eventDescription,
      time: `${eventHour}:${eventMinute} ${eventAmPm}`,
      priority: selectedPriority,
    };

    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[selectedDate][selectedEventIndex] = updatedEvent;

      return updatedEvents;
    });

    closeEditEventModal();
  };

  const handleDeleteEvent = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newEvents = { ...events };
            newEvents[selectedDate].splice(selectedEventIndex, 1);
            if (newEvents[selectedDate].length === 0) {
              delete newEvents[selectedDate];
            }
            setEvents(newEvents);
            closeEditEventModal();
            ToastAndroid.show(
              "Event deleted successfully!",
              ToastAndroid.SHORT
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const clearEventForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventHour("08");
    setEventMinute("00");
    setEventAmPm("AM");
    setSelectedPriority("low");
    setSelectedEventIndex(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "#FE5A1D";
      case "normal":
        return "#F3D000";
      case "low":
        return "#00B486";
      default:
        return "#00B486";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const markedDates = {};
  Object.keys(events).forEach((date) => {
    const eventCount = events[date].length;
    markedDates[date] = {
      marked: true,
      dots: events[date].slice(0, 3).map((event) => ({
        color: getPriorityColor(event.priority),
      })),
      ...(eventCount > 3 && { moreThan3: eventCount - 3 }),
    };
  });

  const handleSortEvents = () => {
    const newSortPreference = sortPreference === "time" ? "priority" : "time";
    setSortPreference(newSortPreference);
  };

  const sortEvents = (events) => {
    return events.sort((a, b) => {
      if (sortPreference === "time") {
        const timeA = convertTo24HourFormat(a.time);
        const timeB = convertTo24HourFormat(b.time);
        return timeA.localeCompare(timeB);
      } else {
        const priorityOrder = { Urgent: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });
  };

  const convertTo24HourFormat = (time) => {
    const [hour, minute] = time.split(":");
    let [h, period] = [parseInt(hour), time.slice(-2)];

    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${minute.slice(0, -3)}`;
  };

  const getAllEvents = () => {
    const allEvents = [];

    Object.keys(events).forEach((date) => {
      events[date].forEach((event) => {
        allEvents.push({
          date,
          ...event,
        });
      });
    });

    return allEvents;
  };

  const groupEventsByDate = (events) => {
    return events.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  };

  const sortEventsByDate = (events) => {
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const allEvents = getAllEvents();
  const sortedEvents = sortEventsByDate(allEvents);
  const groupedEvents = groupEventsByDate(sortedEvents);

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowTimePicker(Platform.OS === 'ios');
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    setEventHour(String(adjustedHour).padStart(2, '0'));
    setEventMinute(String(minute).padStart(2, '0'));
    setEventAmPm(amPm);
  };

  const defaultTime = new Date();
  defaultTime.setHours(8);
  defaultTime.setMinutes(0);
  defaultTime.setSeconds(0);
  defaultTime.setMilliseconds(0);

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendarContainer}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        renderArrow={(direction) => (
          <MaterialIcons
            name={direction === "left" ? "chevron-left" : "chevron-right"}
            size={24}
          />
        )}
        dayComponent={({ date, state }) => {
          const isSelected = date.dateString === selectedDate;
          const hasDots = markedDates[date.dateString]?.dots?.length > 0;
          const moreThan3 = markedDates[date.dateString]?.moreThan3;

          return (
            <TouchableOpacity
              style={[
                styles.dayContainer,
                isSelected && styles.selectedDay,
                date.dateString === new Date().toISOString().split("T")[0] &&
                  styles.today,
              ]}
              onPress={() => handleDayPress(date)}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isSelected
                      ? "black"
                      : state === "disabled"
                      ? "#d9e1e8"
                      : "#2d4150",
                  },
                ]}
              >
                {date.day}
              </Text>
              {hasDots && (
                <View style={styles.dotsContainer}>
                  {markedDates[date.dateString].dots.map((dot, index) => (
                    <View
                      key={index}
                      style={[styles.dot, { backgroundColor: dot.color }]}
                    />
                  ))}
                  {moreThan3 && (
                    <Text style={styles.moreEventsIndicator}>+{moreThan3}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.eventSectionHeader}>
        {events[selectedDate] && events[selectedDate].length > 0 && (
          <TouchableOpacity
            onPress={handleSortEvents}
            style={styles.sortIconContainer}
          >
            <FontAwesome
              name={sortPreference === "time" ? "clock-o" : "sort-amount-asc"}
              style={
                sortPreference === "time"
                  ? styles.iconClock
                  : styles.iconPriority
              }
              color="#333"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.viewListButton}
          onPress={() => setViewListVisible(!viewListVisible)}
        >
          <Text>View</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.eventsContainer}>
        {events[selectedDate] ? (
          sortEvents(events[selectedDate]).map((event, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.eventContainer,
                {
                  borderColor: getPriorityColor(event.priority),
                },
              ]}
              onPress={() => openEditEventModal(index)}
            >
              <Text style={styles.eventTime}>{event.time}</Text>
              <Text style={styles.eventTitle}>{event.title || "No title"}</Text>
              <Text style={styles.eventDescription}>
                {event.description || "Calendar event"}
              </Text>
              <View
                style={[
                  styles.priorityIndicator,
                  { backgroundColor: getPriorityColor(event.priority) },
                ]}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noEventsText}>No events for this day.</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={openEventModal}>
        <Entypo name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      <Modal visible={eventModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
        <View style={styles.addContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeEventModal}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveIcon} onPress={handleAddEvent}>
            <MaterialIcons name="check" size={24} color="#000" />
          </TouchableOpacity>
          </View>
          <Text style={styles.modalTitle}>Add Event</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={eventTitle}
            onChangeText={(text) => setEventTitle(text)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={eventDescription}
            onChangeText={setEventDescription}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={styles.selectedDateContainer}
            onPress={() => setSelectDateModalVisible(true)}
          >
            <Text style={styles.selectedDateText}>
              {selectedDate ? ` ${formatDate(selectedDate)}` : "Select Date"}
            </Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.timeStyle}
            >
              <Text
                style={styles.inputTime}
              >{`${eventHour}:${eventMinute} ${eventAmPm}`}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={defaultTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
            )}
            <Picker
              selectedValue={selectedPriority}
              onValueChange={(itemValue) => setSelectedPriority(itemValue)}
              style={styles.priorityPicker}
            >
              <Picker.Item label="Low " value="low" />
              <Picker.Item label="Normal " value="normal" />
              <Picker.Item label="Urgent " value="Urgent" />
            </Picker>
          </View>
        </View>
      </Modal>

      <Modal
        visible={selectDateModalVisible}
        animationType="slide"
        transparent={true} // This makes the modal background transparent
      >
        <View style={styles.datePickerModalContainer}>
          <View style={styles.datePickerModalContent}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => setSelectDateModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.calendarContainer}>
              <Calendar onDayPress={handleDayPress} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={editEventModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
        <View style={styles.editModal}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={closeEditEventModal}
          >
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={handleDeleteEvent}
          >
            <MaterialIcons name="delete" size={24} color="#000" />
          </TouchableOpacity>
          </View>
          <Text style={styles.modalTitle}>Edit Event</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={eventTitle}
            onChangeText={(text) => setEventTitle(text)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            numberOfLines={3}
            value={eventDescription}
            onChangeText={setEventDescription}
            textAlignVertical="top" // This prop does not exist in React Native, use style workaround
          />
          <View>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.timeStyle}
            >
              <Text
                style={styles.inputTime}
              >{`${eventHour}:${eventMinute} ${eventAmPm}`}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
            )}
          </View>
          <Picker
            selectedValue={selectedPriority}
            onValueChange={(itemValue) => setSelectedPriority(itemValue)}
            style={styles.priorityPicker}
          >
            <Picker.Item label="Low " value="low" />
            <Picker.Item label="Normal " value="normal" />
            <Picker.Item label="Urgent " value="Urgent" />
          </Picker>
          <View style={styles.editButtonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleEditEvent}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={viewListVisible} animationType="slide">
        <View style={styles.modalSummary}>
          <Text style={styles.modalTitle}>Summary of Events</Text>
          <ScrollView style={styles.summaryContainer}>
            {Object.keys(groupedEvents).map((date, index) => (
              <View key={index}>
                <Text style={styles.eventDate}>{formatDate(date)}</Text>
                {groupedEvents[date].map((event, eventIndex) => (
                  <View key={eventIndex} style={styles.eventItem}>
                    <Text style={styles.eventTime}>{event.time}</Text>
                    <Text style={styles.eventTitle}>
                      {event.title || "No title"}
                    </Text>
                    <Text style={styles.eventDescription}>
                      {event.description || "Calendar event"}
                    </Text>
                    <Text
                      style={[
                        styles.eventPriority,
                        { color: getPriorityColor(event.priority) },
                      ]}
                    >
                      {event.priority}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeList}
            onPress={() => setViewListVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#777",
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#00B486",
    justifyContent: "center",
    alignItems: "center",
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 55,
  },
  selectedDay: {
    width: 45,
    height: 45,
    backgroundColor: "#ddd",
    borderRadius: 15,
  },
  today: {
    backgroundColor: "#f0f8ff",
    width: 45,
    height: 45,
    borderRadius: 15,
  },
  dayText: {
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  eventContainer: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventTitle: {
    fontSize: 16,
  },
  eventDescription: {
    fontSize: 14,
    color: "#555",
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    top: 8,
    right: 8,
  },
  modalContainer: {
    top: 130,
    flex: 1,
    padding: 16,
  },
  modalSummary: {
    top: 30,
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  picker: {
    flex: 1,
  },
  priorityButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  priorityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  saveIcon: {
    bottom: 110,
  },
  closeIcon: {
    bottom: 110,
  },
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editModal: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  saveButton: {
    top: 200,
    backgroundColor: "#00B486",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteIcon: {
    bottom: 110,
  },
  deleteButton: {
    top: 100,
    backgroundColor: "#FE5A1D",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedDateContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedDateText: {
    fontSize: 16,
    textAlign: "center",
  },
  moreEventsIndicator: {
    marginLeft: 1,
    fontSize: 12,
  },
  datePickerModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerModalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  closeIconContainer: {
    bottom: 110,
  },
  closeList: {
    bottom: 757,
    padding: 8,
    width: 130,
    left: 320,
  },
  calendarContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  priorityPicker: {
    left: 100,
    width: 195,
  },
  sortIconContainer: {
    height: 35,
    paddingHorizontal: 10,
    left: 340,
  },
  iconClock: {
    fontSize: 29,
  },
  iconPriority: {
    fontSize: 24,
  },
  viewListButton: {
    position: "absolute",
    left: 20,
    backgroundColor: "#00B486",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewListButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    bottom: 300,
  },
  eventDate: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FCFCFC",
    elevation: 3,
    shadowColor: "black",
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  eventItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#FCFCFC",
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "black",
    elevation: 3,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  eventPriority: {
    fontSize: 14,
    fontWeight: "bold",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
  },
  cancelButtonText: {
    color: "#fff",
  },
  timeStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    width: "100%",
  },
  inputTime: {
    fontSize: 16,
    color: "#333",
  },
});

export default ToDo;
