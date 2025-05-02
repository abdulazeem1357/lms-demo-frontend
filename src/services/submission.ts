import * as real from './submission.service';
import * as mock from './submission.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getAssignmentSubmissions = useMocks ? mock.getAssignmentSubmissions : real.getAssignmentSubmissions;
export const getAssignmentSubmissionDetail = useMocks ? mock.getAssignmentSubmissionDetail : real.getAssignmentSubmissionDetail;
export const gradeAssignmentSubmission = useMocks ? mock.gradeAssignmentSubmission : real.gradeAssignmentSubmission;
export const getQuizSubmissions = useMocks ? mock.getQuizSubmissions : real.getQuizSubmissions;
export const getQuizSubmissionDetail = useMocks ? mock.getQuizSubmissionDetail : real.getQuizSubmissionDetail;
export const gradeQuizSubmission = useMocks ? mock.gradeQuizSubmission : real.gradeQuizSubmission;
