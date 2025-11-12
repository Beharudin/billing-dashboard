import { useEffect, useRef } from "react";
import API from "../config/axios-config";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/auth/auth-slice";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_URL
    : import.meta.env.VITE_PRO_BACKEND_URL;

// Background validator that silently verifies the current session with the backend.
// It runs on mount, on window focus, and on a periodic interval.
export const useSessionValidation = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  const isValidatingRef = useRef(false);

  useEffect(() => {
    if (!accessToken) return;

    const validate = async () => {
      if (isValidatingRef.current) return; // prevent overlapping calls
      isValidatingRef.current = true;
      try {
        const res = await API.get(`${baseUrl}/auth/status`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Only logout on explicit inactive confirmation
        const isInactive =
        res?.data.data === false;
        if (isInactive) {
          dispatch(logout());
        }
      } catch (_) {
        // Do nothing on failure; keep the user logged in
      } finally {
        isValidatingRef.current = false;
      }
    };

    // initial check
    validate();

    // validate on focus
    const onFocus = () => {
      void validate();
    };
    window.addEventListener("focus", onFocus);

    // periodic validation every 10 minutes
    const intervalId = window.setInterval(() => {
      void validate();
    }, 10 * 60 * 1000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(intervalId);
    };
  }, [accessToken, dispatch]);
};
