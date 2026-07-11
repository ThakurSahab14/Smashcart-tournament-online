export default function KartIcon({ className = "", color = "#00E5FF" }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="52" rx="46" ry="4" fill="black" opacity="0.35" />
      <path
        d="M10 40 Q14 20 34 18 L78 18 Q96 18 106 34 L108 40 Z"
        fill={color}
      />
      <path d="M34 18 L44 8 L74 8 L78 18 Z" fill="#0B0E14" opacity="0.85" />
      <rect x="46" y="10" width="20" height="8" rx="2" fill={color} opacity="0.6" />
      <circle cx="30" cy="42" r="10" fill="#0B0E14" />
      <circle cx="30" cy="42" r="5" fill="#3A4152" />
      <circle cx="90" cy="42" r="10" fill="#0B0E14" />
      <circle cx="90" cy="42" r="5" fill="#3A4152" />
      <rect x="6" y="26" width="10" height="6" rx="2" fill="#FF2E92" />
    </svg>
  );
}
