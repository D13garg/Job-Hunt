import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import './index.css';

const JobReview = ({ jobId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [jobId]);

  const loadReviews = () => {
    const jobReviews = JSON.parse(localStorage.getItem(`jobReviews_${jobId}`)) || [];
    setReviews(jobReviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newReview.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    const review = {
      id: Date.now(),
      jobId,
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [...reviews, review];
    localStorage.setItem(`jobReviews_${jobId}`, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
    setNewReview({ rating: 5, comment: '' });
    setShowForm(false);
  };

  const deleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      localStorage.setItem(`jobReviews_${jobId}`, JSON.stringify(updatedReviews));
      setReviews(updatedReviews);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className="star">
        {index < rating ? <AiFillStar /> : <AiOutlineStar />}
      </span>
    ));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="job-reviews">
      <div className="reviews-header">
        <h3>Job Reviews ({reviews.length})</h3>
        {averageRating > 0 && (
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="stars">{renderStars(Math.round(averageRating))}</div>
          </div>
        )}
      </div>

      {user && (
        <div className="review-form-section">
          {!showForm ? (
            <button 
              className="add-review-btn"
              onClick={() => setShowForm(true)}
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${star <= newReview.rating ? 'selected' : ''}`}
                      onClick={() => setNewReview({...newReview, rating: star})}
                    >
                      <AiFillStar />
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Share your experience with this job..."
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit Review</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this job!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <strong>{review.userName}</strong>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobReview;




