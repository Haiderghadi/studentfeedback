import React from "react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-2 text-2xl text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
