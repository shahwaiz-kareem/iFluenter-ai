export const accentOptions = [
  { value: "us", label: "American English" },
  { value: "uk", label: "British English" },
  { value: "au", label: "Australian English" },
  { value: "in", label: "Indian English" },
];

export const topicOptions = [
  { value: "Travel & Culture", label: "Travel & Culture" },
  { value: "Business Communication", label: "Business Communication" },
  { value: "science", label: "Science" },
  { value: "People & Biography", label: "People & Biography" },
  { value: "Technology Trends", label: "Technology Trends" },
  { value: "Education System", label: "Education System" },
  { value: "Health & Wellness", label: "Health & Wellness" },
  { value: "Religion & Faith", label: "Religion & Faith" },
];

export const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "normal", label: "Normal" },
  { value: "difficult", label: "Difficult" },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    AvatarScale: isTablet ? 2.5 : isMobile ? 2 : isSmall ? 1.3 : 2.4,
    AvatarPosition: isTablet
      ? [0, -3.2, 5]
      : isMobile
      ? [0, -3, 5]
      : isSmall
      ? [0, -2, 5]
      : [0, -3.5, 5],
  };
};
