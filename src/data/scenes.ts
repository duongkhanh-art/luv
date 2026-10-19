import { SceneInfo } from '../types';

export const SCENES: SceneInfo[] = [
  {
    id: 1,
    name: 'The Playful Pout',
    subtitle: 'Arms crossed, puffed cheeks & nervous boy',
    caption: '0-3s: The girl stands with arms crossed, cheeks puffed, pouting playfully with an anger mark pulsing. The boy sits nervously with sweat drops.',
    startTime: 0,
    endTime: 3,
    imageSrc: '/src/assets/images/chibi_scene_pout_1792422806125.jpg',
    themeColor: '#ff85a1',
    dialogue: {
      speaker: 'girl',
      text: 'Hmph! Someone was late again... I am very mad! 💢',
    },
  },
  {
    id: 2,
    name: 'Comical Tap & Sweet Apology',
    subtitle: 'A gentle poke & a small pink ribbon box',
    caption: '3-6s: The girl gives him a comical tap on the shoulder. The boy squints, smiles sheepishly, and presents a gift. Her anger mark turns into a heart!',
    startTime: 3,
    endTime: 6,
    imageSrc: '/src/assets/images/chibi_scene_gift_1792422807923.jpg',
    themeColor: '#f72585',
    dialogue: {
      speaker: 'boy',
      text: 'P-please don’t be mad! Look, I got you your favorite surprise... 🎁✨',
    },
  },
  {
    id: 3,
    name: 'Queen of His Heart',
    subtitle: 'Royal throne, golden crown & loving gaze',
    caption: '6-10s: The girl happily accepts the gift and sits on a cute miniature throne with a tiny crown. The boy sits beside her, gazing lovingly with floating hearts and flower petals.',
    startTime: 6,
    endTime: 10,
    imageSrc: '/src/assets/images/chibi_scene_queen_1792422808977.jpg',
    themeColor: '#b5179e',
    dialogue: {
      speaker: 'girl',
      text: 'Hehe! Because you are sweet, Her Majesty grants you full forgiveness! 👑💖',
    },
  },
];
