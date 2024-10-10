import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import MiscPageWrapper from '@/hoc/MiscPageWrapper';
import { CustomNotification, getNotifications, markAsRead } from '@/data/notifications-data';

const NotificaionPage = () => {
  const [notifications, setNotifications] = useState<CustomNotification[]>(getNotifications());

  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  const handleNotificationPress = (id: string) => {
    markAsRead(id); // Mark notification as read
    setNotifications(getNotifications()); // Update the notifications state
  };

  const renderNotification = ({ item }: { item: CustomNotification }) => (
    <View style={[styles.notificationItem, item.read && styles.read]}>
      <Text style={styles.notificationTitle}>{item.type.toUpperCase()}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTimestamp}>{item.timestamp.toLocaleString()}</Text>
      <TouchableOpacity onPress={() => handleNotificationPress(item.id)}>
        <Text style={styles.notificationAction}>Mark as Read</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  read: {
    backgroundColor: '#f0f0f0',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    marginVertical: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  notificationAction: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 8,
  },
});

export default MiscPageWrapper(NotificaionPage, "Notifications", "/");
