import React, { useState, useRef } from 'react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = ''
}) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    if (currentX > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (currentX < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }
    
    setCurrentX(0);
    setIsDragging(false);
  };

  return (
    <div
      ref={cardRef}
      className={`transform transition-transform duration-200 ${className}`}
      style={{
        transform: isDragging ? `translateX(${currentX}px)` : 'translateX(0)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};