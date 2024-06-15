import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchLaunches = createAsyncThunk('launches/fetchLaunches', async () => {
  const response = await fetch('https://api.spacexdata.com/v3/launches');
  return await response.json()
});

const launchSlice = createSlice({
  name: 'launches',
  initialState: {
    launches: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.launches = action.payload;
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default launchSlice.reducer;
