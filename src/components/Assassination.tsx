import { selectGameId, selectPlayers } from "@/redux/slices/gameSlice";
import { Button, Card, Radio, RadioChangeEvent } from "antd";
import { ref, update } from "firebase/database";
import { useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../../firebase.config";
import { Player } from "@/interfaces/Player";

const TARGET_ROLES = ["멀린", "퍼시발", "오베론", "선의 세력"];
interface Options {
  label: string;
  value: string;
}

interface AssassinationViewProps {
  options: Options[];
  onChange: (e: RadioChangeEvent) => void;
  handleAssassin: () => void;
}

export default function Assassination() {
  const players: Player[] = useSelector(selectPlayers);
  const candidates: Player[] = players.filter((player) =>
    TARGET_ROLES.includes(player.role)
  );
  const options: Options[] = candidates.map((player) => ({
    label: player.username,
    value: player.userId,
  }));
  const gameId = useSelector(selectGameId);
  const [target, setTarget] = useState("");
  const onChange = (e: RadioChangeEvent) => {
    setTarget(e.target.value);
  };
  const handleAssassin = async () => {
    const isMerlin =
      players.find((player) => player.userId === target)?.role === "멀린";
    try {
      await update(ref(database, "games/" + gameId), {
        "/description": isMerlin
          ? "암살 성공으로 인한 악의 하수인 승리"
          : "미션 3번 성공 및 암살 실패로 인한 선의 세력 승리",
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  return (
    <AssassinationView
      options={options}
      onChange={onChange}
      handleAssassin={handleAssassin}
    />
  );
}

function AssassinationView({
  options,
  onChange,
  handleAssassin,
}: AssassinationViewProps) {
  return (
    <>
      <Card
        style={{ marginBottom: "1rem" }}
        title={"암살자는 단 한 번, 멀린 암살을 시도합니다."}
      >
        <p>멀린을 암살하면 악의 하수인이 역전승합니다.</p>
        <p>아래 버튼을 이용해 암살대상을 한 명 골라주세요.</p>
      </Card>
      <Radio.Group options={options} onChange={onChange} />
      <Button type="primary" onClick={handleAssassin}>
        암살
      </Button>
    </>
  );
}
