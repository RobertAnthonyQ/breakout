"use client";

const links = [
  { label: "About Us", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Community", href: "#community" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Join", href: "#join" },
];

interface NavLinksProps {
  onLinkClick?: () => void;
  className?: string;
  linkClassName?: string;
}

export default function NavLinks({
  onLinkClick,
  className,
  linkClassName,
}: NavLinksProps) {
  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={
            linkClassName ??
            "text-white hover:text-gray-300 transition-colors text-sm font-semibold uppercase tracking-[0.15em]"
          }
        >
          {link.label}
        </a>
      ))}
    </>
  );
}
