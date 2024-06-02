export const checkFormValidity = (formData: {
  title: string;
  author: string;
  year: string;
}) => {
  if (!formData.title || !formData.author || !formData.year) {
    return false;
  }
  return true;
};
