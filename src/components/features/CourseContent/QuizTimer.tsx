import React, { useState, useEffect } from 'react';

interface QuizTimerProps {
  timeLimit: number; // in seconds
  onTimeUp: () => void;
}

/**
 * QuizTimer component for displaying countdown timer during quiz attempts
 * 
 * @param timeLimit - Time allowed for the quiz in seconds
 * @param onTimeUp - Callback function triggered when the timer reaches zero
 */
const QuizTimer: React.FC<QuizTimerProps> = ({ timeLimit, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Reset the timer if timeLimit changes
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    // Create interval to decrement time
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timerInterval);
  }, [onTimeUp]);

  // Set warning and danger states based on remaining time
  useEffect(() => {
    const warningThreshold = Math.floor(timeLimit * 0.25); // 25% of time left
    const dangerThreshold = Math.floor(timeLimit * 0.1);  // 10% of time left

    setIsWarning(timeRemaining <= warningThreshold && timeRemaining > dangerThreshold);
    setIsDanger(timeRemaining <= dangerThreshold);
  }, [timeRemaining, timeLimit]);

  // Determine timer color based on remaining time
  const timerColorClass = isDanger 
    ? 'bg-red-100 text-red-700 border-red-300' 
    : isWarning 
      ? 'bg-amber-100 text-amber-700 border-amber-300' 
      : 'bg-green-50 text-green-700 border-green-200';

  return (
    <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-lg border border-neutral-200">
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-neutral-500 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="font-medium text-neutral-700">Time Remaining:</span>
      </div>
      <div className={`px-3 py-1 rounded-md font-mono font-bold ${timerColorClass}`}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default QuizTimer;