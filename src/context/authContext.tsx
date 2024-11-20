'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { app } from "@/firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

type UserType = {
    email: string | null;
    uid: string;
}
type AuthContextType = { user: UserType | null; }

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<UserType | null>(null)
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth(app);  // firebase authState 
        onAuthStateChanged(auth, (loggedInUser) => {
            if (loggedInUser) {
                const { email, uid } = loggedInUser;
                setUser({ email, uid });
                router.push('/allExpensesData');
            } else {
                setUser(null); // if user not found
                router.push('/login');
            }
        })
    }, [router])

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);