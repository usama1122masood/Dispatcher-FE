import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";

export type StatusType = 'online' | 'busy' | 'offline';
export const getStatusTextColor = (status: StatusType) => {
  switch (status) {
    case 'online':
      return 'text-success';
    case 'busy':
      return 'text-danger';
    case 'offline':
      return 'text-gray-400';
  }
};

export const getStatusBadgeColor = (status: StatusType) => {
  switch (status) {
    case 'online':
      return 'bg-success';
    case 'busy':
      return 'bg-danger';
    case 'offline':
      return 'bg-gray-400';
  }
};
type Props = {
  status: StatusType;
  className?: string;
}

export const StatusBadge = ({ status, className }: Props) => {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  return <div className={`w-3 h-3 rounded-full border ${isDarkMode ? 'border-gray-600' : 'border-white'} ${getStatusBadgeColor(status)} ${className}`} />
};