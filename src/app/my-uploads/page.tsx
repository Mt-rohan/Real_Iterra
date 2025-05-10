// src/app/my-uploads/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import LoadingSpinner from '@/components/LoadingSpinner';

interface UploadRecord {
  id: string;
  videoUrl: string;
  summary: string;
  tips: string[];
  createdAt: Timestamp;
}

export default function MyUploadsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Fetch uploads when user is available
  useEffect(() => {
    const fetchUploads = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const uploadsRef = collection(db, 'users', user.uid, 'uploads');
      const q = query(uploadsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<UploadRecord, 'id'>)
      }));
      setUploads(records);
      setLoading(false);
    };
    fetchUploads();
  }, [user]);

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-gray-700">Please sign in to view your uploads.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading your uploads..." />;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Uploads</h1>
      {uploads.length === 0 ? (
        <p className="text-gray-700">You haven't uploaded any videos yet.</p>
      ) : (
        uploads.map((upload) => (
          <div key={upload.id} className="mb-8 border rounded-lg p-4 shadow-sm">
            <video
              src={upload.videoUrl}
              controls
              className="w-full h-auto rounded"
            />
            <div className="mt-4">
              <p className="font-medium text-gray-800">Summary:</p>
              <p className="text-gray-700 mb-2">{upload.summary}</p>
              <p className="font-medium text-gray-800">Tips:</p>
              <ul className="list-disc list-inside mb-2">
                {upload.tips.map((tip, i) => (
                  <li key={i} className="text-gray-700">{tip}</li>
                ))}
              </ul>
              <p className="text-xs text-gray-500">
                Uploaded: {upload.createdAt.toDate().toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
