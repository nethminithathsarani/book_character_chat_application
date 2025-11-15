import * as React from 'react';

import { cn } from './utils';

const Badge = ({ className, children, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
export default Badge;
