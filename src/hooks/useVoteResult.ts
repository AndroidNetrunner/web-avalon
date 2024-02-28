import { setVote } from "@/redux/slices/resultSlice";
import { useDispatch } from "react-redux";

export default function useVoteResult() {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setVote(false));
  };

  return { handleClose };
}
