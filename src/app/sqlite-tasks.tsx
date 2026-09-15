import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

type Task = { id: number; title: string };

export default function SqliteTasks() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const setup = async () => {
    db = await SQLite.openDatabaseAsync('tasks.db');
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL);`
    );
    loadTasks();
  };

  const loadTasks = async () => {
    const result = await db.getAllAsync<Task>('SELECT * FROM tasks;');
    setTasks(result);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await db.runAsync('INSERT INTO tasks (title) VALUES (?);', title);
    setTitle('');
    loadTasks();
  };

  const updateTask = async () => {
    if (!title.trim() || editingId === null) return;
    await db.runAsync('UPDATE tasks SET title = ? WHERE id = ?;', title, editingId);
    setTitle('');
    setEditingId(null);
    loadTasks();
  };

  const deleteTask = async (id: number) => {
    await db.runAsync('DELETE FROM tasks WHERE id = ?;', id);
    loadTasks();
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
  };

  useEffect(() => { setup(); }, []);

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