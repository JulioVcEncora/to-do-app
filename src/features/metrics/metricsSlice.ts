import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../../services';

export interface Metrics {
    generalAverageTime: number;
    lowAverageTime: number;
    highAverageTime: number;
    mediumAverageTime: number;
}

export interface MetricsState {
    loading: boolean;
    metrics: Metrics;
    error?: string;
}

const initialState: MetricsState = {
    loading: false,
    metrics: {
        lowAverageTime: 0,
        generalAverageTime: 0,
        highAverageTime: 0,
        mediumAverageTime: 0,
    },
    error: undefined,
};

export const fetchMetrics = createAsyncThunk('todos/metrics', async () => {
    const res = await api.get('/todos/metrics');
    return res.data;
})

const metricsSlice = createSlice({
    name: 'metrics',
    initialState,
    extraReducers: (builder) => {
        // fetch metrics
        builder.addCase(fetchMetrics.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchMetrics.fulfilled, (state, action) => {
            state.loading = false;
            state.metrics = action.payload;
            state.error = '';
        });
        builder.addCase(fetchMetrics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        
    },
    reducers: {},
});

export const metricsReducer = metricsSlice.reducer;