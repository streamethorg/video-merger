import { staticFile, delayRender, continueRender } from 'remotion';

// Global Constants
export const G_EVENT: string = 'FtC';
export const G_TEMPLATE: string = 'BaseOneIntro';
export const G_LOGO_PICTURE: string = '/images/FtC.svg';
export const G_FPS: number = 25;
export const G_VIDEO_PATH: string = '/videos/stream.mp4';
export const G_ANIMATION_PATH: string = '/animations/ProtocolBerg_animation.mp4';
export const G_AUDIO_PATH: string = '/audio/522_short1_cream-soda-day_0018_preview.mp3';
export const G_DEFAULT_AVATAR_URL: string = staticFile('/images/ETHLogo.jpg');

// Colors for Base Templates
export const BASE1_LEFT_COLOUR: string = '#00F839';
export const BASE1_RIGHT_COLOUR: string = '#0DFBFF';

// Advanced Config
export const G_SCALE_IMAGE: number = 2;

// Function to load a font
const loadFont = async (fontName: string, fontPath: string): Promise<void> => {
  const waitForFont = delayRender();

  try {
    const font = new FontFace(fontName, `url('${staticFile(fontPath)}') format('truetype')`);
    await font.load();
    document.fonts.add(font);
    continueRender(waitForFont);
  } catch (err) {
    console.log(`Error loading font ${fontName}`, err);
  }
};

// Load fonts
loadFont('Latin Modern Caps', '/fonts/LM-bold.ttf');
loadFont('Latin Modern', '/fonts/LM-regular.ttf');
