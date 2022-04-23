import { useState } from 'react';

export default function useModal() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const modal = [open, toggle];

  modal.open = open;
  modal.toggle = toggle;

  return modal;
}
