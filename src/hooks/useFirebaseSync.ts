import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase.config";
import {
  selectGameId,
  selectPlayers,
  setDescription,
  setPlayers,
  setRoundFail,
  setRoundSuccess,
} from "@/redux/slices/gameSlice";
import {
  setElection,
  setLeader,
  setMissionTeam,
  setStage,
  setTeam,
  setVote,
} from "@/redux/slices/roundSlice";
import { DocumentData } from "firebase/firestore";
import { Player } from "@/interfaces/Player";

const isSamePlayersWithFirebaseStore = (
  data: DocumentData,
  original: Player[]
) => {
  let convertedOriginal: { [userId: string]: Player } = {};
  original.forEach((player) => {
    convertedOriginal[player.userId] = { ...player, gameId: data.gameId };
  });
  if (data)
    return JSON.stringify(data.players) === JSON.stringify(convertedOriginal);
};

const useFirebaseSync = () => {
  const players = useSelector(selectPlayers);
  const gameId = useSelector(selectGameId);
  const gameRef = ref(database, "games/" + gameId);

  const dispatch = useDispatch();
  useEffect(() => {
    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (typeof data !== "object") return;
        if ("players" in data && !isSamePlayersWithFirebaseStore(data, players))
          dispatch(setPlayers(data.players));
        if ("leader" in data) dispatch(setLeader(data.leader));
        dispatch(setTeam(data.team || []));
        dispatch(setVote(data.vote || []));
        dispatch(setMissionTeam(data.missionTeam || {}));
        if ("election" in data) dispatch(setElection(data.election));
        if ("roundSuccess" in data)
          dispatch(setRoundSuccess(data.roundSuccess));
        if ("roundFail" in data) dispatch(setRoundFail(data.roundFail));
        if ("mission" in data) dispatch(setMissionTeam(data.mission));
        if ("stage" in data) dispatch(setStage(data.stage));
        if ("description" in data) dispatch(setDescription(data.description));
      }
    });
  }, [gameRef, dispatch, players]);
};

export default useFirebaseSync;
