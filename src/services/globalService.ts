import { collection, onSnapshot, query } from 'firebase/firestore';
import { UserProps } from 'store/actions/userSlice';

import { db } from './firebase';

export const getUserListService = async (callback: (payload: any) => void) => {
  const q = query(collection(db, 'users'));

  onSnapshot(q, async (querySnapshot: any) => {
    const d: UserProps[] = await Promise.all(
      (querySnapshot.docs || []).map(async (item: any) => item.data())
    );
    callback({
      data: d,
    });
  });
};

export const test = '';
