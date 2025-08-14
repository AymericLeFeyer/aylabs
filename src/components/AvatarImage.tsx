import React, { useState } from 'react';
import { getInitials, generateBackgroundColor } from '../utils/avatarUtils';

interface AvatarImageProps {
  src: string;
  alt: string;
  name: string;
  className?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ 
  src, 
  alt, 
  name, 
  className = "w-10 h-10 rounded-full" 
}) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    // Fallback vers les initiales si l'image ne charge pas
    const initials = getInitials(name);
    const backgroundColor = generateBackgroundColor(name);
    
    return (
      <div 
        className={`${className} flex items-center justify-center text-white font-bold text-sm`}
        style={{ backgroundColor }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => setImageError(true)}
    />
  );
};