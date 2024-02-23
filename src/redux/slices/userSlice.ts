import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string;
  userName: string;
}

const initialState: UserState = {
  userId: "",
  userName: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    resetUser: () => {
      return initialState;
    },
  },
});

export const { setUserId, setUserName, resetUser } = userSlice.actions;

export const selectUserId = (state: { user: UserState }) => state.user.userId;
export const selectUserName = (state: { user: UserState }) =>
  state.user.userName;

export default userSlice.reducer;
