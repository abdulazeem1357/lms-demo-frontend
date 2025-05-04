import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { getQuizById } from '../../services/assessment';
import { IQuiz } from '../../types/course.types';
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import QuizTimer from '../../components/features/CourseContent/QuizTimer';
import QuizQuestion from '../../components/features/CourseContent/QuizQuestion';

// Extending the basic IQuiz interface with question details
interface IQuizDetails extends IQuiz {
  timeLimit: number; // in seconds
  questions: IQuestion[];
}

interface IQuizQuestion {
  id: string;
  quizId: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer';
  text: string;
  options?: {
    id: string;
    text: string;
  }[];
  order: number;
}

interface IQuestion extends IQuizQuestion {
  correctAnswer?: string | string[] | boolean;
}

export type QuizFormValues = {
  answers: Record<string, string | string[] | boolean>;
};

// Add interface for submission result
interface IQuizSubmissionResult {
  submissionId: string;
  status: 'submitted';
  timestamp: string;
}

/**
 * QuizPage component for displaying and submitting quizzes
 * 
 * Allows students to:
 * - View quiz questions with a timer
 * - Submit answers before the timer expires
 * - See confirmation when the quiz is submitted
 */
const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [showResultModal, setShowResultModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<IQuizSubmissionResult | null>(null);

  // Set up form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormValues>({
    defaultValues: {
      answers: {},
    },
  });

  // Fetch quiz details
  const { data: quiz, isLoading, isError, error } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => {
      if (!quizId) throw new Error('Quiz ID is required');
      return getQuizById(quizId) as Promise<IQuizDetails>;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!quizId,
  });

  // Mutation for submitting quiz
  const { mutate: submitQuiz, isPending } = useMutation({
    mutationFn: async (data: QuizFormValues) => {
      // Mock submission for now - include submitted answers count in ID
      return new Promise<IQuizSubmissionResult>((resolve) => {
        setTimeout(() => {
          const answersCount = Object.keys(data.answers).length;
          resolve({
            submissionId: `quiz-${answersCount}-${Date.now()}`,
            status: 'submitted',
            timestamp: new Date().toISOString(),
          });
        }, 1000);
      });
    },
    onSuccess: (data) => {
      // Update submission result and show modal
      setSubmissionResult(data);
      setShowResultModal(true);
    },
    onError: (error) => {
      console.error('Error submitting quiz:', error);
    },
  });

  // Handler for quiz submission
  const onSubmit: SubmitHandler<QuizFormValues> = (data) => {
    submitQuiz(data);
  };

  // Handler for modal close
  const handleModalClose = () => {
    setShowResultModal(false);
    navigate(-1);
  };

  // Timer expired handler
  const handleTimeUp = () => {
    handleSubmit(onSubmit)();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <StateDisplay
          type="error"
          title="Failed to load quiz"
          message={error instanceof Error ? error.message : 'Unknown error occurred'}
          actionButton={
            <Button 
              variant="primary"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          }
        />
      </div>
    );
  }

  // If we don't have a quiz or questions
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <StateDisplay
        type="empty"
        title="Quiz Not Available"
        message="This quiz has no questions or is not currently available."
        actionButton={
          <Button 
            variant="primary"
            onClick={() => navigate(-1)}
          >
            Return to Course
          </Button>
        }
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Quiz header */}
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-neutral-600 mb-4">{quiz.description}</p>
          )}
          
          {/* Quiz timer */}
          <div className="mb-6">
            <QuizTimer
              timeLimit={quiz.timeLimit}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>

        {/* Quiz form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8">
            {/* Quiz questions */}
            {quiz.questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionIndex={index}
                register={register}
                errors={errors}
              />
            ))}
          </div>

          {/* Submit button */}
          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Results modal */}
      <Modal
        isOpen={showResultModal}
        onClose={handleModalClose}
        title="Quiz Submitted"
        closeOnClickOutside={false}
        closeOnEsc={false}
        showCloseButton={false}
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Submission Successful!</h3>
          <p className="text-neutral-600 mb-6">
            Your quiz has been successfully submitted.
            <br />
            Submission ID: {submissionResult?.submissionId}
          </p>
          <div className="mt-5">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleModalClose}
            >
              Return to Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizPage;