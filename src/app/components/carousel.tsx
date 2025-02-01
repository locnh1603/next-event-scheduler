'use client'
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {Box} from '@mui/material';
import Image from 'next/image';

export class ICarouselSlideData {
  image: string = '';
  name: string = '';
}

export class ICarouselProps {
  loop: boolean = false;
  data: ICarouselSlideData[] = [];
}
const Carousel = (props: ICarouselProps) => {
  const { loop } = props;
  const [emblaRef] = useEmblaCarousel({ loop }, [Autoplay()])
  return (
    <Box>
      <div className="carousel" ref={emblaRef}>
        <div className="carousel-container">
          {
            props.data.map((item, index) => (
              <div className="carousel-slide" key={index}>
                <Image src={item.image} alt={item.name} height={180} width={100} />
              </div>
            ))
          }
        </div>
      </div>
    </Box>
  )
}
export default Carousel;
