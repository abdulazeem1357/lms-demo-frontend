import * as real from './user.service';
import * as mock from './user.mock.service';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getCurrentUserProfile = useMocks ? mock.getCurrentUserProfile : real.getCurrentUserProfile;
export const updateUserProfile = useMocks ? mock.updateUserProfile : real.updateUserProfile;
export const changePassword = useMocks ? mock.changePassword : real.changePassword;
export const getUserById = useMocks ? mock.getUserById : real.getUserById;
export const getUsers = useMocks ? mock.getUsers : real.getUsers;
export const getUserRoles = useMocks ? mock.getUserRoles : real.getUserRoles;
export const assignUserRole = useMocks ? mock.assignUserRole : real.assignUserRole;
export const removeUserRole = useMocks ? mock.removeUserRole : real.removeUserRole;
