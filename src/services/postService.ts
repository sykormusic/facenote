import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from './firebase';

let unsubscribe: (() => void) | null = null;

export const unsubscribeGetPosts = () => {
  if (unsubscribe) {
    unsubscribe();
  }
};

export const getPostListService = (
  limitNumber: number,
  callback: (payload: any) => void
) => {
  console.log('🚀  ~ limitNumber', limitNumber);
  let q = null;

  q = query(
    collection(db, 'posts'),
    orderBy('timestamp', 'desc'),
    limit(limitNumber)
  );

  // If there is an existing listener,
  // unsubscribe from it before creating a new one
  // Fix by ChatGPT - love you so much
  if (unsubscribe) {
    console.log('🚀  ~ unsubscribed');
    unsubscribe();
  }

  unsubscribe = onSnapshot(q, async (querySnapshot: any) => {
    const d: any[] = await Promise.all(
      (querySnapshot.docs || []).map(async (item: any) => item.data())
    );
    console.log('🚀  ~ payload.data[0]', d?.[0]?.content);
    console.log('🚀  ~ payload.data', d);
    callback({
      data: d,
    });
  });
};

export const getPostDetailService = (
  postId: string,
  callback: (payload: any) => void
) => {
  unsubscribeGetPosts();
  unsubscribe = onSnapshot(doc(db, 'posts', postId), async (d: any) => {
    callback({
      data: d.data(),
    });
  });
};

export const getPostCommentsService = (
  postId: string,
  callback: (payload: any) => void
) => {
  const postDocRef = doc(db, 'posts', postId);

  const q = query(
    collection(db, 'comments'),
    where('post', '==', postDocRef),
    orderBy('timestamp', 'desc')
  );

  onSnapshot(q, async (querySnapshot: any) => {
    const data: any[] = await Promise.all(
      (querySnapshot.docs || []).map(async (comment: any) => comment.data())
    );
    callback({
      post: postId,
      data,
    });
  });
};
