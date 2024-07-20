import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { updateAccessTokenOnly } from "../redux/AuthSlice";

function useRefreshToken() {
  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await axios.get("/Users/Refresh", {
      withCredentials: true,
    });

    dispatch(updateAccessTokenOnly(response.data.accessToken));
    console.log(response.data.accessToken);
    return response.data.accessToken;
  };

  return refresh;
}

export default useRefreshToken;
