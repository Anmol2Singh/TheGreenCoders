import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { getUserRole, generateFarmerId, ROLES } from '../lib/roles';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch or create user profile
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const profile = userSnap.data();
                    setUserProfile(profile);
                } else {
                    // Create new user profile
                    const role = getUserRole(user.email);
                    const profile = {
                        email: user.email,
                        role: role,
                        createdAt: new Date().toISOString()
                    };

                    // Generate farmer ID for farmers
                    if (role === ROLES.FARMER) {
                        profile.farmerId = generateFarmerId();
                        profile.hasCard = false;
                    }

                    await setDoc(userRef, profile);
                    setUserProfile(profile);
                }
            } else {
                setUserProfile(null);
            }

            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const value = {
        currentUser,
        userProfile,
        logout,
        isAdmin: userProfile?.role === ROLES.ADMIN,
        isFarmer: userProfile?.role === ROLES.FARMER,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
