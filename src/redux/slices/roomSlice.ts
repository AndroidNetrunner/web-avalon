import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type userId = string;

interface RoomState {
  owner_id: userId;
  participants: Participant[];
  invitationCode: string;
}

const initialState: RoomState = {
  owner_id: "",
  participants: [],
  invitationCode: "",
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setOwnerId: (state, action: PayloadAction<userId>) => {
      state.owner_id = action.payload;
    },
    addParticipant: (state, action: PayloadAction<User>) => {
      state.participants.push(action.payload);
    },
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    setInvitationCode: (state, action: PayloadAction<string>) => {
      state.invitationCode = action.payload;
    },
    resetRoom: () => {
      return initialState;
    },
  },
});

export const {
  setOwnerId,
  addParticipant,
  setParticipants,
  setInvitationCode,
  resetRoom,
} = roomSlice.actions;

export const selectOwnerId = (state: { room: RoomState }) =>
  state.room.owner_id;
export const selectParticipants = (state: { room: RoomState }) =>
  state.room.participants;
export const selectInvitationCode = (state: { room: RoomState }) =>
  state.room.invitationCode;

export default roomSlice.reducer;
