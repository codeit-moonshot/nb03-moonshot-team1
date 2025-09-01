import filePublicUrl from '#utils/filePublicUrl';

const fileRelPathFromUrl = (url: string): string => {
  const sample = filePublicUrl('X');
  const base = sample.replace(/X$/, '');
  return url.startsWith(base) ? url.slice(base.length) : url;
};

export default fileRelPathFromUrl;
