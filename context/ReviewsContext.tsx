import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser } from '@clerk/clerk-expo';

export interface Review {
  id: string;
  locationId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  timestamp: any;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (locationId: string, rating: number, comment: string) => Promise<void>;
  getLocationReviews: (locationId: string) => Review[];
  getLocationRating: (locationId: string) => { rating: number; total: number };
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return new Date();
  
  // Handle Firestore Timestamp
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  
  // Handle regular Date objects
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  return new Date();
};

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user } = useUser();

  // Load reviews from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedReviews = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: formatTimestamp(data.timestamp)
        };
      }) as Review[];
      setReviews(loadedReviews);
    });

    return () => unsubscribe();
  }, []);

  const addReview = async (locationId: string, rating: number, comment: string) => {
    if (!user) return;

    const newReview = {
      locationId,
      userId: user.id,
      userName: user.fullName || 'Anonymous',
      userImage: user.imageUrl,
      rating,
      comment,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'reviews'), newReview);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
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