import React, { useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'away' | 'offline' | 'busy' | 'none';

export interface AvatarProps {
  /**
   * URL of the avatar image
   */
  src?: string;
  
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  
  /**
   * Text to display when no image is available (usually initials)
   */
  initials?: string;
  
  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: AvatarSize;
  
  /**
   * Shape of the avatar
   * @default 'circle'
   */
  shape?: AvatarShape;
  
  /**
   * Background color class when showing initials (Tailwind class)
   * @default 'bg-avocado-500'
   */
  bgColor?: string;
  
  /**
   * Text color class when showing initials (Tailwind class)
   * @default 'text-white'
   */
  textColor?: string;
  
  /**
   * Optional border around avatar
   * @default false
   */
  bordered?: boolean;
  
  /**
   * User online status indicator
   * @default 'none'
   */
  status?: AvatarStatus;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Avatar component for displaying user images or initials
 * 
 * @example
 * // Avatar with image
 * <Avatar src="/path/to/image.jpg" alt="User Name" />
 * 
 * @example
 * // Avatar with initials
 * <Avatar initials="JD" size="lg" bgColor="bg-blue-500" />
 * 
 * @example
 * // Avatar with online status
 * <Avatar src="/path/to/image.jpg" status="online" />
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  shape = 'circle',
  bgColor = 'bg-avocado-500',
  textColor = 'text-white',
  bordered = false,
  status = 'none',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  
  // Size classes map
  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-2xl',
  };
  
  // Size classes for status indicator
  const statusSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };
  
  // Status color classes
  const statusColorClasses = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    none: 'hidden',
  };
  
  // Border classes
  const borderClasses = bordered ? 'border-2 border-white' : '';
  
  // Shape classes
  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-md';
  
  // Handle image loading error
  const handleError = () => {
    setImageError(true);
  };
  
  // Combine all classes
  const avatarClasses = `
    ${sizeClasses[size]}
    ${shapeClasses}
    ${borderClasses}
    ${onClick ? 'cursor-pointer' : ''}
    overflow-hidden flex items-center justify-center
    ${className}
  `;
  
  // Get user initials from the provided string or extract from alt text
  const getUserInitials = () => {
    if (initials) return initials.substring(0, 2).toUpperCase();
    
    if (alt && alt !== 'Avatar') {
      return alt
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    
    return '';
  };

  return (
    <div className="relative inline-block">
      <div
        className={avatarClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        data-testid="avatar"
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleError}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${bgColor} ${textColor}`}>
            {getUserInitials()}
          </div>
        )}
      </div>
      
      {status !== 'none' && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${statusColorClasses[status]} ${statusSizeClasses[size]}`}
          role="status"
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;