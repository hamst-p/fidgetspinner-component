import { useRef, useEffect, useState } from 'react';

const FidgetSpinner = () => {
  const spinnerRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [momentum, setMomentum] = useState(0);

  const getAngle = (e) => {
    const rect = spinnerRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return Math.atan2(clientY - center.y, clientX - center.x) * 180 / Math.PI;
  };

  const handleStart = (e) => {
    e.preventDefault();
    setIsSpinning(true);
    setStartAngle(getAngle(e));
  };

  const handleMove = (e) => {
    if (!isSpinning) return;
    e.preventDefault();
    
    const currentAngle = getAngle(e);
    let delta = currentAngle - startAngle;
    
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setCurrentRotation(prev => prev + delta);
    setMomentum(delta);
    setStartAngle(currentAngle);
  };

  const handleEnd = () => {
    setIsSpinning(false);
  };

  useEffect(() => {
    let animationId;
    
    const animate = () => {
      if (!isSpinning && Math.abs(momentum) > 0.01) {
        setMomentum(prev => prev * 0.98);
        setCurrentRotation(prev => prev + momentum);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [momentum, isSpinning]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isSpinning, startAngle]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div 
        ref={spinnerRef} 
        className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] select-none"
      >
        <div 
          className="absolute w-full h-full select-none"
          style={{ transform: `rotate(${currentRotation}deg)` }}
        >
          <img 
            src="/fidget.png" 
            alt="Fidget Spinner"
            className="w-full h-full select-none pointer-events-none"
            draggable="false"
          />
          {/* Three drag handles for the arms */}
          <div 
            className="absolute w-24 h-24 md:w-32 md:h-32 cursor-grab select-none"
            style={{ 
              top: '5%', 
              left: '50%', 
              transform: 'translateX(-50%)',
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          />
          <div 
            className="absolute w-24 h-24 md:w-32 md:h-32 cursor-grab select-none"
            style={{ 
              bottom: '15%', 
              left: '15%', 
              transform: 'rotate(120deg)',
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          />
          <div 
            className="absolute w-24 h-24 md:w-32 md:h-32 cursor-grab select-none"
            style={{ 
              bottom: '15%', 
              right: '15%', 
              transform: 'rotate(-120deg)',
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          />
        </div>
      </div>
    </div>
  );
};

export default FidgetSpinner;