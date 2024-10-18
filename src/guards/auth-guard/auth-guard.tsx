import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthGuardProp } from "./types";
import { PATH_TO_SIGN_IN } from "../../common/constants";

export const AuthGuard = ({ component }: AuthGuardProp) => {
  const user = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(PATH_TO_SIGN_IN);
    }
  }, [user, navigate]);

  return <>{component}</>;
};