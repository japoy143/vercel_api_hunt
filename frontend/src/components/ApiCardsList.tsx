import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  updateIsCommentSection,
  postComment,
  updateLikedAPIOnly,
  removeLikedAPIOnly,
  updateShowLikedUsers,
} from "../redux/APISlice";
import { updateLikeOnly } from "../redux/AuthSlice";
import { CommentsSection, UsersLiked } from "./exports";
import { APIType, likedType } from "../types";
import { toast } from "sonner";
import HeartSvg from "../assets/heartSvg";

type ApiCardsListProps = {
  searchInput: string;
};

function ApiCardsList({ searchInput }: ApiCardsListProps) {
  const navigate = useNavigate();

  // comment value
  const [comment, setComment] = useState<string>("");

  //handling refresh token and generating new accessToken
  const axiosPrivate = useAxiosPrivate();

  //controller
  const dispatch = useDispatch();

  //api list
  const data = useSelector((state: RootState) => state.api.data);

  //date today
  const timeToday = new Date();

  //user Details
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const userAvatar = useSelector((state: RootState) => state.auth.avatar);
  const userEmail = useSelector((state: RootState) => state.auth.email);
  const userId = useSelector((state: RootState) => state.auth.id);
  const userAccessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );

  // functions

  //filter comment to distinct so that it will not have duplicates
  const userLikes = useSelector((state: RootState) => state.auth.likes);
  const removeDuplicateLikes = new Set([...userLikes]);

  //get previous comments
  const getPreviousComment = (id: string) => {
    const previousComments = data
      .filter((api) => api._id === id)
      .map((api) => api.comments)
      .flat();

    return previousComments;
  };

  //submit comment
  const handleSubmitComment = (id: string) => {
    const commentData = {
      email: userEmail,
      userId: userId,
      avatar: userAvatar,
      comment: comment,
      timestamp: timeToday.toLocaleTimeString(),
    };

    //prev comment
    const previousComments = getPreviousComment(id);

    axiosPrivate
      .patch(
        `APIs/${id}`,
        {
          comments: [commentData, ...previousComments],
        },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      )
      .then((res) => console.log("comment posted", res))
      .catch((err) => {
        console.error("comment post failed", err);
        toast.error("Comment Failed ");
      });

    //client side update
    dispatch(
      postComment({
        id: id,
        comment: commentData,
      }),
    );
    //clean up
    setComment("");
  };

  //API side update
  const APICollectionLike = (apiId: string) => {
    const usersLiked: likedType = {
      avatar: userAvatar,
      email: userEmail,
      userId: userId,
    };

    //get previous user likes
    const apiLiked = data
      .filter((api) => api._id === apiId)
      .map((liked) => liked.likes)
      .flat();
    //is user already in list
    const isApiLiked = apiLiked.some((item) => item.userId === userId);
    //unlike
    const userUnLiked = apiLiked.filter((liked) => liked.userId !== userId);
    const likesMethod = isApiLiked
      ? [...userUnLiked]
      : [usersLiked, ...apiLiked];

    const clientSideMethod = isApiLiked
      ? removeLikedAPIOnly({ id: apiId, userId: userId })
      : updateLikedAPIOnly({
          id: apiId,
          liked: usersLiked,
        });

    axiosPrivate
      .patch(`/APIs/${apiId}`, {
        likes: [...likesMethod],
      })
      .then(() => {
        console.log("API like collection added");
      })
      .catch((err) => {
        console.error(err);
        dispatch(removeLikedAPIOnly({ id: apiId, userId: userId }));
      });
    dispatch(clientSideMethod);
  };

  // user side collection update
  const UserCollectionLike = (apiId: string) => {
    //find if already exist
    const liked = userLikes.includes(apiId);
    //remove sameId
    const unlike = userLikes.filter((like) => like !== apiId);
    //if like already then unlike
    const method = liked ? [...unlike] : [apiId, ...removeDuplicateLikes];

    axiosPrivate
      .patch(`/Users/${userId}`, {
        likes: [...method],
      })
      .then(() => {
        console.log("Users like collection added");
      })
      .catch((err) => {
        console.error(err);
        dispatch(updateLikeOnly([...unlike]));
      });

    dispatch(updateLikeOnly([...method]));
  };

  const handleLike = (apiId: string) => {
    APICollectionLike(apiId);
    UserCollectionLike(apiId);
  };

  //if liked
  const showLikes = (id: string) => {
    const found = userLikes.includes(id);
    return found ? "black" : "none";
  };

  //hover users liked
  const onHoverLikes = (id: string) => {
    dispatch(updateShowLikedUsers(id));
  };

  const unHoverLikes = (id: string) => {
    dispatch(updateShowLikedUsers(id));
  };

  const [partialData, setPartialData] = useState<APIType[]>([]);

  useEffect(() => {
    if (data) {
      setPartialData(data);
    }
  }, [data]);

  console.log(typeof partialData);

  return partialData.map((api, i) => {
    if (
      api.category.toLowerCase().includes(searchInput.toLowerCase()) ||
      api.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
    ) {
      return (
        <article
          className={`mt-4 grid w-full grid-rows-2 rounded-lg bg-bgwhite p-10 font-poppins ${api.isCommentSection ? "h-[400px]" : "h-[140px]"}`}
          key={i}
        >
          <div className="flex-1 space-y-2">
            <div className="flex flex-row items-center space-x-2">
              <a
                className="cursor-pointer text-xl font-medium underline hover:text-blue-500"
                href={api.link}
                target="_blank"
              >
                {api.name}
              </a>
              <img src="/icons/link.svg" className="h-5 w-5 -rotate-6" />
              <div>
                <p className="text-end">{api.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2">
              <article className="col-span-1 line-clamp-2">
                <p className="">{api.description}</p>
              </article>
              <aside className="flex flex-row justify-end space-x-4">
                {api.key && (
                  <img
                    src="/icons/key.svg"
                    alt=""
                    title="Need Api Key"
                    className="h-6 w-6"
                  />
                )}

                <div className="flex flex-row justify-center space-x-2">
                  <img
                    onClick={
                      isLogin
                        ? () => dispatch(updateIsCommentSection(api._id))
                        : () => navigate("/SignUp")
                    }
                    src="/icons/comment.svg"
                    alt=""
                    title={isLogin ? "Comments" : "Sign Up to Comment"}
                    className="h-6 w-6 cursor-pointer"
                  />
                  <p>{api.comments.length}</p>
                </div>

                <div
                  className="relative flex flex-row justify-center space-x-2 bg-none"
                  onMouseEnter={() => onHoverLikes(api._id)}
                  onMouseLeave={() => unHoverLikes(api._id)}
                >
                  <button
                    onClick={() => handleLike(api._id)}
                    className="h-6 w-6"
                  >
                    <HeartSvg className="h-6 w-6" color={showLikes(api._id)} />
                  </button>
                  <p>{api.likes.length}</p>

                  {api.isLikeHover && (
                    <div className="absolute right-0.5 top-8 h-24 w-40 overflow-y-auto overflow-x-hidden rounded bg-white p-4">
                      <UsersLiked Id={api._id} />
                    </div>
                  )}
                </div>
              </aside>
            </div>
            {api.isCommentSection && (
              <section className="w-100 h-[200px] flex-1 overflow-scroll overflow-x-hidden rounded bg-bgCommentSection p-2">
                <div className="flex h-10 w-full flex-row items-center space-x-2 px-4">
                  <input
                    type="text"
                    placeholder="write a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="h-full rounded bg-bgwhite px-4 xs:w-[16%] sm:w-[40%] md:w-[50%] lg:w-[92%]"
                  />
                  <button onClick={() => handleSubmitComment(api._id)}>
                    <img src="/icons/send.svg" className="h-8 w-8 rotate-45" />
                  </button>
                </div>
                <div className="flex h-full w-full flex-col items-start px-4 pr-16">
                  <CommentsSection commentId={api._id} />
                </div>
              </section>
            )}
          </div>
        </article>
      );
    }
  });
}

export default ApiCardsList;
