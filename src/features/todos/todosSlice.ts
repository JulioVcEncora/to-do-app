import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../../services';

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
    currentPage: number;
    totalPages: number;
    totalElements: number;
    filtering?: Pick<Todos, 'name' | 'dueDate'> & {priority?: Todos['priority']; state?: Todos['state']};
    error?: string;
}

const initialState: TodosState = {
    loading: false,
    todos: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    filtering: undefined,
    error: undefined,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (page: number) => {
    if(page !== undefined) {
        const res = await api.get('/todos', {params: { page }});
        return res.data;
    } else {
        const res = await api.get('/todos');
        return res.data;
    }
});

export const setAsDone = createAsyncThunk('todos/setAsDone', async (id: string) => {
    const res = await api.post(`/todos/${id}/done`);
    return res.data;
});

export const setAsUndone = createAsyncThunk('todos/setAsUndone', async (id: string) => {
    const res = await api.put(`/todos/${id}/undone`);
    return res.data;
});

export const postNewTodo = createAsyncThunk('todos/post', async (body: Omit<Todos, 'id'>) => {
    const res = await api.post('/todos', body);
    return res.data;
});

export const filterTodos = createAsyncThunk('todos/filterTodos', async (body: Omit<Todos, 'id'> & {page: number}) => {
    const res = await api.get('/todos', {params: body});
    return res.data;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async (body: Todos) => {
    const res = await api.put(`/todos/${body.id}`, body);
    return res.data;
});

export const fetchMetrics = createAsyncThunk('todos/metrics', async () => {
    const res = await api.get('/todos/metrics');
    return res.data;
})

const todosSlice = createSlice({
    name: 'todo',
    initialState,
    extraReducers: (builder) => {
        // fetching todos
        builder.addCase(fetchTodos.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = action.payload.content;
            state.currentPage = action.payload.number;
            state.totalPages = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;
            state.error = '';
        });
        builder.addCase(fetchTodos.rejected, (state, action) => {
            state.loading = false;
            state.todos = [];
            state.currentPage = 0;
            state.totalElements = 0;
            state.totalPages = 0;
            state.error = action.error.message;
        });
        // set a todo as done
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
        // set a todo as undone
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
        // create a new todo
        builder.addCase(postNewTodo.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(postNewTodo.fulfilled, (state, action) => {
            state.loading = false;
            // change to last page on todo creation
            if((state.totalElements + 1) / (10 * state.totalPages) > 1) {
                // when already on last page and new todo creates a new page
                // change to the next page
                if(state.currentPage === state.totalPages - 1) {
                    state.currentPage++;
                } else {
                    // else go to the last page
                    state.currentPage = state.totalPages - 1;
                }
                state.totalElements++;
                state.totalPages++;
            } else if(state.currentPage !== state.totalPages - 1) {
                state.currentPage = state.totalPages - 1;
            } else {
                state.todos.push(action.payload);
            }
            state.totalElements++;
            state.error = '';
        });
        builder.addCase(postNewTodo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // fetch todos with criteria
        builder.addCase(filterTodos.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(filterTodos.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = action.payload.content;
            state.currentPage = action.payload.number;
            state.totalPages = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;
            state.error = '';
        });
        builder.addCase(filterTodos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        // update todos
        builder.addCase(updateTodo.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateTodo.fulfilled, (state, action) => {
            state.loading = false;
            state.todos = state.todos.map(todo => {
                if(todo.id === action.payload.id) {
                    return action.payload;
                }
                return todo;
            });
            state.error = '';
        });
        builder.addCase(updateTodo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
    reducers: {
        setCurrentPage: (state, action: {payload: number}) => {
            state.currentPage = action.payload;
        },
        setFilters: (state, action: {payload: TodosState['filtering']}) => {
            state.filtering = action.payload;
        }
    },
});

export const {setCurrentPage, setFilters} = todosSlice.actions;

export const todosReducer = todosSlice.reducer;