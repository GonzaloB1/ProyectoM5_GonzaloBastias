import { createContext } from "react";
import type { AuthContextType } from "../types/user";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);