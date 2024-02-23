import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResultState {
  mission: boolean;
  vote: boolean;
}

const initialState: ResultState = {
  mission: false,
  vote: false,
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setMission: (state, action: PayloadAction<boolean>) => {
      state.mission = action.payload;
    },
    setVote: (state, action: PayloadAction<boolean>) => {
      state.vote = action.payload;
    },
  },
});

export const selectMission = (state: { result: ResultState }) =>
  state.result.mission;
export const selectVote = (state: { result: ResultState }) => state.result.vote;

export const { setMission, setVote } = resultSlice.actions;
export default resultSlice.reducer;
