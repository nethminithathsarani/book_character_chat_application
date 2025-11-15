import * as React from 'react';

import { cn } from './utils';

function Carousel({ className, children, ...props }) {
  return (
    <div data-slot="carousel" className={cn('relative w-full overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
}

function CarouselTrack({ className, ...props }) {
  return <div data-slot="carousel-track" className={cn('flex touch-pan-x scroll-smooth gap-4', className)} {...props} />;
}

function CarouselItem({ className, ...props }) {
  return <div data-slot="carousel-item" className={cn('flex-shrink-0', className)} {...props} />;
}

export { Carousel, CarouselTrack, CarouselItem };
export default Carousel;
