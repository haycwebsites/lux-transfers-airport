import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  children?: ReactNode;
};

export function scrollToHash(hash: string, delayMs = 100) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return;

  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, delayMs);
}

function parseTo(to: string) {
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    return { external: true as const, path: to, hash: '' };
  }

  const hashIndex = to.indexOf('#');
  if (hashIndex === -1) {
    return { external: false as const, path: to, hash: '' };
  }

  return {
    external: false as const,
    path: to.slice(0, hashIndex) || '/',
    hash: to.slice(hashIndex + 1),
  };
}

function collapseMobileNav() {
  const el = document.getElementById('myNavbar1');
  if (!el?.classList.contains('show')) return;
  el.classList.remove('show');
  document.querySelector('[data-bs-target="#myNavbar1"]')?.setAttribute('aria-expanded', 'false');
}

export default function AppLink({ to, onClick, children, ...rest }: AppLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { external, path, hash } = parseTo(to);

  if (external) {
    return (
      <a href={to} {...rest} onClick={onClick}>
        {children}
      </a>
    );
  }

  const href = hash ? `${path}#${hash}` : path;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    if (!hash) return;

    e.preventDefault();
    collapseMobileNav();

    const targetHash = `#${hash}`;
    if (location.pathname === path && location.hash === targetHash) {
      scrollToHash(targetHash, 0);
      return;
    }

    navigate({ pathname: path, hash: targetHash });
  };

  if (hash) {
    return (
      <a href={href} {...rest} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link
      to={path}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) collapseMobileNav();
      }}
    >
      {children}
    </Link>
  );
}
