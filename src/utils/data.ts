import { EmailIcon, InfoIcon, PhoneIcon } from '@chakra-ui/icons';
import { IoCodeWorking, IoSchool } from 'react-icons/io5';

export const skills = [
  {
    name: 'HTML',
    icon: 'icons/HTML.svg',
  },
  {
    name: 'CSS',
    icon: 'icons/CSS.svg',
  },
  {
    name: 'JavaScript',
    icon: 'icons/JavaScript.svg',
  },
  {
    name: 'TypeScript',
    icon: 'icons/TypeScript.svg',
  },
  {
    name: 'Flutter',
    icon: 'icons/Flutter-Dark.svg',
  },
  {
    name: 'ReactJS',
    icon: 'icons/React-Dark.svg',
  },
  {
    name: 'NextJS',
    icon: 'icons/NextJS-Dark.svg',
  },
  {
    name: 'Redux',
    icon: 'icons/Redux.svg',
  },

  // {
  //   name: 'Vite',
  //   icon: 'icons/Vite-Dark.svg',
  // },
  // {
  //   name: 'Webpack',
  //   icon: 'icons/Webpack-Dark.svg',
  // },
  {
    name: 'Git',
    icon: 'icons/Git.svg',
  },
  // {
  //   name: 'SASS',
  //   icon: 'icons/Sass.svg',
  // },
  {
    name: 'Linux',
    icon: 'icons/Linux-Dark.svg',
  },
];

export const experiences = [
  {
    logo: IoSchool,
    title: 'University of Information Technology (UIT) - VNUHCM',
    major: 'Major: Information Technology',
    date: 'aug 2016 - july 2020',
    link: 'https://www.uit.edu.vn',
    color: 'brand',
  },
  {
    logo: IoCodeWorking,
    title: 'Terralogic Inc',
    major: 'Position: Frontend Developer',
    link: 'https://terralogic.com',
    date: 'july 2020 - now',
    color: 'brand',
  },
];

export const projects = [
  {
    company: 'Terralogic',
    name: 'HR-OS',
    description: 'A Human Resources Management System',
    link: 'https://terralogic.paxanimi.ai',
  },
  {
    company: 'Vercel',
    name: 'Vite React template',
    description:
      'A template using React, TS, Chakra UI, Redux Tookit, React Router,...',
    link: 'https://github.com/tuzkituan/lewis-vite-react-template',
  },
  {
    company: 'Vercel',
    name: 'Youtube Clone',
    description: 'A simple clone of YouTube',
    link: 'https://youtube-lewis.vercel.app',
  },
  {
    company: 'Vercel',
    name: 'Spotify Clone',
    description: 'A simple clone of Spotify',
    link: 'https://spotify-lewis.vercel.app/',
  },
  {
    company: 'Me',
    name: 'My homepage',
    description: 'My portfolio website using ReactJS, TS, Chakra UI, ThreeJS',
    link: window.location.href,
  },
];

export const infos = [
  {
    value: '0374988297',
    icon: PhoneIcon,
    colorScheme: 'green',
  },
  {
    value: 'tuannguyenitpy@gmail.com',
    icon: EmailIcon,
    colorScheme: 'cyan',
  },
  {
    value: 'Ho Chi Minh City',
    icon: InfoIcon,
    colorScheme: 'purple',
  },
];

export const apps = [
  // {
  //   name: 'HR-OS Mobile',
  //   description: 'Human Resource Management System App',
  //   images: ['/images/placeholder.png'],
  //   tags: ['flutter', 'android'],
  //   link: 'https://github.com/tuzkituan/hros_mobile',
  // },
  {
    name: 'Sleep Timer',
    description: 'A timer to pause any audio on your device automatically',
    images: ['/images/placeholder.png'],
    tags: ['flutter', 'android'],
    link: 'https://github.com/tuzkituan/sleep-timer',
  },
  {
    name: 'Maypaper',
    description: 'An app to discover wallpapers, pictures,...',
    images: ['/images/placeholder.png'],
    tags: ['flutter', 'android', 'pexels', 'wallpapers'],
    link: 'https://github.com/tuzkituan/maypaper',
  },
  {
    name: 'Kodage',
    description: 'An app to edit photos',
    images: ['/images/placeholder.png'],
    tags: ['flutter', 'android', 'editing', 'photos'],
    link: 'https://github.com/tuzkituan/kodage-app',
  },
];
