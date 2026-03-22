import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, token, isLoading } = useSelector((state) => state.auth);

  const isAuthenticated = !!token && !!user;
  const isPremium = user?.subscription === "premium";
  const canCreateResume =
    user?.subscription === "premium" || user?.resumeCount < 3;
  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isPremium,
    canCreateResume,
  };
};
