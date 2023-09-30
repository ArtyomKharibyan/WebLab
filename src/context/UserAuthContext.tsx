import React, { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction } from "react";
import {
    createUserWithEmailAndPassword,
    UserCredential,
    onAuthStateChanged,
    User,
    signOut,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { auth } from "../firebase/Firebase";

interface UserAuthContextProviderProps {
    children: ReactNode;
}

interface UserAuthContextValue {
    createUser: (email: string, password: string) => Promise<UserCredential>;
    logOut: () => Promise<void>;
    user: User | null;
    signIn: (email: string, password: string) => Promise<UserCredential>;
    googleSignIn: () => void;
    selectedPost: null | string;
    setSelectedPost: Dispatch<SetStateAction<string | null>>;
    isAuth: boolean;
    setIsAuth: Dispatch<SetStateAction<boolean>>;
    profileData: UserProfile | null
    setProfileData: Dispatch<SetStateAction<UserProfile | null>>;
    profileId : number | undefined
    setProfileId: Dispatch<SetStateAction<number | undefined>>;
}

export const UserContext = createContext<UserAuthContextValue | undefined>(
    undefined
);

interface UserProfile {
    id: number
    email: string;
    name: string;
    surname: string;
}

export const UserAuthContextProvider: React.FC<UserAuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [profileId, setProfileId] = useState<number | undefined>(profileData?.id);

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider()
        setIsAuth(true)
        localStorage.setItem("isAuth", "true");
        signInWithPopup(auth, provider)
    }

    const createUser = async (email: string, password: string) => {
        setIsAuth(true)
        localStorage.setItem("isAuth", "true");
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = async (email: string, password: string) => {
        setIsAuth(true)
        localStorage.setItem("isAuth", "true");
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        setIsAuth(false)
        localStorage.setItem("isAuth", "false");
        return signOut(auth);
    }

    console.log(auth.currentUser?.uid)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            console.log(user);
            setUser(currentUser);
        });

        return () => {
            unsubscribe();
        }
    }, [user]);

    const contextValue: UserAuthContextValue = {
        createUser,
        logOut,
        user,
        signIn,
        googleSignIn,
        selectedPost,
        setSelectedPost,
        isAuth,
        setIsAuth,
        profileData,
        setProfileData,
        profileId,
        setProfileId
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserAuth must be used within a UserAuthContextProvider");
    }
    return context;
}
