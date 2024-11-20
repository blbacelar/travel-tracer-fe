import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  id: string;
  locationId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (locationId: string, rating: number, comment: string) => void;
  getLocationReviews: (locationId: string) => Review[];
  getLocationRating: (locationId: string) => { rating: number; total: number };
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const REVIEWS_STORAGE_KEY = '@travel_tracer_reviews';

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load reviews from storage
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
        if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };
    loadReviews();
  }, []);

  // Save reviews to storage
  const saveReviews = async (newReviews: Review[]) => {
    try {
      await AsyncStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(newReviews));
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  };

  const addReview = (locationId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: Date.now().toString(),
      locationId,
      user: 'John Doe', // In a real app, this would come from user authentication
      rating,
      comment,
      date: 'Just now', // In a real app, use proper date formatting
    };

    setReviews(prev => {
      const newReviews = [...prev, newReview];
      saveReviews(newReviews);
      return newReviews;
    });
  };

  const getLocationReviews = (locationId: string) => {
    return reviews.filter(review => review.locationId === locationId);
  };

  const getLocationRating = (locationId: string) => {
    const locationReviews = getLocationReviews(locationId);
    const total = locationReviews.length;
    if (total === 0) return { rating: 0, total: 0 };

    const sum = locationReviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      rating: sum / total,
      total,
    };
  };

  return (
    <ReviewsContext.Provider value={{
      reviews,
      addReview,
      getLocationReviews,
      getLocationRating,
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}; 