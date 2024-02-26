import { Player } from "@/interfaces/Player";
import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectMissionTeam } from "@/redux/slices/roundSlice";
import { Card } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";

const getTeammateNames = (
  missionTeam: Record<string, string>,
  players: Player[]
) => {
  return Object.keys(missionTeam)
    .map((teammateId) => {
      return players.find((player) => player.userId === teammateId)?.username;
    })
    .join(", ");
};

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`;

export default function MissionCard() {
  const missionTeam = useSelector(selectMissionTeam);
  const players = useSelector(selectPlayers);
  const teammateNames = getTeammateNames(missionTeam, players);
  return (
    <StyledCard title="이제 미션을 수행할 차례입니다!">
      <p>원정대: {teammateNames}</p>
      <p>아래 버튼을 눌러 미션 성공, 실패 중 하나를 선택해주세요.</p>
    </StyledCard>
  );
}
