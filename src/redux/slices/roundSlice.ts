import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type userId = string;

export interface RoundState {
  leader: userId; // 원정대장
  team: userId[]; // 원정대 후보 멤버
  missionTeam: Record<string, string>;
  election: number; // 몇 번째 선출인지
  mission_success: userId[]; // 미션 성공 제출한 사람들
  mission_fail: userId[]; // 미션 실패 제출한 사람들
  vote: { [userId: string]: string };
  stage: "nomination" | "vote" | "mission";
}

const initialState: RoundState = {
  leader: "",
  team: [],
  missionTeam: {},
  election: 1,
  mission_success: [],
  mission_fail: [],
  vote: {},
  stage: "nomination",
};

const roundSlice = createSlice({
  name: "round",
  initialState,
  reducers: {
    setLeader: (state, action: PayloadAction<userId>) => {
      state.leader = action.payload;
    },
    setElection: (state, action: PayloadAction<number>) => {
      state.election = action.payload;
    },
    addMissionSuccess: (state, action: PayloadAction<userId>) => {
      state.mission_success.push(action.payload);
    },
    setMissionSuccess: (state, action: PayloadAction<userId[]>) => {
      state.mission_success = action.payload;
    },
    addMissionFail: (state, action: PayloadAction<userId>) => {
      state.mission_fail.push(action.payload);
    },
    setMissionFail: (state, action: PayloadAction<userId[]>) => {
      state.mission_fail = action.payload;
    },
    setTeam: (state, action: PayloadAction<userId[]>) => {
      state.team = Object.values(action.payload);
    },
    setMissionTeam: (state, action: PayloadAction<Record<string, string>>) => {
      state.missionTeam = action.payload;
    },
    setVote: (state, action: PayloadAction<{ [userId: string]: string }>) => {
      state.vote = action.payload;
    },
    setStage: (
      state,
      action: PayloadAction<"nomination" | "vote" | "mission">
    ) => {
      state.stage = action.payload;
    },
  },
});

export const {
  setLeader,
  setElection,
  addMissionSuccess,
  setMissionSuccess,
  addMissionFail,
  setMissionFail,
  setTeam,
  setMissionTeam,
  setVote,
  setStage,
} = roundSlice.actions;

export const selectLeader = (state: { round: RoundState }) =>
  state.round.leader;
export const selectElection = (state: { round: RoundState }) =>
  state.round.election;
export const selectMissionSuccess = (state: { round: RoundState }) =>
  state.round.mission_success;
export const selectMissionFail = (state: { round: RoundState }) =>
  state.round.mission_fail;
export const selectTeam = (state: { round: RoundState }) => state.round.team;
export const selectMissionTeam = (state: { round: RoundState }) =>
  state.round.missionTeam;
export const selectVote = (state: { round: RoundState }) => state.round.vote;
export const selectStage = (state: { round: RoundState }) => state.round.stage;
export default roundSlice.reducer;
