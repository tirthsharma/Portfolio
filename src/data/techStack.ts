import premiereProLogo from '../assets/software/premiere-pro.svg';
import afterEffectsLogo from '../assets/software/after-effects.svg';
import blenderLogo from '../assets/software/blender.svg';
import photoshopLogo from '../assets/software/photoshop.svg';
import illustratorLogo from '../assets/software/illustrator.svg';
import figmaLogo from '../assets/software/figma.svg';
import higgsfieldLogo from '../assets/software/higgsfield.svg';
import claudeLogo from '../assets/software/claude.svg';

export interface TechStackItem {
  id: string;
  name: string;
  logo: string;
}

export const techStackData: TechStackItem[] = [
  { id: 'premiere-pro', name: 'PREMIERE PRO', logo: premiereProLogo },
  { id: 'after-effects', name: 'AFTER EFFECTS', logo: afterEffectsLogo },
  { id: 'blender', name: 'BLENDER', logo: blenderLogo },
  { id: 'photoshop', name: 'PHOTOSHOP', logo: photoshopLogo },
  { id: 'illustrator', name: 'ILLUSTRATOR', logo: illustratorLogo },
  { id: 'figma', name: 'FIGMA', logo: figmaLogo },
  { id: 'higgsfield', name: 'HIGGSFIELD', logo: higgsfieldLogo },
  { id: 'claude', name: 'CLAUDE', logo: claudeLogo },
];
