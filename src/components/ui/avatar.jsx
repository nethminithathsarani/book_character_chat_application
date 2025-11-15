import * as React from 'react';

import { cn } from './utils';

const Avatar = ({ src, alt, className, children, ...props }) => {
  return (
    <div
      className={cn(
        'relative inline-flex h-10 w-10 flex-shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted',
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="h-full w-full object-cover" src={src} alt={alt} />
      ) : (
        <span className="text-sm font-medium leading-none text-muted-foreground">
          {children}
        </span>
      )}
    </div>
  );
};

export { Avatar };
export default Avatar;
