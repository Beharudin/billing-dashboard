// Reusable Info Field Component
interface InfoFieldProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className = "",
}) => (
  <div
    className={`flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg ${className}`}
  >
    <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
      {label}
    </span>
    <span className="text-sm text-gray-900 dark:text-slate-100">{value}</span>
  </div>
);

export default InfoField;
