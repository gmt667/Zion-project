import React from 'react';
import logoUrl from '../assets/zion-logo.png';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-14 h-14" }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Zion Construction logo"
      className={`${className} object-contain select-none logo-img`}
      draggable={false}
      style={{ background: 'transparent' }}
    />
  );
}
