import { useDispatch } from "react-redux";
import { changeAvatar } from "../redux/AuthSlice";
import { avatarType } from "../types";

type ChangeAvatarProps = {
  avatars: avatarType[];
  setAvatar: (value: number) => void;
  updateAvatar: (val: number) => Promise<void>;
};

function ChangeAvatar({ avatars, setAvatar, updateAvatar }: ChangeAvatarProps) {
  const dispatch = useDispatch();
  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-3 py-1">
      <p className="col-span-3 text-center font-poppins text-sm">
        Change Avatar
      </p>

      {avatars.map((profile, index) => (
        <div className="flex flex-row items-center justify-center" key={index}>
          <img
            src={profile.img}
            className="h-8 w-8 rounded-full"
            onClick={async () => {
              setAvatar(index);
              updateAvatar(index);
              dispatch(changeAvatar(index));
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ChangeAvatar;
