import { ComponentProps, useState } from 'react';
import Drawer from './Drawer';
import { IconButton, Screen } from './ui';

/** The four main sections share the existing mobile header and menu. */
export default function PrimaryScreen(props: ComponentProps<typeof Screen>) {
  const [open, setOpen] = useState(false);
  return <>
    <Drawer open={open} onClose={() => setOpen(false)} />
    <Screen {...props} noBack left={<IconButton label="Open menu" icon="Menu" onClick={() => setOpen(true)} />} />
  </>;
}
