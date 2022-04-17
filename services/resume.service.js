import { getDocs, addDoc, updateDoc, collection, where, query, doc } from 'firebase/firestore';

import { db } from '../firebase/firebase';

export const getResume = async (user_id) => {
  const q = query(collection(db, 'resumes'), where("user_id", "==", user_id));
  const doc = await getDocs(q);

  if (doc.empty) return null;

  let data = {};
  doc.forEach((item) => {
    data = item.data();
    data.id = item.id;
  });

  return data;
};

export const getResumeByUsername = async (username) => {
  const q = query(collection(db, 'resumes'), where("username", "==", username));
  const doc = await getDocs(q);

  if (doc.empty) return null;

  let data = {};
  doc.forEach((item) => {
    data = item.data();
    data.id = item.id;
  });

  return data;
};

export const createResume = async (data) => {
  const ref = collection(db, 'resumes');
  const doc = await addDoc(ref, data);
  return doc;
};

export const updateResume = async (id, data) => {
  const res = await updateDoc(doc(db, 'resumes', id), data);

  return res;
};

export const getResumeUsername = async (username) => {
  const q = query(collection(db, 'resumes'), where("username", "==", username));
  const doc = await getDocs(q);

  return !doc.empty;
};