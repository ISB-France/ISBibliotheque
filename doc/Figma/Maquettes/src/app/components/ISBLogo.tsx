export function ISBLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="8" fill="#3B2800" />
      <rect x="7" y="8" width="4" height="20" rx="2" fill="#FFDD00" />
      <path
        d="M14 14C14 11.79 15.79 10 18 10H24C26.21 10 28 11.79 28 14C28 16.21 26.21 18 24 18C26.21 18 28 19.79 28 22C28 24.21 26.21 26 24 26H18C15.79 26 14 24.21 14 22V14Z"
        fill="#FFDD00"
      />
      <rect x="14" y="17" width="10" height="1.5" rx="0.75" fill="#3B2800" />
    </svg>
  );
}
