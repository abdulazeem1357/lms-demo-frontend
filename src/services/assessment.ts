import * as real from './assessment.service';
import * as mock from './assessment.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getModuleQuizzes = useMocks ? mock.getModuleQuizzes : real.getModuleQuizzes;
export const createModuleQuiz = useMocks ? mock.createModuleQuiz : real.createModuleQuiz;
export const getQuizById = useMocks ? mock.getQuizById : real.getQuizById;
export const updateQuiz = useMocks ? mock.updateQuiz : real.updateQuiz;
export const deleteQuiz = useMocks ? mock.deleteQuiz : real.deleteQuiz;
export const getQuizSubmissions = useMocks ? mock.getQuizSubmissions : real.getQuizSubmissions;
export const getQuizSubmissionDetail = useMocks ? mock.getQuizSubmissionDetail : real.getQuizSubmissionDetail;
export const gradeQuizSubmission = useMocks ? mock.gradeQuizSubmission : real.gradeQuizSubmission;
export const getModuleAssignments = useMocks ? mock.getModuleAssignments : real.getModuleAssignments;
export const createModuleAssignment = useMocks ? mock.createModuleAssignment : real.createModuleAssignment;
export const getAssignmentById = useMocks ? mock.getAssignmentById : real.getAssignmentById;
export const updateAssignment = useMocks ? mock.updateAssignment : real.updateAssignment;
export const deleteAssignment = useMocks ? mock.deleteAssignment : real.deleteAssignment;
export const getAssignmentSubmissions = useMocks ? mock.getAssignmentSubmissions : real.getAssignmentSubmissions;
export const getAssignmentSubmissionDetail = useMocks ? mock.getAssignmentSubmissionDetail : real.getAssignmentSubmissionDetail;
export const gradeAssignmentSubmission = useMocks ? mock.gradeAssignmentSubmission : real.gradeAssignmentSubmission;
