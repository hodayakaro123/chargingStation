import React, { useState, useEffect } from "react";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import CommentCard from "../CommentCard";
import "./ReviewCard.css";

interface Charger {
  _id: string;
  name: string;
  location: string;
  likes: number;
  dislikes: number;
}

interface Comment {
  userId: string;
  _id: string;
  userName: string;
  text: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    picture: string;
  };
  Date: string;
  liked: boolean;
  disliked: boolean;
  likes: number;
  dislikes: number;
  likedUsers: string[];
  dislikedUsers: string[];
}

interface ReviewCardProps {
  userName: string;
  location: string;
  rating: number;
  picture: string;
  comments?: Comment[];
  charger: Charger;
}

export default function ReviewCard({
  userName,
  location,
  rating,
  picture,
  comments = [],
  charger,
}: ReviewCardProps) {
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);
  const [chargerLiked, setChargerLiked] = useState<boolean>(false);
  const [chargerDisliked, setChargerDisliked] = useState<boolean>(false);
  const [chargerLikeCount, setChargerLikeCount] = useState<number>(0);
  const [chargerDislikeCount, setChargerDislikeCount] = useState<number>(0);

  useEffect(() => {
    console.log("charger", charger);

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/addComments/getCommentsByChargerId/${charger._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comments.");
        }

        const fetchedComments = await response.json();

        const commentsWithUserData = await Promise.all(
          fetchedComments.comments.map(async (comment: Comment) => {
            try {
              const userResponse = await fetch(
                `http://localhost:3000/auth/getUserById/${comment.userId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );

              if (!userResponse.ok) {
                throw new Error(
                  `Failed to fetch user for comment ID: ${comment._id}`
                );
              }

              const userData = await userResponse.json();
              return { ...comment, user: userData };
            } catch (error) {
              console.error(
                `Error fetching user for comment ID: ${comment._id}`,
                error
              );
              return { ...comment, user: null };
            }
          })
        );

        setCommentsList(commentsWithUserData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [charger._id]);

  const handleToggleCharger = async (type: string) => {
    try {
      const isLike = type === "like";
      const isDislike = type === "dislike";

      const data = {
        chargerId: charger._id,
        userId: localStorage.getItem("userId"),
        like: isLike ? !chargerLiked : false,
        dislike: isDislike ? !chargerDisliked : false,
      };
      console.log(localStorage.getItem("userId"));

      const response = await fetch(
        `http://localhost:3000/addChargingStation/toggleLikeDislikeCharger`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update charger like/dislike");
      }

      if (isLike) {
        if (!chargerLiked) {
          setChargerLikeCount((prev) => prev + 1);
          if (chargerDisliked) {
            setChargerDislikeCount((prev) => prev - 1);
            setChargerDisliked(false);
          }
        } else {
          setChargerLikeCount((prev) => prev - 1);
        }
        setChargerLiked(!chargerLiked);
      }

      if (isDislike) {
        if (!chargerDisliked) {
          setChargerDislikeCount((prev) => prev + 1);
          if (chargerLiked) {
            setChargerLikeCount((prev) => prev - 1);
            setChargerLiked(false);
          }
        } else {
          setChargerDislikeCount((prev) => prev - 1);
        }
        setChargerDisliked(!chargerDisliked);
      }
    } catch (error) {
      console.error("Error toggling charger like/dislike:", error);
    }
  };

  const toggleReaction = async (
    commentId: string,
    reaction: "like" | "dislike"
  ) => {
    const isLike = reaction === "like";

    const updatedComments = commentsList.map((comment) =>
      comment._id === commentId
        ? {
            ...comment,
            liked: isLike ? !comment.liked : false,
            disliked: isLike ? false : !comment.disliked,

            likes: isLike
              ? comment.liked
                ? comment.likes - 1
                : comment.likes + 1
              : comment.likes,

            dislikes: isLike
              ? comment.dislikes
              : comment.disliked
              ? comment.dislikes - 1
              : comment.dislikes + 1,
          }
        : comment
    );

    setCommentsList(updatedComments);

    console.log("updatedComments", updatedComments);

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:3000/addComments/toggleLikeDislikeComment/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [reaction]: true,
            chargerId: charger._id,
            commentId,
            userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update ${reaction} status`);
      }

      const updatedCommentData = await response.json();
      const updatedCommentsWithNewCount = commentsList.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              likeCount: updatedCommentData.likeCount,
              dislikeCount: updatedCommentData.dislikeCount,
            }
          : comment
      );

      // setCommentsList(updatedCommentsWithNewCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = (comment: Comment) => {
    setCommentsList((prevComments) => [...prevComments, comment]);
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentsList((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  const handleUpdateComment = (commentId: string, newText: string) => {
    setCommentsList((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId ? { ...comment, text: newText } : comment
      )
    );
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="user-info">
          <img src={picture} alt="User Avatar" className="avatar" />
          <div className="user-details">
            <p className="user-name">{userName}</p>
            <p className="location">{location}</p>
          </div>
        </div>
      </div>

      <div className="charger-like-section">
        <h4>{charger.name}</h4>
        <p>Location: {charger.location}</p>
        <div className="like-unlike-buttons">
          <button
            onClick={() => handleToggleCharger("like")}
            className="like-button"
          >
            {chargerLiked ? (
              <AiFillLike size={25} color="#007bff" />
            ) : (
              <AiOutlineLike size={25} />
            )}
            .{charger.likes}
          </button>

          <button
            onClick={() => handleToggleCharger("dislike")}
            className="dislike-button"
          >
            {chargerDisliked ? (
              <AiFillDislike size={25} color="#dc3545" />
            ) : (
              <AiOutlineDislike size={25} />
            )}
            {charger.dislikes}
          </button>
        </div>
      </div>

      <CommentCard
        comments={commentsList}
        chargerId={charger._id}
        onCommentAdded={handleAddComment}
        onCommentDeleted={handleDeleteComment}
        onCommentUpdated={handleUpdateComment}
        onToggleReaction={toggleReaction}
      />
    </div>
  );
}
