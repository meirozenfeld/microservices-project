import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

export type User = {
    id: string;
    email: string;
    name?: string;
};

type AuthState = {
    user: User | null;
    accessToken: string | null;
    isAuthReady: boolean;
};

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthReady: false,
};


export const bootstrapAuth = createAsyncThunk(
    "auth/bootstrap",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.refresh();
            return response.data.accessToken;
        } catch (err) {
            // אם אין refresh token או שהוא לא תקין, זה בסדר - נציג login
            return rejectWithValue(null);
        }
    }
);



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action) {
            state.accessToken = action.payload;
            state.isAuthReady = true;
        }
        ,
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        setAuthReady(state, action: PayloadAction<boolean>) {
            state.isAuthReady = action.payload;
        },
        clearAuth(state) {
            state.user = null;
            state.accessToken = null;
            state.isAuthReady = true;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(bootstrapAuth.fulfilled, (state, action) => {
                state.accessToken = action.payload;
                state.isAuthReady = true;
            })
            .addCase(bootstrapAuth.rejected, (state) => {
                state.isAuthReady = true;
            });
    },

});

export const {
    setAccessToken,
    setUser,
    setAuthReady,
    clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
