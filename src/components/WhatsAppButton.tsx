import { useHayc } from '../hayc/config-context';

export default function WhatsAppButton() {
  const { t, config, cp } = useHayc();
  const wa = config.whatsAppConfig;

  return (
    <a
      href={`https://wa.me/${wa.phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="ht-ctc ht-ctc-chat ctc-analytics"
      {...cp('whatsAppConfig.label')}
    >
      <span className="ht-ctc-text">{t(wa.label)}</span>
    </a>
  );
}
