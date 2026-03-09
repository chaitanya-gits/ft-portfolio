type Occasion = 'campus' | 'studio' | 'evening';
type Mood = 'minimal' | 'neutral' | 'contrast';

interface OutfitOption {
  id: string;
  title: string;
  pieces: string[];
  rationale: string;
  palette: string[];
  preferredTemp: [number, number];
  occasions: Occasion[];
  moods: Mood[];
  rainSafe: boolean;
}

interface PlannerState {
  temperature: number;
  occasion: Occasion;
  mood: Mood;
  rainSafeRequired: boolean;
}

interface PlannerElements {
  root: HTMLElement;
  tempInput: HTMLInputElement;
  tempValue: HTMLElement;
  occasionSelect: HTMLSelectElement;
  moodSelect: HTMLSelectElement;
  rainToggle: HTMLInputElement;
  resultTitle: HTMLElement;
  resultReason: HTMLElement;
  resultItems: HTMLElement;
  paletteStrip: HTMLElement;
  confidenceLabel: HTMLElement;
  confidenceFill: HTMLElement;
  altList: HTMLElement;
}

const OUTFIT_OPTIONS: OutfitOption[] = [
  {
    id: 'graphite-core',
    title: 'Graphite Core Uniform',
    pieces: ['Boxy charcoal tee', 'Cropped black trouser', 'Minimal leather sneakers', 'Silver watch'],
    rationale: 'A stable monochrome base for warm city days with a clean silhouette.',
    palette: ['#111111', '#2A2A2A', '#5A5A5A', '#B8B8B8', '#E7E2D8'],
    preferredTemp: [24, 35],
    occasions: ['campus', 'studio'],
    moods: ['minimal', 'contrast'],
    rainSafe: false,
  },
  {
    id: 'linen-neutral',
    title: 'Linen Neutral Layer',
    pieces: ['Ecru overshirt', 'Stone wide trouser', 'Textured tee', 'Tan derby shoes'],
    rationale: 'Soft neutrals with breathable materials for long indoor studio sessions.',
    palette: ['#EDE7DA', '#D6CABB', '#BFAF9E', '#8A7A6A', '#2F2A25'],
    preferredTemp: [20, 32],
    occasions: ['studio', 'evening'],
    moods: ['neutral'],
    rainSafe: false,
  },
  {
    id: 'contrast-grid',
    title: 'Contrast Grid Set',
    pieces: ['White structured shirt', 'Black pleated trouser', 'Grey utility vest', 'Monochrome trainers'],
    rationale: 'High contrast with geometric layering for presentation-heavy days.',
    palette: ['#FFFFFF', '#DCDCDC', '#7F7F7F', '#232323', '#0B0B0B'],
    preferredTemp: [18, 30],
    occasions: ['campus', 'evening'],
    moods: ['contrast', 'minimal'],
    rainSafe: true,
  },
  {
    id: 'rain-shell',
    title: 'Rain Shell Capsule',
    pieces: ['Waterproof shell jacket', 'Tech fabric trouser', 'Quick-dry tee', 'Rubber sole boots'],
    rationale: 'Built for uncertain weather while keeping the palette disciplined.',
    palette: ['#0F1418', '#2D3A45', '#5E6B75', '#9FA8AE', '#E9ECEE'],
    preferredTemp: [16, 28],
    occasions: ['campus', 'studio', 'evening'],
    moods: ['minimal', 'neutral'],
    rainSafe: true,
  },
  {
    id: 'night-studio',
    title: 'Night Studio Balance',
    pieces: ['Light knit layer', 'Mid-grey trouser', 'Dark overshirt', 'Leather loafers'],
    rationale: 'Balanced temperature control for late evening sessions and meetings.',
    palette: ['#151515', '#373737', '#606060', '#A2A2A2', '#EEE8DD'],
    preferredTemp: [17, 26],
    occasions: ['studio', 'evening'],
    moods: ['neutral', 'contrast'],
    rainSafe: false,
  },
];

function queryPlannerElements(): PlannerElements | null {
  const root = document.getElementById('realtimePlanner');
  if (!(root instanceof HTMLElement)) {
    return null;
  }

  const tempInput = document.getElementById('tempInput');
  const tempValue = document.getElementById('tempValue');
  const occasionSelect = document.getElementById('occasionSelect');
  const moodSelect = document.getElementById('moodSelect');
  const rainToggle = document.getElementById('rainToggle');
  const resultTitle = document.getElementById('resultTitle');
  const resultReason = document.getElementById('resultReason');
  const resultItems = document.getElementById('resultItems');
  const paletteStrip = document.getElementById('paletteStrip');
  const confidenceLabel = document.getElementById('confidenceLabel');
  const confidenceFill = document.getElementById('confidenceFill');
  const altList = document.getElementById('altList');

  if (
    !(tempInput instanceof HTMLInputElement) ||
    !(tempValue instanceof HTMLElement) ||
    !(occasionSelect instanceof HTMLSelectElement) ||
    !(moodSelect instanceof HTMLSelectElement) ||
    !(rainToggle instanceof HTMLInputElement) ||
    !(resultTitle instanceof HTMLElement) ||
    !(resultReason instanceof HTMLElement) ||
    !(resultItems instanceof HTMLElement) ||
    !(paletteStrip instanceof HTMLElement) ||
    !(confidenceLabel instanceof HTMLElement) ||
    !(confidenceFill instanceof HTMLElement) ||
    !(altList instanceof HTMLElement)
  ) {
    return null;
  }

  return {
    root,
    tempInput,
    tempValue,
    occasionSelect,
    moodSelect,
    rainToggle,
    resultTitle,
    resultReason,
    resultItems,
    paletteStrip,
    confidenceLabel,
    confidenceFill,
    altList,
  };
}

function readState(elements: PlannerElements): PlannerState {
  return {
    temperature: Number(elements.tempInput.value),
    occasion: elements.occasionSelect.value as Occasion,
    mood: elements.moodSelect.value as Mood,
    rainSafeRequired: elements.rainToggle.checked,
  };
}

function calculateMatchScore(state: PlannerState, outfit: OutfitOption): number {
  let score = 0;

  const [minTemp, maxTemp] = outfit.preferredTemp;
  if (state.temperature >= minTemp && state.temperature <= maxTemp) {
    score += 50;
  } else {
    const tempDistance = Math.min(Math.abs(state.temperature - minTemp), Math.abs(state.temperature - maxTemp));
    score += Math.max(10, 50 - tempDistance * 4);
  }

  if (outfit.occasions.includes(state.occasion)) {
    score += 25;
  }

  if (outfit.moods.includes(state.mood)) {
    score += 20;
  }

  if (!state.rainSafeRequired || outfit.rainSafe) {
    score += 5;
  } else {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

function renderRecommendation(elements: PlannerElements, topOutfit: OutfitOption, confidence: number): void {
  elements.resultTitle.textContent = topOutfit.title;
  elements.resultReason.textContent = topOutfit.rationale;

  elements.resultItems.innerHTML = topOutfit.pieces
    .map((piece) => `<div class="reco-item">${piece}</div>`)
    .join('');

  elements.paletteStrip.innerHTML = topOutfit.palette
    .map((color) => `<div class="palette-swatch" style="background:${color}"></div>`)
    .join('');

  elements.confidenceLabel.textContent = `Match confidence — ${confidence}%`;
  elements.confidenceFill.style.width = `${confidence}%`;
}

function renderAlternatives(elements: PlannerElements, rankedOutfits: Array<{ outfit: OutfitOption; score: number }>): void {
  const alternatives = rankedOutfits.slice(1, 4);

  elements.altList.innerHTML = alternatives
    .map(({ outfit, score }) => `<li><strong>${outfit.title}</strong> — ${score}% match</li>`)
    .join('');
}

function updatePlanner(elements: PlannerElements): void {
  const state = readState(elements);
  elements.tempValue.textContent = `${state.temperature}°C`;

  const rankedOutfits = OUTFIT_OPTIONS.map((outfit) => ({
    outfit,
    score: calculateMatchScore(state, outfit),
  })).sort((left, right) => right.score - left.score);

  const top = rankedOutfits[0];
  if (!top) {
    return;
  }

  renderRecommendation(elements, top.outfit, top.score);
  renderAlternatives(elements, rankedOutfits);
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = queryPlannerElements();
  if (!elements) {
    return;
  }

  const update = (): void => updatePlanner(elements);

  elements.tempInput.addEventListener('input', update);
  elements.occasionSelect.addEventListener('change', update);
  elements.moodSelect.addEventListener('change', update);
  elements.rainToggle.addEventListener('change', update);

  update();
});
