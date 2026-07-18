import React from 'react';
import logoUrl from '../assets/zion-logo.svg';

export default function Logo() {
  return (
    <img
      src={logoUrl}
      alt="Zion Construction logo"
      className="w-32 h-auto select-none"
      draggable={false}
    />
  );
}
