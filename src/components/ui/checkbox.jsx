import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox@1.1.6';
import { CheckIcon } from 'lucide-react@0.487.0';

import { cn } from './utils';

const Checkbox = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root ref={ref} className={cn('inline-flex h-4 w-4 items-center justify-center rounded-sm border', className)} {...props}>
      <CheckboxPrimitive.Indicator>
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = 'Checkbox';

function CheckboxLabel({ className, ...props }) {
  return <label data-slot="checkbox-label" className={cn('select-none', className)} {...props} />;
}

export { Checkbox, CheckboxLabel };
export default Checkbox;
