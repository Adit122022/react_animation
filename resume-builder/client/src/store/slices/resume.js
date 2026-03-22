import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/resumes";

const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const initialState = {
  resumes: [],
  currentResume: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Create new resume
export const createResume = createAsyncThunk(
  "resume/createResume",
  async (resumeData, thunkAPI) => {
    try {
      const response = await axios.post(
        API_URL,
        resumeData,
        getAuthHeaders(thunkAPI),
      );
      return response.data.resume;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get user resumes
export const getResumes = createAsyncThunk(
  "resume/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders(thunkAPI));
      return response.data.resumes;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get single resume
export const getResume = createAsyncThunk(
  "resume/getOne",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/${id}`,
        getAuthHeaders(thunkAPI),
      );
      return response.data.resume;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Update resume
export const updateResume = createAsyncThunk(
  "resume/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        data,
        getAuthHeaders(thunkAPI),
      );
      return response.data.resume;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Delete resume
export const deleteResume = createAsyncThunk(
  "resume/delete",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthHeaders(thunkAPI),
      );
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Duplicate resume
export const duplicateResume = createAsyncThunk(
  "resume/duplicate",
  async (id, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/${id}/duplicate`,
        {},
        getAuthHeaders(thunkAPI),
      );
      return response.data.resume;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createResume
      .addCase(createResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // The API might return the created resume object with a structure, assume action.payload is the resume
        // or action.payload.data depending on backend structure. usually action.payload directly for MERN API returning JSON directly.
        // Assuming action.payload is the resume object
        // Or if it's nested: action.payload.resume, wait let's just push what we get assuming it's the resume object.
        state.resumes.push(action.payload);
      })
      .addCase(createResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // getResumes
      .addCase(getResumes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resumes = action.payload || [];
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // getResume
      .addCase(getResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentResume = action.payload;
      })
      .addCase(getResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // updateResume
      .addCase(updateResume.pending, (state) => {
        // Usually we dont set isLoading=true for silent auto saves, but keeping basic structure
        // state.isLoading = true;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentResume = action.payload;
        // also update it in the list
        const index = state.resumes.findIndex(
          (r) => r._id === action.payload._id,
        );
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // deleteResume
      .addCase(deleteResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resumes = state.resumes.filter(
          (resume) => resume._id !== action.payload,
        );
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // duplicateResume
      .addCase(duplicateResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(duplicateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resumes.push(action.payload);
      })
      .addCase(duplicateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;
