import { GOOD_ROLES } from "@/constants/roles";
import winDescriptions, {
  WinDescription as WinDescriptionType,
} from "@/constants/winDescsriptions";
import { Player } from "@/interfaces/Player";
import { resetGame, selectPlayers } from "@/redux/slices/gameSlice";
import { resetRoom } from "@/redux/slices/roomSlice";
import { selectLeader } from "@/redux/slices/roundSlice";
import { resetUser, selectUserId } from "@/redux/slices/userSlice";
import { Button, Table } from "antd";
import Title from "antd/es/typography/Title";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

interface FinalResultProps {
  description: WinDescriptionType;
}

const renderRole = (role: string) => {
  const color = GOOD_ROLES.includes(role) ? "blue" : "red";
  return <StyledSpan color={color}>{role}</StyledSpan>;
};

const columns = [
  {
    title: "닉네임",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "역할",
    dataIndex: "role",
    key: "role",
    render: renderRole,
  },
];

export default function FinalResult({ description }: FinalResultProps) {
  const players = useSelector(selectPlayers);
  const goodWin = winDescriptions[description];
  const dispatch = useDispatch();
  const leader = useSelector(selectLeader);
  const myUserId = useSelector(selectUserId);
  const isLeader = leader === myUserId;
  useGameEndAnalytics(goodWin, isLeader);
  const handlePlayAgain = () => {
    localStorage.removeItem("gameId");
    dispatch(resetGame());
  };
  const handleExit = () => {
    localStorage.removeItem("userId");
    dispatch(resetRoom());
    dispatch(resetUser());
  };
  return (
    <>
      <GameStatus goodWin={goodWin} />
      <WinDescription description={description} />
      <PlayerTable players={players} />
      <StyledDiv>
        <Button type="primary" onClick={handlePlayAgain}>
          한 번 더!
        </Button>
        <Button type="primary" onClick={handleExit} danger>
          처음으로
        </Button>
      </StyledDiv>
    </>
  );
}

const StyledDiv = styled("div")`
  display: flex;
  justify-content: center;
  gap: 3rem;
`;

const StyledSpan = styled("span")<{ color: string }>`
  color: ${(props) => props.color};
  font-weight: bold;
`;

const useGameEndAnalytics = (goodWin: boolean, isLeader: boolean) => {
  useEffect(() => {
    const analytics = getAnalytics();
    if (isLeader) {
      logEvent(analytics, "gameEnd", {
        isGoodWin: goodWin,
      });
    }
  }, [goodWin, isLeader]);
};

const GameStatus = ({ goodWin }: { goodWin: boolean }) => {
  return (
    <Title level={4} style={{ color: goodWin ? "blue" : "red" }}>
      {goodWin ? "선의 세력 승리" : "악의 하수인 승리"}
    </Title>
  );
};

const WinDescription = ({
  description,
}: {
  description: WinDescriptionType;
}) => <Title level={5}>{description}</Title>;

const PlayerTable = ({ players }: { players: Player[] }) => (
  <Table
    style={{ marginBottom: "1rem" }}
    columns={columns}
    pagination={false}
    dataSource={players}
  />
);
