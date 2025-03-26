import {
  useCallback,
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";
import usersService from "../services/usersService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const fn_error_context_must_be_used = () => {
  throw new Error("must use authContext provider for consumer to work");
};

export const authContext = createContext({
  user: null,
  login: fn_error_context_must_be_used,
  logout: fn_error_context_must_be_used,
  signUp: fn_error_context_must_be_used,
});
authContext.displayName = "Auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(usersService.getUser());

  const refreshUser = useCallback(() => setUser(usersService.getUser()), []);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const response = await usersService.login(credentials);
        refreshUser();
        return response;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [refreshUser],
  );

  const navigate = useNavigate();

  const logout = useCallback(() => {
    usersService.logout();
    refreshUser();
    toast.success("logged out");
    navigate("/");
  }, [refreshUser, navigate]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      signUp: usersService.createUser,
      loading,
    }),
    [user, loading, login, logout],
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}
