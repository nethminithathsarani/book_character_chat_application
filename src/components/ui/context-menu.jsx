import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu@1.1.6';

import { cn } from './utils';

function ContextMenu({ ...props }) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ ...props }) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}

function ContextMenuContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content data-slot="context-menu-content" className={cn('bg-popover text-popover-foreground rounded-md border p-1 shadow-md', className)} {...props} />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem(props) {
  return <ContextMenuPrimitive.Item data-slot="context-menu-item" {...props} />;
}

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem };
export default ContextMenu;
