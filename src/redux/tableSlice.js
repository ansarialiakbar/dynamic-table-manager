import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, role: 'Designer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 40, role: 'Manager' },
  ],
  columns: {
    name: { visible: true, label: 'Name' },
    email: { visible: true, label: 'Email' },
    age: { visible: true, label: 'Age' },
    role: { visible: true, label: 'Role' },
  },
  theme: 'light',
  editingRow: null,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    addData: (state, action) => {
      state.data = [...state.data, ...action.payload];
    },
    updateColumns: (state, action) => {
      state.columns = action.payload;
      localStorage.setItem('columns', JSON.stringify(action.payload));
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setEditingRow: (state, action) => {
      state.editingRow = action.payload;
    },
    updateRow: (state, action) => {
      const { id, updatedRow } = action.payload;
      state.data = state.data.map((row) => (row.id === id ? { ...row, ...updatedRow } : row));
      state.editingRow = null;
    },
    deleteRow: (state, action) => {
      state.data = state.data.filter((row) => row.id !== action.payload);
    },
  },
});

export const { addData, updateColumns, toggleTheme, setEditingRow, updateRow, deleteRow } = tableSlice.actions;
export default tableSlice.reducer;