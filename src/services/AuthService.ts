
interface User {
  id: string;
  email: string;
  password: string;
}

export class AuthService {

  registerUser = async (email: string, password: string) => {
  };

  validateAndCreateSession = async (email: string, password: string) => {
  };

  getUserProfile = async (sessionId: string) => {
  };

}
