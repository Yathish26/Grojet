import { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';

// Fast loading hook with skeleton optimization
export const useFastLoading = (isLoading, minDisplayTime = 200) => {
  const [showLoading, setShowLoading] = useState(isLoading);
  const loadingStartTime = useRef(null);

  useEffect(() => {
    if (isLoading) {
      loadingStartTime.current = Date.now();
      setShowLoading(true);
    } else if (loadingStartTime.current) {
      const elapsed = Date.now() - loadingStartTime.current;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      
      if (remaining > 0) {
        // Ensure minimum display time for smooth UX
        setTimeout(() => setShowLoading(false), remaining);
      } else {
        setShowLoading(false);
      }
    } else {
      setShowLoading(false);
    }
  }, [isLoading, minDisplayTime]);

  return showLoading;
};

// Optimized shimmer component with better performance
export const FastShimmer = ({ width, height, borderRadius = 8, style = {} }) => {
  return (
    <View 
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#f0f0f0',
        ...style
      }}
    />
  );
};
