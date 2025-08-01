import React from 'react';
import { Text } from 'react-native';

// Map font weight to Outfit font family
const getOutfitFontFamily = (weight) => {
  switch (weight) {
    case '700':
    case 'bold':
      return 'Outfit_700Bold';
    case '600':
    case 'semibold':
      return 'Outfit_600SemiBold';
    case '500':
    case 'medium':
      return 'Outfit_500Medium';
    case 'normal':
    case '400':
    default:
      return 'Outfit_400Regular';
  }
};

export default function AppText({ style, children, weight, ...props }) {
  // Allow passing "weight" prop, or fallback to style.fontWeight
  const fontWeight =
    weight ||
    (style && style.fontWeight) ||
    '400';
  const fontFamily = getOutfitFontFamily(fontWeight);

  // Remove fontWeight from style to prevent RN warning
  const { fontWeight: _fw, ...restStyle } = style || {};

  return (
    <Text {...props} style={[{ fontFamily }, restStyle]}>
      {children}
    </Text>
  );
}