import React, { useState, useEffect } from "react";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import "./ReviewCard.css";

interface Charger {
  _id: string;
  name: string;
  location: string;
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
  likeCount: number;
  dislikeCount: number;
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
  const [newComment, setNewComment] = useState<string>("");
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const [chargerLiked, setChargerLiked] = useState<boolean>(false);
  const [chargerDisliked, setChargerDisliked] = useState<boolean>(false);
  const [chargerLikeCount, setChargerLikeCount] = useState<number>(0);
  const [chargerDislikeCount, setChargerDislikeCount] = useState<number>(0);

  useEffect(() => {
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
              console.log(userData.firstName);
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

  const handleToggleChargerLike = () => {
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
  };

  const handleToggleChargerDislike = () => {
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
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        if (!accessToken || !userId) {
          throw new Error("User is not authenticated.");
        }

        const userNameFromContext = localStorage.getItem("firstName");

        const newCommentPayload = {
          chargerId: charger._id,
          userId,
          userName: userNameFromContext,
          text: newComment,
          likes: 0,
          rating: 5,
        };

        const response = await fetch(
          `http://localhost:3000/addComments/addComment/${charger._id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newCommentPayload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add comment.");
        }

        const addedComment = await response.json();

        setCommentsList((prevComments) => [
          ...prevComments,
          {
            userId: addedComment.userId,
            _id: addedComment._id,
            userName: addedComment.userName,
            text: addedComment.text,
            user: {
              firstName: "",
              lastName: "",
              email: "",
              picture: "",
            },
            Date: new Date().toLocaleDateString(),
            liked: false,
            disliked: false,
            likeCount: 0,
            dislikeCount: 0,
          },
        ]);

        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
        `http://localhost:3000/addComments/deleteComment/${charger._id}/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment.");
      }

      setCommentsList((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = (commentId: string, currentText: string) => {
    setEditCommentId(commentId);
    setEditText(currentText);
  };

  const handleSaveComment = async () => {
    if (editText.trim()) {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("User is not authenticated.");
        }

        const response = await fetch(
          `http://localhost:3000/addComments/updateComment/${charger._id}/${editCommentId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: editText }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update comment.");
        }

        setCommentsList((prevComments) =>
          prevComments.map((comment) =>
            comment._id === editCommentId
              ? { ...comment, text: editText }
              : comment
          )
        );

        setEditCommentId(null);
        setEditText("");
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    }
  };

  const toggleLike = (commentId: string) => {
    setCommentsList((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              disliked: false,
              likeCount: comment.liked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            }
          : comment
      )
    );
    console.log(commentsList);
  };

  const toggleDislike = (commentId: string) => {
    setCommentsList((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              disliked: !comment.disliked,
              liked: false,
              dislikeCount: comment.disliked
                ? comment.dislikeCount - 1
                : comment.dislikeCount + 1,
            }
          : comment
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

      <div className="review-rating">
        <span className="rating-text">Rating: </span>
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`star ${index < rating ? "filled" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="20"
            height="20"
          >
            <path d="M10 15l-5.5 3 1-6-4.5-4 6-1L10 0l2.5 5 6 1-4.5 4 1 6z" />
          </svg>
        ))}
      </div>

      <div className="charger-like-section">
        <h4>{charger.name}</h4>
        <p>Location: {charger.location}</p>
        <div className="like-unlike-buttons">
          <button onClick={handleToggleChargerLike} className="like-button">
            {chargerLiked ? (
              <AiFillLike size={20} color="#007bff" />
            ) : (
              <AiOutlineLike size={20} />
            )}
            {chargerLikeCount}
          </button>
          <button
            onClick={handleToggleChargerDislike}
            className="dislike-button"
          >
            {chargerDisliked ? (
              <AiFillDislike size={20} color="#dc3545" />
            ) : (
              <AiOutlineDislike size={20} />
            )}
            {chargerDislikeCount}
          </button>
        </div>
      </div>

      <div className="comments-section">
        <div className="add-comment">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment"
            className="comment-input"
          />
          <button onClick={handleAddComment} className="add-comment-button">
            Add Comment
          </button>
        </div>

        <div className="comments-list">
          {commentsList.length > 0 ? (
            commentsList.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <img
                     src={
                      comment.user.picture
                        ? `http://localhost:3000${comment.user.picture}`
                        : "http://localhost:3000/default-profile-picture.png"
                    }
                    alt={`${comment.user.firstName}'s profile`}
                    className="comment-user-picture"
                  />
                  <p>
                    <strong>{comment.user.firstName}</strong> -{" "}
                    {new Date(comment.Date).toLocaleDateString()}
                  </p>
                </div>
                {editCommentId === comment._id ? (
                  <div>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-comment-input"
                    />
                    <button
                      onClick={handleSaveComment}
                      className="save-comment-button"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p>{comment.text}</p>
                )}
                <div className="like-unlike-section">
                  <button
                    onClick={() => toggleLike(comment._id)}
                    className="like-button"
                  >
                    {comment.liked ? (
                      <AiFillLike size={20} color="#007bff" />
                    ) : (
                      <AiOutlineLike size={20} />
                    )}
                    {comment.likeCount}
                  </button>
                  <button
                    onClick={() => toggleDislike(comment._id)}
                    className="dislike-button"
                  >
                    {comment.disliked ? (
                      <AiFillDislike size={20} color="#dc3545" />
                    ) : (
                      <AiOutlineDislike size={20} />
                    )}
                    {comment.dislikeCount}
                  </button>
                </div>
                <div className="comment-actions">
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="delete-comment-button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditComment(comment._id, comment.text)}
                    className="edit-comment-button"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
