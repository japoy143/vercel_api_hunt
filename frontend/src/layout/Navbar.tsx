import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { logout, sessionTimeoutUpdate } from "../redux/AuthSlice";
import { toast } from "sonner";
import { useState } from "react";
import ChangeAvatar from "../components/ChangeAvatar";
import Menu from "../components/Menu";
import { avatarType } from "../types";
import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

//Update url
const Update_Url = "/Users/";

const Img: avatarType[] = [
  { img: "/avatar/avatar_man1.svg" },
  { img: "/avatar/avatar_man2.svg" },
  { img: "/avatar/avatar_man3.svg" },
  { img: "/avatar/avatar_girl1.svg" },
  { img: "/avatar/avatar_girl2.svg" },
  { img: "/avatar/avatar_girl3.svg" },
];
function Navbar() {
  //generate new accessToken
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  //button states
  const [avatar, setAvatar] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);

  //user details
  const user = useSelector((state: RootState) => state.auth.isLogin);
  const userEmail = useSelector((state: RootState) => state.auth.email);
  const userId = useSelector((state: RootState) => state.auth.id);
  const userAvatar = useSelector((state: RootState) => state.auth.avatar);
  const userAccessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );

  const [profileAvatar, setProfileAvatar] = useState<number | null>(userAvatar);
  const name = userEmail.split("@");
  const dispatch = useDispatch();

  const onHandleLogout = async () => {
    dispatch(logout(), sessionTimeoutUpdate(true));

    //handle backend logout request
    try {
      const res = await axiosPrivate.get("/Users/Logout", {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log("Logout successfully");
      }
    } catch (error) {
      console.log(error);
    }
    toast.success("Logout Successfully");
  };

  const onHandleChangeAvatar = async (val: number) => {
    try {
      const res = await axios.patch(`${Update_Url}${userId}`, {
        avatar: val,
      });
      if (res.status === 200) {
        toast.success("Avatar Changed");
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Change Avatar Error");
      setProfileAvatar(null);
    }
  };

  return (
    <nav className="flex w-screen flex-row items-center justify-between p-4 shadow-md">
      {user ? (
        <div className="flex max-w-44 flex-row items-center space-x-4 text-ellipsis font-poppins">
          <div
            className="relative flex flex-row items-center justify-center rounded-full bg-slate-200 xs:h-6 xs:w-6 md:h-10 md:w-10"
            onClick={() => setAvatar((prev) => !prev)}
          >
            <img
              src={
                profileAvatar === null
                  ? "/icons/avatar.svg"
                  : Img[profileAvatar].img
              }
              className="h-full w-full"
            />

            <img
              src="/icons/change.svg"
              className="absolute h-4 w-4 xs:left-4 xs:top-0 md:left-8 md:top-1"
            />

            {avatar && (
              <div className="h-26 absolute left-0 top-16 w-[200px] rounded-md bg-bgwhite">
                <ChangeAvatar
                  avatars={Img}
                  setAvatar={(val) => setProfileAvatar(val)}
                  updateAvatar={(val) => onHandleChangeAvatar(val)}
                />
              </div>
            )}
          </div>
          <p className="xs:text-xs md:text-base">{name[0]}</p>
        </div>
      ) : (
        <div className="xs:w-16 sm:w-44 md:w-44"></div>
      )}
      <div className="flex flex-row items-center space-x-4">
        <img src="/icons/confetti.svg" className="h-4 w-4 -rotate-90" />
        <p className="font-poppins text-2xl font-medium">API Hunt </p>
        <img src="/icons/confetti.svg" className="h-4 w-4" />
      </div>

      <div className="xs:hidden sm:flex">
        {user ? (
          <button
            className="h-8 w-20 cursor-pointer rounded bg-buttonColor font-poppins text-white"
            onClick={onHandleLogout}
          >
            Logout
          </button>
        ) : (
          <div className="flex w-44 flex-row justify-end space-x-2 bg-none">
            <button
              className="h-8 w-20 cursor-pointer rounded bg-buttonColor font-poppins text-white"
              onClick={() => navigate("/LogIn")}
            >
              Login
            </button>
          </div>
        )}
      </div>
      <div className={`relative sm:hidden md:hidden lg:hidden`}>
        {user ? (
          <div className="flex w-20 flex-row justify-center bg-none">
            <button onClick={onHandleLogout}>
              <img src="/icons/logout.svg" className="h-6 w-6 ease-out" />
            </button>
          </div>
        ) : (
          <button onClick={() => setMenu((prev) => !prev)}>
            <img
              src={menu ? "/icons/close.svg" : "/icons/menu.svg"}
              className="h-6 w-6 ease-out"
            />
          </button>
        )}

        <div
          className={
            menu
              ? "absolute right-0 top-14 flex h-24 w-28 flex-col justify-center space-y-2 rounded bg-bgwhite px-2"
              : "hidden"
          }
        >
          <Menu
            signUp={(to, options) => navigate(to, options)}
            logIn={(to, options) => navigate(to, options)}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
