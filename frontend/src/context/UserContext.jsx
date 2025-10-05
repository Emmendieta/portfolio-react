import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../helpers/auth.js";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { user, error } = await getCurrentUser();
            if(error) {
                //LOGGER:
                console.warn("No user found or error getting the information!");
            }
            setUser(user); // user will be null if error is true
            setLoadingUser(false);
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value= {{user, loadingUser, setUser }}>
            { children }
        </UserContext.Provider>
    );
};