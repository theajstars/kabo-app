interface ProgressCircleProps {
  size?: string;
  className?: string;
}

export default function ProgressCircle({
  size,
  className,
}: ProgressCircleProps) {
  return (
    <span
      className={`flex-row align-center justify-center ${className} px-${size}`}
    >
      <i className="far fa-spinner-third fa-spin"></i>
    </span>
  );
}
