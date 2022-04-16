import { getDocs, addDoc, updateDoc, collection, where, query, } from 'firebase/firestore';

import { db } from '../firebase/firebase';

export const getUser = async (user_id) => {
  const q = query(collection(db, 'users'), where("user_id", "==", user_id));
  const doc = await getDocs(q);

  let data = {};
  doc.forEach((item) => {
    data = item.data();
  });

  return data;
};

export const addUser = async (data) => {
  const q = query(collection(db, 'users'));
  const doc = await addDoc(q, data);

  return doc;
};

export const setUser = async (user_id, data) => {
  const q = query(collection(db, 'users'), where("user_id", "==", user_id));
  const doc = await updateDoc(q, data);

  return doc;
};