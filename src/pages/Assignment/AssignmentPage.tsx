import React, { useState, useRef, useEffect, useMemo, useCallback, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

// Components
import { FileUpload } from '../../components/common/FileUpload';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { StateDisplay } from '../../components/common/StateDisplay';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

// Services
import { getAssignmentById } from '../../services/assessment';
import { submitAssignment } from '../../services/submission';

// Types
import { IAssignment } from '../../types/course.types';
import { TApiError } from '../../types/api.types';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * AssignmentPage component displays assignment details and allows students to submit their work
 * with a file upload and optional comments.
 */
const AssignmentPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // File upload and submission states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Fetch assignment details with proper typing
  const { data: assignment, isLoading, isError, error } = useQuery<IAssignment, TApiError>({
    queryKey: ['assignment', assignmentId],
    queryFn: () => {
      if (!assignmentId) throw new Error('Assignment ID is required');
      return getAssignmentById(assignmentId);
    },
    enabled: !!assignmentId,
  });

  // Create sanitized HTML for assignment description
  const sanitizedDescription = useMemo(() => {
    if (!assignment?.description) return '';
    return DOMPurify.sanitize(assignment.description);
  }, [assignment?.description]);

  // Submit assignment mutation
  const { mutate: submitAssignmentMutation } = useMutation({
    mutationFn: async ({ file, assignmentId, comments }: { file: File; assignmentId: string; comments: string }) => {
      setIsSubmitting(true);
      setUploadProgress(0);
      setUploadError(null);
      
      // Simulate upload progress
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      
      progressIntervalRef.current = window.setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 15;
          return next >= 95 ? 95 : next;
        });
      }, 300);
      
      try {
        const result = await submitAssignment(assignmentId, file, comments);
        return result;
      } catch (error) {
        throw error;
      } finally {
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    },
    onSuccess: () => {
      setUploadProgress(100);
      setIsSubmitting(false);
      
      // Show success message
      setIsSuccessModalOpen(true);
      
      // Reset form
      setSelectedFile(null);
      setComments('');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] });
    },
    onError: (error: Error) => {
      setUploadProgress(0);
      setIsSubmitting(false);
      setUploadError(error.message || 'Failed to submit assignment. Please try again.');
    }
  });

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    if (!assignmentId) {
      setUploadError('Assignment ID is missing');
      return;
    }
    
    submitAssignmentMutation({
      file: selectedFile,
      assignmentId,
      comments
    });
  }, [selectedFile, assignmentId, comments, submitAssignmentMutation]);

  // Handle modal close and navigation
  const handleModalClose = useCallback(() => {
    setIsSuccessModalOpen(false);
    navigate(-1);
  }, [navigate]);

  // Handle comments change with proper typing
  const handleCommentsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
  };

  // Check if assignment is past due
  const isPastDue = assignment ? isPast(new Date(assignment.dueDate)) : false;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" label="Loading assignment details..." />
      </div>
    );
  }

  // Error state
  if (isError || !assignment) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <StateDisplay 
          type="error"
          title="Failed to load assignment"
          message={error?.message || 'An error occurred while loading the assignment'}
          actionButton={
            <Button 
              variant="primary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  // Format date for display
  const formattedDueDate = format(new Date(assignment.dueDate), 'MMMM d, yyyy, h:mm a');

  return (
    <ErrorBoundary fallback={<StateDisplay type="error" title="Something went wrong" message="An error occurred while rendering the assignment page" />}>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Assignment details */}
        <Card className="mb-6">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h1 className="text-xl md:text-2xl font-heading font-semibold text-neutral-800">{assignment.title}</h1>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium w-fit ${
                isPastDue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {isPastDue ? 'Past Due' : 'Active'}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center text-sm text-neutral-500 gap-4 sm:space-x-6 mb-6">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>Due: {formattedDueDate}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>
                  {isPastDue ? 'Closed' : 'Open for submissions'}
                </span>
              </div>
            </div>
            
            <div className="prose prose-neutral max-w-full">
              {assignment.description ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
              ) : (
                <p className="text-neutral-600 italic">No additional instructions provided.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Submission form */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-heading font-semibold text-neutral-800 mb-4">Submit Your Work</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File upload */}
                <div className="space-y-2">
                  <FileUpload
                    label="Assignment File"
                    helperText="Upload your completed assignment (.pdf, .docx, .pptx, .zip)"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                    maxSize={50 * 1024 * 1024} // 50MB
                    onChange={setSelectedFile}
                    value={selectedFile}
                    disabled={isSubmitting || isPastDue}
                    error={uploadError || undefined}
                  />
                  {uploadError && (
                    <p className="text-sm text-red-600">{uploadError}</p>
                  )}
                </div>
                
                {/* Comments field */}
                <div>
                  <Textarea
                    id="submission-comments"
                    label="Comments (Optional)"
                    placeholder="Add any comments about your submission..."
                    value={comments}
                    onChange={handleCommentsChange}
                    disabled={isSubmitting || isPastDue}
                    rows={4}
                  />
                </div>
                
                {/* Upload progress */}
                {isSubmitting && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Upload Progress</label>
                    <ProgressBar 
                      value={uploadProgress} 
                      showPercentage 
                      color={uploadProgress === 100 ? 'success' : 'primary'} 
                    />
                  </div>
                )}
                
                {/* Submit button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !selectedFile || isPastDue}
                    className="min-w-[150px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Spinner size="sm" color="white" className="mr-2" />
                        <span>Submitting...</span>
                      </div>
                    ) : isPastDue ? (
                      'Submission Closed'
                    ) : (
                      'Submit Assignment'
                    )}
                  </Button>
                </div>
                
                {/* Past due warning */}
                {isPastDue && (
                  <div className="p-4 bg-red-50 text-red-800 rounded-md">
                    <p className="text-sm">
                      This assignment is past due. Submissions are no longer accepted.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </Card>
        </motion.div>

        {/* Success Modal */}
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title="Assignment Submitted"
          size="sm"
        >
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Submission Successful!</h3>
            <p className="text-neutral-600 mb-6">
              Your assignment has been successfully submitted.
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
    </ErrorBoundary>
  );
};

export default AssignmentPage;