import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

// Export and import types directly in the component file to avoid circular dependencies
export type QuizFormValues = {
  answers: Record<string, string | string[] | boolean>;
};

interface QuizQuestionProps {
  question: {
    id: string;
    type: 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer';
    text: string;
    options?: {
      id: string;
      text: string;
    }[];
    order: number;
  };
  questionIndex: number;
  register: UseFormRegister<QuizFormValues>;
  errors: FieldErrors<QuizFormValues>;
}

/**
 * QuizQuestion component for rendering different types of quiz questions
 * 
 * Supports:
 * - Single choice (radio buttons)
 * - Multiple choice (checkboxes)
 * - True/False (radio buttons)
 * - Short answer (text input)
 */
const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionIndex,
  register,
  errors,
}) => {
  const questionNumber = questionIndex + 1;
  
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'single_choice':
        return (
          <div className="space-y-3 mt-4">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`${question.id}-${option.id}`}
                    type="radio"
                    className="form-radio h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                    value={option.id}
                    {...register(`answers.${question.id}` as const)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label 
                    htmlFor={`${question.id}-${option.id}`}
                    className="text-neutral-700 cursor-pointer"
                  >
                    {option.text}
                  </label>
                </div>
              </div>
            ))}
            {errors.answers?.[question.id] && (
              <p className="text-red-500 text-sm mt-1">
                Please select an answer
              </p>
            )}
          </div>
        );
        
      case 'multiple_choice':
        return (
          <div className="space-y-3 mt-4">
            <p className="text-sm text-neutral-500 italic mb-2">
              Select all that apply
            </p>
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`${question.id}-${option.id}`}
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500 rounded"
                    value={option.id}
                    {...register(`answers.${question.id}.${option.id}` as const)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label 
                    htmlFor={`${question.id}-${option.id}`}
                    className="text-neutral-700 cursor-pointer"
                  >
                    {option.text}
                  </label>
                </div>
              </div>
            ))}
            {errors.answers?.[question.id] && (
              <p className="text-red-500 text-sm mt-1">
                Please select at least one answer
              </p>
            )}
          </div>
        );
        
      case 'true_false':
        return (
          <div className="space-y-3 mt-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={`${question.id}-true`}
                  type="radio"
                  className="form-radio h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                  value="true"
                  {...register(`answers.${question.id}` as const)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label 
                  htmlFor={`${question.id}-true`}
                  className="text-neutral-700 cursor-pointer"
                >
                  True
                </label>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={`${question.id}-false`}
                  type="radio"
                  className="form-radio h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                  value="false"
                  {...register(`answers.${question.id}` as const)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label 
                  htmlFor={`${question.id}-false`}
                  className="text-neutral-700 cursor-pointer"
                >
                  False
                </label>
              </div>
            </div>
            {errors.answers?.[question.id] && (
              <p className="text-red-500 text-sm mt-1">
                Please select either True or False
              </p>
            )}
          </div>
        );
        
      case 'short_answer':
        return (
          <div className="mt-4">
            <textarea
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 
                        focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-neutral-900"
              rows={4}
              placeholder="Enter your answer here..."
              {...register(`answers.${question.id}` as const)}
            />
            {errors.answers?.[question.id] && (
              <p className="text-red-500 text-sm mt-1">
                Please provide an answer
              </p>
            )}
          </div>
        );
        
      default:
        return (
          <p className="text-red-500 mt-2">
            Question type not supported
          </p>
        );
    }
  };
  
  return (
    <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
      <div className="flex items-center mb-3">
        <span className="bg-primary-100 text-primary-800 font-medium px-2.5 py-0.5 rounded-full text-xs">
          Question {questionNumber}
        </span>
        <span className="ml-2 text-neutral-500 text-xs uppercase">
          {question.type.replace('_', ' ')}
        </span>
      </div>
      
      <h3 className="text-lg font-medium text-neutral-800 mb-2">
        {question.text}
      </h3>
      
      {renderQuestionContent()}
    </div>
  );
};

export default QuizQuestion;