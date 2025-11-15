import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible@1.1.6';

import { cn } from './utils';

function Collapsible({ ...props }) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({ className, ...props }) {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" className={cn('', className)} {...props} />;
}

function CollapsibleContent({ className, ...props }) {
  return <CollapsiblePrimitive.Content data-slot="collapsible-content" className={cn('', className)} {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
export default Collapsible;
