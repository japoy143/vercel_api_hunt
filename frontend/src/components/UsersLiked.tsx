import { useSelector } from "react-redux";
import { avatarType } from "../types";
import { RootState } from "../redux/store";

type UsersLikedProps = {
  Id: string;
};

const Img: avatarType[] = [
  { img: "/avatar/avatar_man1.svg" },
  { img: "/avatar/avatar_man2.svg" },
  { img: "/avatar/avatar_man3.svg" },
  { img: "/avatar/avatar_girl1.svg" },
  { img: "/avatar/avatar_girl2.svg" },
  { img: "/avatar/avatar_girl3.svg" },
];

function UsersLiked({ Id }: UsersLikedProps) {
  const data = useSelector((state: RootState) => state.api.data);
  const getLikes = data
    .filter((api) => api._id === Id)
    .map((likes) => likes.likes)
    .flat();

  const formatUserName = (name: string) => {
    const splitName = name.split("@");
    const formattedName = splitName[0];

    return formattedName;
  };

  return (
    <>
      {getLikes.length === 0 ? (
        <div className="flex h-full w-full flex-row items-center">
          <p className="font-poppins text-xs">No users like at the moment</p>
        </div>
      ) : (
        getLikes.map((like, index) => (
          <div
            key={index}
            className="flex h-10 w-20 flex-row items-center space-x-2 font-poppins"
          >
            <img
              src={
                like.avatar === null
                  ? "/icons/avatar.svg"
                  : Img[like.avatar].img
              }
              className="h-8"
              alt=""
            />
            <p className="text-center text-sm">{formatUserName(like.email)}</p>
          </div>
        ))
      )}
    </>
  );
}

export default UsersLiked;
