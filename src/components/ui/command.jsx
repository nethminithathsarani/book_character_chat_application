import * as React from 'react';
import * as CommandPrimitive from 'cmdk@0.32.0';

import { cn } from './utils';

function Command({ className, ...props }) {
  return <CommandPrimitive.Command data-slot="command" className={cn('w-full', className)} {...props} />;
}

function CommandInput(props) {
  return <CommandPrimitive.Input data-slot="command-input" className={cn('w-full px-2 py-1', props.className)} {...props} />;
}

function CommandList(props) {
  return <CommandPrimitive.List data-slot="command-list" {...props} />;
}

export { Command, CommandInput, CommandList };
export default Command;
