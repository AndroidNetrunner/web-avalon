import {
  selectGameId,
  selectPlayers,
  selectRoundFail,
  selectRoundSuccess,
} from "@/redux/slices/gameSlice";
import { Button, Card, Checkbox } from "antd";
import { ref, update } from "firebase/database";
import { useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../../firebase.config";
const numberOfNomination = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
};

export default function Nomination() {
  const players = useSelector(selectPlayers);
  const numberOfPlayers = players.length as 5 | 6 | 7 | 8 | 9 | 10;
  const gameId = useSelector(selectGameId);
  const numberOfTeam =
    numberOfNomination[numberOfPlayers][
      useSelector(selectRoundSuccess) + useSelector(selectRoundFail)
    ];
  const [team, setTeam] = useState<string[]>([]);
  const handleChange = (checkedValue: string[]) => {
    setTeam(checkedValue);
  };
  let vote: {
    [key: string]: "agree" | "disagree" | "";
  } = {};
  players.forEach((player) => {
    vote[player.userId] = "";
  });
  const handleSubmit = () => {
    const teamObject = team.reduce((obj: Record<string, string>, member) => {
      obj[member] = member;
      return obj;
    }, {});
    update(ref(database, "games/" + gameId), {
      "/team": teamObject,
      "/vote": vote,
      "/stage": "vote",
    });
  };
  return (
    <>
      <Card
        style={{ marginBottom: "1rem" }}
        title="원정대장님, 이제 원정대를 구성해야 합니다."
      >
        <p>이번 라운드의 원정대 인원은 {numberOfTeam}명입니다.</p>
        <p>아래 체크박스를 눌러 원정대를 구성해주세요.</p>
      </Card>
      <Checkbox.Group onChange={handleChange}>
        {players.map((player) => (
          <Checkbox key={player.userId} value={player.userId}>
            {player.username}
          </Checkbox>
        ))}
      </Checkbox.Group>
      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={numberOfTeam !== team.length}
      >
        원정대 확정
      </Button>
    </>
  );
}
