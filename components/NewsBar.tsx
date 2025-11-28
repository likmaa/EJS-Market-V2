'use client';

import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

const DEFAULT_TEXT =
  'Livraison Gratuite en Europe dès 100€ ⚡️ Nouveaux Robots Husqvarna en stock ⚡️ -10% sur Apple avec le code EJS10 ⚡️';

export function NewsBar() {
  const [text, setText] = useState<string>(DEFAULT_TEXT);

  useEffect(() => {
    let isMounted = true;

    async function loadNewsBar() {
      try {
        const res = await fetch('/api/settings/newsbar');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && typeof data.newsBarText === 'string' && data.newsBarText.trim().length > 0) {
          setText(data.newsBarText.trim());
        }
      } catch {
        // On garde le texte par défaut en cas d'erreur
      }
    }

    loadNewsBar();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-black-deep text-white py-2 overflow-hidden w-full">
      <Marquee speed={50} gradient={false} pauseOnHover={false} className="text-sm font-medium">
        <span className="mx-8 whitespace-nowrap">{text}</span>
        <span className="mx-8 whitespace-nowrap">{text}</span>
        <span className="mx-8 whitespace-nowrap">{text}</span>
      </Marquee>
    </div>
  );
}

