import { createContext, useContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();

export function FeedbackProvider({ children }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('feedbacks');
    if (saved) {
      setFeedbacks(JSON.parse(saved));
    }
  }, []);

  const addFeedback = (feedback) => {
    const newFeedback = {
      ...feedback,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...feedbacks, newFeedback];
    setFeedbacks(updated);
    localStorage.setItem('feedbacks', JSON.stringify(updated));
    return newFeedback;
  };

  const getAnalytics = () => {
    if (feedbacks.length === 0) {
      return {
        total: 0,
        avgCourseRating: 0,
        avgInstructorRating: 0,
        avgServicesRating: 0,
        byRating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        byCourse: {},
        byInstructor: {},
      };
    }

    const total = feedbacks.length;
    const avgCourseRating = feedbacks.reduce((sum, f) => sum + (f.courseRating || 0), 0) / total;
    const avgInstructorRating = feedbacks.reduce((sum, f) => sum + (f.instructorRating || 0), 0) / total;
    const avgServicesRating = feedbacks.reduce((sum, f) => sum + (f.servicesRating || 0), 0) / total;

    const byRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(f => {
      if (f.courseRating) byRating[f.courseRating]++;
    });

    const byCourse = {};
    const byInstructor = {};

    feedbacks.forEach(f => {
      if (f.course) {
        byCourse[f.course] = (byCourse[f.course] || 0) + 1;
      }
      if (f.instructor) {
        byInstructor[f.instructor] = (byInstructor[f.instructor] || 0) + 1;
      }
    });

    return {
      total,
      avgCourseRating: parseFloat(avgCourseRating.toFixed(2)),
      avgInstructorRating: parseFloat(avgInstructorRating.toFixed(2)),
      avgServicesRating: parseFloat(avgServicesRating.toFixed(2)),
      byRating,
      byCourse,
      byInstructor,
    };
  };

  const clearAll = () => {
    setFeedbacks([]);
    localStorage.removeItem('feedbacks');
  };

  const getUserFeedbacks = (username) => {
    return feedbacks.filter(f => f.author === username);
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        addFeedback,
        getAnalytics,
        clearAll,
        getUserFeedbacks,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  return useContext(FeedbackContext);
}
