import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {api} from '../../services';

interface Todos {
    name?: string;
    priority: 'high' | 'medium' | 'low';
    state: 'done' | 'undone';
    doneDate?: Date;
    dueDate?: Date;
    id: string;
}

export interface TodosState {
    loading: boolean;
    todos: Todos[];
    error?: string;
}

const initialState: TodosState = {
    loading: false,
    todos: [],
    error: undefined,
};

// Generates pending, fulfilled and rejected action types
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const res = await api.get('/todos');
    return res.data;
});

export const setAsDone = createAsyncThunk('todos/setAsDone', async (id: string) => {
    const res = await api.post(`/todos/${id}/done`);
    return res.data;
});

export const setAsUndone = createAsyncThunk('todos/setAsUndone', async (id: string) => {
    const res = await api.put(`/todos/${id}/undone`);
    return res.data;
});

const todosSlice = createSlice({
    name: 'todo',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchTodos.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = action.payload;
            state.error = '';
        });
        builder.addCase(fetchTodos.rejected, (state, action) => {
            state.loading = false;
            state.todos = [];
            state.error = action.error.message;
        });
        builder.addCase(setAsDone.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(setAsDone.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = state.todos.map(todo => {
                if(todo.id === action.payload.id) {
                    return action.payload;
                }
                return todo;
            });
            state.error = '';
        });
        builder.addCase(setAsDone.rejected, (state, action) => {
            state.loading = false;
            state.todos = [...state.todos];
            state.error = action.error.message;
        });
        builder.addCase(setAsUndone.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(setAsUndone.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = state.todos.map(todo => {
                if(todo.id === action.payload.id) {
                    return action.payload;
                }
                return todo;
            });
            state.error = '';
        });
        builder.addCase(setAsUndone.rejected, (state, action) => {
            state.loading = false;
            state.todos = [...state.todos];
            state.error = action.error.message;
        });
    },
    reducers: {},
});

export const todosReducer = todosSlice.reducer;