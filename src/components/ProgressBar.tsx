const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full h-6 bg-neutral-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-pink-600 text-white text-sm font-medium flex items-center justify-end transition-all duration-300 pr-2 rounded-full"
        style={{
          width: `${progress}%`,
        }}
      >
        <p className="text-xs">{progress}%</p>
      </div>
    </div>
  );
};

export default ProgressBar;
