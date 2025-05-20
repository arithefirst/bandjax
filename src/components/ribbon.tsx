interface RibbonProps {
  color: 'bronze' | 'silver' | 'gold';
  className?: string;
}

export function Ribbon({ color, className }: RibbonProps) {
  function getText() {
    switch (color) {
      case 'bronze':
        return '3RD';
      case 'silver':
        return '2ND';
      case 'gold':
        return '1ST';
    }
  }

  const medalClasses = {
    bronze: ['from-amber-500 to-amber-700', 'border-amber-700'],
    silver: ['from-gray-200 to-gray-400', 'border-gray-400'],
    gold: ['from-yellow-400 to-amber-600', 'border-amber-600'],
  };

  return (
    <div className={'relative h-[24rem] w-64 ' + className}>
      <div className={'relative flex size-64 rounded-full bg-gradient-to-br shadow-lg ' + medalClasses[color][0]}>
        <span className="absolute top-1/2 left-1/2 z-10 -translate-1/2 text-6xl font-bold">{getText()}</span>
        <div
          className={
            'absolute top-1/2 left-1/2 size-60 -translate-1/2 rounded-full border-8 ' + medalClasses[color][1]
          }
        ></div>
        <div className="absolute top-[10%] left-[10%] size-[30%] rounded-full bg-white opacity-20 blur-sm"></div>
      </div>

      <div className="absolute top-29 left-8.5 -z-1 h-64 w-20 rotate-18 bg-gradient-to-b from-blue-400 to-blue-600 shadow-md"></div>
      <div className="absolute top-29 right-8.5 -z-1 h-64 w-20 -rotate-18 bg-gradient-to-b from-blue-400 to-blue-600 shadow-md"></div>
      <div className="absolute top-32 left-1/2 -z-2 h-64 w-24 -translate-x-1/2 bg-gradient-to-b from-blue-600 to-blue-800"></div>
    </div>
  );
}
