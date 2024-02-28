import { WinDescription } from "@/constants/winDescsriptions";
import { Player, Role } from "@/interfaces/Player";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  gameId: string;
  players: Player[];
  roundSuccess: number;
  roundFail: number;
  description: WinDescription | null;
}

const initialState: GameState = {
  gameId: "",
  roundSuccess: 0,
  players: [],
  roundFail: 0,
  description: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameId: (state, action: PayloadAction<string>) => {
      state.gameId = action.payload;
    },
    setPlayers: (state, action: PayloadAction<Object>) => {
      const players: Player[] = [];
      Object.values(action.payload).forEach(
        (player: { role: Role; userId: string; username: string }) => {
          players.push({
            ...player,
            gameId: state.gameId,
          });
        }
      );
      state.players = players;
    },
    setRoundSuccess: (state, action: PayloadAction<number>) => {
      state.roundSuccess = action.payload;
    },
    setRoundFail: (state, action: PayloadAction<number>) => {
      state.roundFail = action.payload;
    },
    setDescription: (state, action: PayloadAction<WinDescription>) => {
      state.description = action.payload;
    },
    resetGame: () => {
      return initialState;
    },
  },
});

export const {
  setGameId,
  setPlayers,
  setRoundSuccess,
  setRoundFail,
  setDescription,
  resetGame,
} = gameSlice.actions;

export const selectGameId = (state: { game: GameState }) => state.game.gameId;
export const selectPlayers = (state: { game: GameState }) => state.game.players;
export const selectRoundSuccess = (state: { game: GameState }) =>
  state.game.roundSuccess;
export const selectRoundFail = (state: { game: GameState }) =>
  state.game.roundFail;
export const selectDescription = (state: { game: GameState }) =>
  state.game.description;
export default gameSlice.reducer;
