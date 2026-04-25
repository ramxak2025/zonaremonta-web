interface Props {
  className?: string;
}

/** Простая выпуклая иконка телефона. */
export function PhoneIcon({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M3.5 2h3.7c.6 0 1.1.4 1.2 1l1 4.4c.1.5-.1 1-.5 1.3l-2 1.6c1.4 2.7 3.6 4.9 6.3 6.3l1.6-2c.3-.4.8-.6 1.3-.5l4.4 1c.6.1 1 .6 1 1.2v3.7c0 .7-.6 1.3-1.3 1.3C10.7 21.3 2.7 13.3 2.2 3.3 2.2 2.6 2.8 2 3.5 2z" />
    </svg>
  );
}

interface SmallProps {
  className?: string;
}

/** WhatsApp brand icon (одноцветная). */
export function WhatsAppIcon({ className = '' }: SmallProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M19.05 4.91A10 10 0 0 0 4.06 18.05L3 22l4.06-1.05a10 10 0 0 0 11.99-15.99zM12 20.13a8.13 8.13 0 0 1-4.14-1.13l-.3-.18-2.43.63.65-2.36-.19-.3a8.12 8.12 0 1 1 6.42 3.34zm4.43-6.07-.36-.18c-.49-.24-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.78-.77.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.41-.55-.41-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.83.81-.83 1.97 0 1.16.85 2.28.97 2.44.12.16 1.67 2.55 4.05 3.58.57.25 1.01.39 1.36.5.57.18 1.09.16 1.5.1.46-.07 1.41-.58 1.61-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

/** Yandex маяк / звезда — упрощённая для рейтинга. */
export function YandexIcon({ className = '' }: SmallProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle cx="12" cy="12" r="11" fill="#FFCC00" />
      <path d="M13.4 4.5c-3.1 0-5.5 2.5-5.5 5.7 0 2.4 1.4 4.4 3.5 5.4l-3.6 4.4h2.6l3.4-4.6h.6V20h2.4V4.5h-3.4zm0 2v6.7h-.6c-1.5 0-2.7-1.4-2.7-3.4s1.2-3.3 3.3-3.3z"
        fill="#000"
      />
    </svg>
  );
}

export function TwoGisIcon({ className = '' }: SmallProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle cx="12" cy="12" r="11" fill="#0E9D59" />
      <text
        x="12" y="16"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="#fff"
      >2ГИС</text>
    </svg>
  );
}
