// src/components/ui/progress.tsx
export function Progress({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}
    >
      <div
        className="bg-deep-mocha h-2.5 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
