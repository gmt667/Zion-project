import React from 'react';
import logoUrl from '../assets/zion-logo.svg';

export default function Logo() {
  return (
    <img
      src={logoUrl}
      alt="Zion Construction logo"
      className="w-14 h-14 object-contain select-none"
      draggable={false}
      style={{ background: 'transparent' }}
    />
  );
}
