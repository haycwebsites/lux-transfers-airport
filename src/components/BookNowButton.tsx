import AppLink from './AppLink';
import { useHayc } from '../hayc/config-context';
import ArrowIcon from './ArrowIcon';
interface BookNowButtonProps {
  labelPath: string;
  label: string;
  variant?: 'primary' | 'light';
  className?: string;
}

export default function BookNowButton({
  labelPath,
  label,
  variant = 'primary',
  className = '',
}: BookNowButtonProps) {
  const { config, cp } = useHayc();
  const href = config.navigationConfig.bookNowHref;
  const btnClass =
    variant === 'light'
      ? 'btn btn-light rounded-pill text-black p-3 d-inline-flex align-items-center gap-2 btn-with-arrow'
      : 'btn btn-primary rounded-pill text-white p-3 d-inline-flex align-items-center gap-2 me-2 btn-with-arrow';

  return (
    <AppLink to={href} className={`${btnClass} ${className}`}>
      <span className="px-3" {...cp(labelPath)}>{label}</span>
      <ArrowIcon className={variant === 'light' ? 'text-black' : 'text-light'} />
    </AppLink>
  );
}
