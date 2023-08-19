import { getAdditionalUserInfo } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from './firebase';

export const signInService = async (
  res: any,
  callback: (payload: any) => void
) => {
  try {
    const { isNewUser = false } = getAdditionalUserInfo(res) || {};
    const payload = {
      email: res.user.email,
      uid: res.user.uid,
      displayName: res.user.displayName,
      photoURL: res.user.photoURL,
      phoneNumber: res.user.phoneNumber,
    };

    localStorage.setItem('token', res.user.accessToken);

    if (isNewUser) {
    console.log('isNewUser', isNewUser);
    await setDoc(doc(db, 'users', payload.uid), payload);
    } else {
    console.log('hehe');
    onSnapshot(doc(db, 'users', payload?.uid), async (d: any) => {
        callback({
          data: d.data(),
        });
      });
    }
  } catch (e) {
    console.log('🚀  ~ e', e);
  }
};

export const getMeService = async (
  uid: string,
  callback: (payload: any) => void
) => {
  onSnapshot(doc(db, 'users', uid), async (d: any) => {
    callback({
      data: d.data(),
    });
  });
};

export const updateMeService = async (uid: string, payload: any) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      username: payload.username,
    });
    return true;
  } catch (e) {
    console.log('🚀  ~ error update username', e);
    return false;
  }
};
