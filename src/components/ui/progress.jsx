import * as React from 'react';

import { cn } from './utils';

const Progress = ({ className, value, max = 100, ...props }) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn('relative h-2 w-full rounded-full bg-muted', className)} {...props}>
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-primary"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export { Progress };
export default Progress;
