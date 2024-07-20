import { useSelector } from "react-redux";
import { commentType } from "../types";
import { avatarType } from "../types";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";

type commentSectionProps = {
  commentId: string;
};

const Img: avatarType[] = [
  { img: "/avatar/avatar_man1.svg" },
  { img: "/avatar/avatar_man2.svg" },
  { img: "/avatar/avatar_man3.svg" },
  { img: "/avatar/avatar_girl1.svg" },
  { img: "/avatar/avatar_girl2.svg" },
  { img: "/avatar/avatar_girl3.svg" },
];

const removeEmailSign = (email: string) => {
  const sign = email.split("@");

  const removeEmail = sign[0];

  return removeEmail;
};

function CommentsSection({ commentId }: commentSectionProps) {
  const data = useSelector((state: RootState) => state.api.data);
  const [comment, setComments] = useState<commentType[]>([]);

  const userAvatar = useSelector((state: RootState) => state.auth.avatar);

  useEffect(() => {
    const filteredCommentSection = data.filter((api) => api._id === commentId);
    const userComments = filteredCommentSection.flatMap(
      (comment) => comment["comments"],
    );
    console.log(filteredCommentSection);
    setComments(userComments);
  }, [commentId, data]);

  return (
    <>
      {comment.map((comment, index) => (
        <section
          className="mt-4 flex h-full flex-col xs:w-[20%] sm:w-[40%] md:w-[55%] lg:w-[70%]"
          key={index}
        >
          <div className="flex flex-row items-center">
            <img
              src={
                userAvatar === null
                  ? "/icons/avatar.svg"
                  : Img[comment.avatar].img
              }
              className="mx-2 max-h-[40px] space-x-2"
            />

            <div className="text-RED flex flex-row items-center space-x-4">
              <p className="flex-grow">{removeEmailSign(comment.email)}</p>
              <p className="text-xs">{comment.timestamp}</p>
            </div>
          </div>
          <article className="line-clamp-2 whitespace-normal break-words pl-14 pr-10">
            <p className="xs:text-xs sm:text-sm md:text-sm lg:text-base">
              {comment.comment}
            </p>
          </article>
        </section>
      ))}
    </>
  );
}

export default CommentsSection;
