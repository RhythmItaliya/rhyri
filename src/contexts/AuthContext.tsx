import * as React from "react";
import {
  GoogleAuthProvider,
  User,
  UserCredential,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, onSnapshot, Timestamp } from "firebase/firestore";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icons } from "../components/Icons";
import { useLocation } from "react-router-dom";

interface AuthProviderProps {
  children: React.ReactNode;
}

export type OAuthStrategy = "oauth_google";

const authRequiredRoutes = [
  "/dashboard",
  "/invoice",
  "/invoices",
  "/client",
  "/clients",
  "/company",
  "/companies",
  "/bank",
  "/banks",
];

export type RestrictionType = "disable" | "hide";

interface AuthContextProps {
  currentUser: User | null;
  restrictionDate: Date | null;
  restrictionType: RestrictionType;
  isAdmin: boolean;
  signOutCurrentUser: () => Promise<void>;
  signIn: (strategy: OAuthStrategy) => Promise<UserCredential | undefined>;
}

const AuthContext = React.createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useTheme is only accessible within the theme provider");
  }

  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = React.useState(true);

  const { data: currentUser = null } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return auth.currentUser;
    },
  });

  const [restrictionDate, setRestrictionDate] = React.useState<Date | null>(
    null,
  );
  const [restrictionType, setRestrictionType] =
    React.useState<RestrictionType>("disable");
  const isAdmin = currentUser?.email === import.meta.env.VITE_ADMIN_EMAIL;

  const syncUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          lastLogin: Timestamp.now(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error syncing user profile:", error);
    }
  };

  const signInMutationFn = useMutation({
    mutationFn: async (strategy: OAuthStrategy) => {
      switch (strategy) {
        case "oauth_google":
          return signInWithPopup(auth, new GoogleAuthProvider());

        default:
          return;
      }
    },
  });

  const signOutCurrentUser = async () => {
    return signOut(auth).then(() => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    });
  };

  const signIn = async (strategy: OAuthStrategy) => {
    return signInMutationFn.mutateAsync(strategy).then((userCredential) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      return userCredential;
    });
  };

  React.useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unSubscribe = auth.onAuthStateChanged((user) => {
      queryClient.setQueryData(["user"], user);
      if (user) {
        syncUserProfile(user);

        const userRef = doc(db, "users", user.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.restrictionDate) {
              setRestrictionDate(
                data.restrictionDate instanceof Timestamp
                  ? data.restrictionDate.toDate()
                  : new Date(data.restrictionDate),
              );
            } else {
              setRestrictionDate(null);
            }

            setRestrictionType(
              data.restrictionType === "hide" ? "hide" : "disable",
            );
          }
        });
      } else {
        setRestrictionDate(null);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
      setIsLoading(false);
    });

    return () => {
      unSubscribe();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [queryClient]);

  const isAuthRequiredRoute = authRequiredRoutes.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        restrictionDate,
        restrictionType,
        isAdmin,
        signOutCurrentUser,
        signIn,
      }}
    >
      {isLoading && isAuthRequiredRoute ? (
        <div className="min-h-screen w-full flex-center flex-col gap-2">
          <Icons.logo className="h-10 w-10" />
          <p className="text-muted">authenticating...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
