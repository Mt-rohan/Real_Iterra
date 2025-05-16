'use client';

import { auth, provider } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function SignInButton() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <button
          onClick={() => signOut(auth)}
          className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition duration-200"
        >
          Sign out
        </button>
      ) : (
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="px-5 py-2 rounded-full bg-white text-primary font-semibold shadow hover:bg-gray-100 transition duration-200"
        >
          Sign in with Google
        </button>
      )}
    </>
  );
}
