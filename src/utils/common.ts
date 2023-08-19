export const singularify = (text: string, val: number) => {
  if (val === 1) return text;
  return `${text}s`;
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const urlify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url: string) =>
      `<a href="${url}" style="color: var(--chakra-colors-brand-400)">${url}</a>`
  );
};

export const hashtagify = (text: string) => {
  const hashtagRegex = /(?<=[\s>]|^)#(\w*[A-Za-z_]+\w*)/g;
  // const atRegex = /(?<=[\s>]|^)@(\w*[A-Za-z_.]+\w*)/g;

  let res = '';
  res = text.replace(
    hashtagRegex,
    (url) =>
      `<a href="#" style="color: var(--chakra-colors-brand-400)">${url}</a>`
  );
  return res;
};
