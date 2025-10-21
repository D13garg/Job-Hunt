import { useState, useRef, useEffect } from "react";
import "./index.css";
import Navbar from "../Navbar";
import StarRating from "./rating";
import CommentCard from "./commentCard";
import Editor from "./editor";
import { BiUserCircle } from "react-icons/bi";
import { useAuth } from "../../contexts/AuthContext";

var imageUrlRegex = /\b(https?:\/\/[^\s]+)/g;

export default function Discussion() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [rating, setRating] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const commentRef = useRef();
  const [commentList, setCommentList] = useState([]);
  const [urlList, setUrlList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === "" || commentRef.current.innerText === "") {
      window.alert("Enter the credentials");
      return;
    }

    const newComment = {
      id: Date.now(),
      name: name,
      content: commentRef.current.innerText,
      rating: rating,
      createdAt: new Date().toISOString(),
      imageUrl: imageUrl
    };

    // Add to shared localStorage for all users
    const existingComments = JSON.parse(localStorage.getItem('sharedDiscussionComments')) || [];
    const updatedComments = [newComment, ...existingComments];
    localStorage.setItem('sharedDiscussionComments', JSON.stringify(updatedComments));

    // Update state
    setCommentList(updatedComments);
    
    // Reset form
    setName(user?.name || "");
    setImageUrl("");
    commentRef.current.innerText = "";
    setRating(0);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleCommentChange = (e) => {
    const value = e.currentTarget.innerText;
    const newLength = value?.length;
    if (newLength === 0) {
      setUrlList([]);
      setImageUrl();
      return;
    }
    if (value?.match(imageUrlRegex)) {
      setUrlList(value?.match(imageUrlRegex));
    } else {
      setUrlList([]);
    }
  };

  useEffect(() => {
    if (urlList?.length !== 0) {
      setImageUrl(urlList[0]);
    } else {
      setImageUrl("");
    }
  }, [urlList]);

  const deleteComment = (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const updatedComments = commentList.filter(comment => comment.id !== id);
      localStorage.setItem('sharedDiscussionComments', JSON.stringify(updatedComments));
      setCommentList(updatedComments);
    }
  };
  useEffect(() => {
    // Load comments from shared localStorage
    const savedComments = JSON.parse(localStorage.getItem('sharedDiscussionComments')) || [];
    setCommentList(savedComments);
    
    // Set up a listener for storage changes (when other tabs/users add comments)
    const handleStorageChange = (e) => {
      if (e.key === 'sharedDiscussionComments') {
        const updatedComments = JSON.parse(e.newValue) || [];
        setCommentList(updatedComments);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  return (
    <>
      <Navbar />
      <div className="discussion">
        <div className="right">
          <div className="discuss">JOB DISQUS</div>

          <form className="comment-form">
            <div className="input-group">
              <div className="comment-name">
                <div className="line"> {commentList?.length} Comments</div>
                <div className="icon-name">
                  <div className="user-icon">
                    <BiUserCircle />
                  </div>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="form-control"
                    value={name}
                    onChange={handleNameChange}
                    disabled={user?.name} // Disable if user is logged in
                  />
                </div>
              </div>
            </div>
            <div className="star-rating">
              <div className="rating-text">You rated this </div>
              <StarRating onChange={setRating} />
            </div>
            <div className="input-group">
              <div
                type="text"
                className="form-control comment"
                contentEditable="true"
                data-testid="comment-section-test"
                data-placeholder="Join the discussion...."
                onInput={handleCommentChange}
                ref={commentRef}
              />
              <div className="icon-button">
                <Editor onUrlChange={setUrlList} commentRef={commentRef} />

                <button
                  className="submit"
                  data-testid="reset-comment"
                  onClick={handleSubmit}
                >
                  Comment
                </button>
              </div>
              <div className="only-image">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Discussion image"
                    data-testid="image-preview"
                    className={`${imageUrl ? "image-text-editor" : ""}`}
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="comment-section">
        <div className="comment-box">
          {commentList &&
            commentList?.map((comments) => {
              return (
                <CommentCard
                  key={comments.id}
                  value={comments}
                  deleteComment={() => deleteComment(comments.id)}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
