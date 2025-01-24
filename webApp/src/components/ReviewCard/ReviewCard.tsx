import React, { useState } from "react";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai"; // Import like and dislike icons
import "./ReviewCard.css";

interface Comment {
  id: string;
  userName: string;
  text: string;
  date: string;
  liked: boolean;
  disliked: boolean;
  likeCount: number;
  dislikeCount: number;
  userHasInteracted: boolean; // Track whether the user has interacted with the comment
}

interface ReviewCardProps {
  userName: string;
  location: string;
  reviewText: string;
  rating: number;
  date: string;
  avatar: string;
  comments?: Comment[];
}

export default function ReviewCard({
  userName,
  location,
  reviewText,
  rating,
  date,
  avatar,
  comments = [],
}: ReviewCardProps) {
  const [newComment, setNewComment] = useState<string>("");
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentData: Comment = {
        id: Math.random().toString(),
        userName: "המשתמש",
        text: newComment,
        date: new Date().toLocaleDateString(),
        liked: false,
        disliked: false,
        likeCount: 0,
        dislikeCount: 0,
        userHasInteracted: false, // User hasn't interacted initially
      };
      setCommentsList([...commentsList, newCommentData]);
      setNewComment("");
    }
  };

  const toggleLike = (commentId: string) => {
    setCommentsList(
      commentsList.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              disliked: comment.liked ? comment.disliked : false, // Reset dislike if switching from like
              likeCount: comment.liked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
              dislikeCount:
                comment.liked && comment.disliked
                  ? comment.dislikeCount - 1
                  : comment.dislikeCount,
            }
          : comment
      )
    );
  };

  const toggleDislike = (commentId: string) => {
    setCommentsList(
      commentsList.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              disliked: !comment.disliked,
              liked: comment.disliked ? comment.liked : false, // Reset like if switching from dislike
              dislikeCount: comment.disliked
                ? comment.dislikeCount - 1
                : comment.dislikeCount + 1,
              likeCount:
                comment.disliked && comment.liked
                  ? comment.likeCount - 1
                  : comment.likeCount,
            }
          : comment
      )
    );
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="user-info">
          <img src={avatar} alt="User Avatar" className="avatar" />
          <div className="user-details">
            <p className="user-name">{userName}</p>
            <p className="location">{location}</p>
          </div>
        </div>
        <span className="review-date">{date}</span>
      </div>

      <div className="review-body">
        <p className="review-text">{reviewText}</p>
      </div>

      <div className="review-rating">
        <span className="rating-text">הערכה: </span>
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

      <div className="comments-section">
        <div className="add-comment">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="הוסף תגובה"
            className="comment-input"
          />
          <button onClick={handleAddComment} className="add-comment-button">
            הוסף תגובה
          </button>
        </div>

        <div className="comments-list">
          {commentsList && commentsList.length > 0 ? (
            commentsList.map((comment) => (
              <div key={comment.id} className="comment">
                <p>
                  <strong>{comment.userName}</strong> - {comment.date}
                </p>
                <p>{comment.text}</p>
                <div className="like-unlike-section">
                  {/* כפתור לייק */}
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className="like-button"
                    disabled={comment.userHasInteracted} // Disable if user already interacted
                  >
                    {comment.liked ? (
                      <AiFillLike size={24} color="blue" />
                    ) : (
                      <AiOutlineLike size={24} />
                    )}
                  </button>
                  {/* כפתור דיסלייק */}
                  <button
                    onClick={() => toggleDislike(comment.id)}
                    className="dislike-button"
                    disabled={comment.userHasInteracted} // Disable if user already interacted
                  >
                    {comment.disliked ? (
                      <AiFillDislike size={24} color="red" />
                    ) : (
                      <AiOutlineDislike size={24} />
                    )}
                  </button>
                </div>

                {/* הצגת כמות הלייקים והדיסלייקים */}
                <div className="like-dislike-counts">
                  <span>לייקים: {comment.likeCount}</span> |{" "}
                  <span>דיסלייקים: {comment.dislikeCount}</span>
                </div>
              </div>
            ))
          ) : (
            <p>אין תגובות עדיין.</p>
          )}
        </div>
      </div>
    </div>
  );
}
