'use client';

import { auth, provider } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function SignInButton() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <div className="mb-4 text-right">
      {user ? (
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign out
        </button>
      ) : (
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
