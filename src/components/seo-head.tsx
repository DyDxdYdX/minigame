import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export function SEOHead({
  title = "MiniGame - Free Online Mini Games Collection",
  description = "Play free online mini games including Sudoku, Minesweeper, and Sliding Puzzle. No downloads, no ads, just pure fun!",
  keywords = "free games, online games, mini games, sudoku, minesweeper, sliding puzzle, browser games",
  ogImage = "https://minigame.dydxsoft.my/favicon.png",
  canonicalUrl = "https://minigame.dydxsoft.my/",
  structuredData
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', canonicalUrl, true);
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', ogImage, true);
    updateMetaTag('twitter:url', canonicalUrl, true);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    
    // Add structured data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
    
  }, [title, description, keywords, ogImage, canonicalUrl, structuredData]);
  
  return null; // This component doesn't render anything
}

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "MiniGame - Free Online Mini Games Collection | Sudoku, Minesweeper & More",
    description: "Play free online mini games including Sudoku, Minesweeper, and Sliding Puzzle. No downloads, no ads, just pure fun! Browser-based games for all skill levels.",
    keywords: "free games, online games, mini games, sudoku, minesweeper, sliding puzzle, browser games, puzzle games, strategy games",
    canonicalUrl: "https://minigame.dydxsoft.my/"
  },
  
  games: {
    title: "Free Online Games Collection | MiniGame",
    description: "Browse our collection of free online mini games. Play Sudoku, Minesweeper, Sliding Puzzle and more. No downloads required, play instantly in your browser.",
    keywords: "free online games, game collection, browser games, mini games, puzzle games, strategy games",
    canonicalUrl: "https://minigame.dydxsoft.my/games"
  },
  
  sudoku: {
    title: "Free Online Sudoku Game | Multiple Difficulty Levels | MiniGame",
    description: "Play free Sudoku online with easy, medium, and hard difficulty levels. Classic number puzzle game with clean interface. No downloads required.",
    keywords: "sudoku, free sudoku, online sudoku, sudoku game, number puzzle, logic puzzle, brain game",
    canonicalUrl: "https://minigame.dydxsoft.my/games/sudoku",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Game",
      "name": "Sudoku",
      "description": "Free online Sudoku game with multiple difficulty levels",
      "genre": "Puzzle",
      "gamePlatform": "Web Browser",
      "operatingSystem": "Any",
      "applicationCategory": "Game"
    }
  },
  
  minesweeper: {
    title: "Free Online Minesweeper Game | Classic Mine Sweeper | MiniGame",
    description: "Play the classic Minesweeper game online for free. Three difficulty levels: Beginner, Intermediate, and Expert. Test your deduction skills!",
    keywords: "minesweeper, mine sweeper, free minesweeper, online minesweeper, strategy game, logic game",
    canonicalUrl: "https://minigame.dydxsoft.my/games/minesweeper",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Game",
      "name": "Minesweeper",
      "description": "Classic Minesweeper game with three difficulty levels",
      "genre": "Strategy",
      "gamePlatform": "Web Browser",
      "operatingSystem": "Any",
      "applicationCategory": "Game"
    }
  },
  
  slidingPuzzle: {
    title: "Free Online Sliding Puzzle Game | Number Tile Puzzle | MiniGame",
    description: "Play the classic sliding puzzle game online. Arrange numbered tiles in order by sliding them into the empty space. Multiple grid sizes available.",
    keywords: "sliding puzzle, tile puzzle, number puzzle, sliding tile game, 15 puzzle, brain teaser",
    canonicalUrl: "https://minigame.dydxsoft.my/games/sliding-puzzle",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Game",
      "name": "Sliding Puzzle",
      "description": "Classic sliding tile puzzle game with multiple grid sizes",
      "genre": "Puzzle",
      "gamePlatform": "Web Browser",
      "operatingSystem": "Any",
      "applicationCategory": "Game"
    }
  },
  
  about: {
    title: "About MiniGame - Free Online Games Platform | DyDxSoft",
    description: "Learn about MiniGame, a free online games platform by DyDxSoft. No ads, no payments, just pure gaming fun with classic mini games.",
    keywords: "about minigame, dydxsoft, free games platform, online games developer",
    canonicalUrl: "https://minigame.dydxsoft.my/about"
  }
};
