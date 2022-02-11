import React from 'react';
export const AuthContext = React.createContext({
    isSignedIn: false,
    setStatus: ()=>{},
    hidden: true
})