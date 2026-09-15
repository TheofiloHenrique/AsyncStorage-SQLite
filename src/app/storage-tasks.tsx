import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tasks';

type Task = { id: number; title: string };

export default function StorageTasks() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadTasks = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    setTasks(stored ? JSON.parse(stored) : []);
  };

  const saveTasks = async (newTasks: Task[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    const newTask: Task = { id: Date.now(), title };
    await saveTasks([...tasks, newTask]);
    setTitle('');
  };

  const updateTask = async () => {
    if (!title.trim() || editingId === null) return;
    const updated = tasks.map((t) =>
      t.id === editingId ? { ...t, title } : t
    );
    await saveTasks(updated);
    setTitle('');
    setEditingId(null);
  };

  const deleteTask = async (id: number) => {
    const filtered = tasks.filter((t) => t.id !== id);
    await saveTasks(filtered);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
  };

  useEffect(() => { loadTasks(); }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Button
        title={editingId === null ? 'Add' : 'Save'}
        onPress={editingId === null ? addTask : updateTask}
      />
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
            <Text>{item.title}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button title="Edit" onPress={() => startEdit(item)} />
              <Button title="Delete" onPress={() => deleteTask(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}