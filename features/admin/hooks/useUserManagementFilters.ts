'use client';

import { useState } from 'react';

export function useUserManagementFilters() {
  const [open, setOpen] =
    useState(false);

  const [status, setStatus] =
    useState<
      'All' | 'Active' | 'Inactive'
    >('All');

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const resetFilters = () => {
    setStatus('All');
  };

  return {
    open,

    toggleOpen,

    status,

    setStatus,

    resetFilters,
  };
}