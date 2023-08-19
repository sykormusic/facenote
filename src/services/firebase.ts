import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
export const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: 'AIzaSyD5hbzQ3jmteBpI1T0oVc3-hxdsg22dIeU',
  authDomain: 'facenote-1880c.firebaseapp.com',
  projectId: 'facenote-1880c',
  storageBucket: 'facenote-1880c.appspot.com',
  messagingSenderId: '340040087654',
  appId: '1:340040087654:web:dc20ed63545c49f0fd15a7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);
export default app;