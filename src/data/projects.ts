import level1Img from '~/assets/projects/level1.jpg';
import poketraderImg from '~/assets/projects/poketrader.jpg';
import photograbertImg from '~/assets/projects/photograbert.jpg';
import junglepetImg from '~/assets/projects/junglepet.jpg';
import teahouseImg from '~/assets/projects/teahouse.jpg';

export interface Project {
  n: string;
  name: string;
  desc: string;
  longDesc: string;
  tech: string[];
  live: string;
  repo: string;
  image: ImageMetadata;
}

export const projects: Project[] = [
  {
    n: '01',
    name: 'Level-1',
    desc: 'AI Game Development Platform',
    longDesc:
      'Co-architected with a founding team. AI-powered game-creation studio that turns natural language into playable 2D / 3D Godot games via a multi-agent orchestrator and atomic-writer agents — built with React, a Node orchestration backend, LangGraph, and Anthropic + OpenAI APIs.',
    tech: ['React', 'TypeScript', 'Node', 'LangGraph', 'Claude API', 'Godot'],
    live: 'https://app.level-1.dev',
    repo: 'https://github.com/Lucastirbat/GameCraft',
    image: level1Img,
  },
  {
    n: '02',
    name: 'Poketrader',
    desc: 'Pokémon Trading Platform',
    longDesc:
      'Built collaboratively with a small team. Trading platform for Pokémon TCG collectors with real-time inventory, fair-trade matching, and authenticated card valuation — partnered on backend, auth, and UX.',
    tech: ['React', 'Express', 'MongoDB', 'AWS S3'],
    live: 'http://poke-trader-frontend.s3-website.us-east-2.amazonaws.com/login',
    repo: 'https://github.com/Albuhrrito/poketrader',
    image: poketraderImg,
  },
  {
    n: '03',
    name: 'ThePhotograbert',
    desc: 'Personal Photography Portfolio',
    longDesc:
      'A solo photography-first portfolio with full-bleed galleries, custom lightbox, and zero-JS image grids that load instantly on mobile.',
    tech: ['HTML', 'CSS', 'JS'],
    live: 'https://photograbert.com',
    repo: 'https://github.com/Albuhrrito/ThePhotograbertPortfolio',
    image: photograbertImg,
  },
  {
    n: '04',
    name: 'JunglePet AI',
    desc: 'AI Coach for League of Legends',
    longDesc:
      'AI-powered coaching app that ingests a player\'s last 20 ranked League of Legends matches via the Riot API, aggregates KDA / CS / vision / champion-pool stats, and streams personalized feedback from Google Gemini 2.0 Flash through a conversational chat UI. Includes a demo mode with sample data, a rule-based fallback when AI is unavailable, and a stateless Cloudflare Workers CORS proxy so no API keys ever sit on a server.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Gemini API', 'Cloudflare Workers', 'Riot API'],
    live: 'https://albuhrrito.github.io/JunglePet-AI/',
    repo: 'https://github.com/Albuhrrito/JunglePet-AI',
    image: junglepetImg,
  },
  {
    n: '05',
    name: "Tea N' Me",
    desc: 'Boba Tea Studio Website',
    longDesc:
      'Partnered with the shop owners on this boba studio site — menu, ordering flow, and a custom drink-builder that previews builds in real time. Iterated copy and layout directly with the team.',
    tech: ['HTML', 'CSS', 'JS'],
    live: 'https://albuhrrito.github.io/TeaNMeWebsite/',
    repo: 'https://github.com/Albuhrrito/TeaNMeWebsite',
    image: teahouseImg,
  },
];
