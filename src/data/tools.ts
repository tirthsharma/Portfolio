import premiereProLogo from '../assets/tools/premiere-pro.jpg';
import afterEffectsLogo from '../assets/tools/after-effects.png';
import davinciLogo from '../assets/tools/davinci.png';
import blenderLogo from '../assets/tools/blender.png';
import photoshopLogo from '../assets/tools/photoshop.png';
import illustratorLogo from '../assets/tools/illustrator.svg';
import figmaLogo from '../assets/tools/figma.svg';
import higgsfieldLogo from '../assets/tools/higgsfield.png';
import claudeLogo from '../assets/tools/claude.svg';

export interface ToolItem {
  id: string;
  name: string;
  logo: string;
}

export const toolsData: ToolItem[] = [
  { id: 'premiere-pro', name: 'Adobe Premiere Pro', logo: premiereProLogo },
  { id: 'after-effects', name: 'Adobe After Effects', logo: afterEffectsLogo },
  { id: 'davinci-resolve', name: 'DaVinci Resolve', logo: davinciLogo },
  { id: 'blender', name: 'Blender', logo: blenderLogo },
  { id: 'photoshop', name: 'Adobe Photoshop', logo: photoshopLogo },
  { id: 'illustrator', name: 'Adobe Illustrator', logo: illustratorLogo },
  { id: 'figma', name: 'Figma', logo: figmaLogo },
  { id: 'higgsfield', name: 'Higgsfield', logo: higgsfieldLogo },
  { id: 'claude', name: 'Claude', logo: claudeLogo },
];
