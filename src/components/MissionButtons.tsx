import { useMission } from "@/hooks/useMission";
import { Button } from "antd";
import styled from "styled-components";

const MISSION_SUCCESS = "success";
const MISSION_FAIL = "fail";

export default function MissionButtons({ amEvil }: { amEvil: boolean }) {
  const { handleMission } = useMission();
  return (
    <StyledDiv>
      <Button type="primary" onClick={() => handleMission(MISSION_SUCCESS)}>
        미션 성공
      </Button>
      <Button
        type="primary"
        onClick={() => handleMission(MISSION_FAIL)}
        disabled={!amEvil}
        danger
      >
        미션 실패
      </Button>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
`;
