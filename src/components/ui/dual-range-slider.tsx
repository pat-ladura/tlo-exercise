"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onChange?: (min: number, max: number) => void;
}

export default function DualRangeSlider({ onChange }: Props) {
  const STEP = 50;
  const MIN = 50;
  const MAX = 5000;

  const [min, setMin] = useState(50);
  const [max, setMax] = useState(5000);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightRef.current) {
      const left = ((min - MIN) / (MAX - MIN)) * 100;
      const width = ((max - min) / (MAX - MIN)) * 100;
      highlightRef.current.style.left = `${left}%`;
      highlightRef.current.style.width = `${width}%`;
    }
  }, [min, max]);

  const handleRelease = () => {
    if (onChange) onChange(min, max);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), max - STEP);
    setMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), min + STEP);
    setMax(value);
  };

  return (
    <div className="w-96 mx-auto ">
      {/* Track Background */}
      <div className="relative h-2 bg-gray-300 rounded">
        <div ref={highlightRef} className="absolute h-2 bg-blue-500 rounded" />
      </div>

      {/* Range Inputs */}
      <div className="relative -mt-2">
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={min}
          onChange={handleMinChange}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className="absolute w-full appearance-none bg-transparent pointer-events-none
                     [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-blue-500
                     [&::-webkit-slider-thumb]:border
                     [&::-webkit-slider-thumb]:border-white"
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={max}
          onChange={handleMaxChange}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className="absolute w-full appearance-none bg-transparent pointer-events-none
                     [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-blue-500
                     [&::-webkit-slider-thumb]:border
                     [&::-webkit-slider-thumb]:border-white"
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-sm mt-2 text-white">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
