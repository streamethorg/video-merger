import { staticFile, delayRender, continueRender } from 'remotion';

// Global
export const G_EVENT = 'FtC';
export const G_TEMPLATE = 'BaseOneIntro';
export const G_LOGO_PICTURE = '/images/FtC.svg';
export const G_FPS = 25;
export const G_VIDEO_PATH = '/videos/stream.mp4';
export const G_ANIMATION_PATH = '/animations/ProtocolBerg_animation.mp4';
export const G_AUDIO_PATH = '/audio/522_short1_cream-soda-day_0018_preview.mp3';
export const G_DEFAULT_AVATAR_URL = staticFile('/images/ETHLogo.jpg');

/// / Please check Google Font what weights you can use
// export const { fontFamily } = loadFont('normal', {
//     weights: ['600', '400'],
// });

/// / Use the following if you have a none-Google Font
const waitForFont = delayRender();
const fontCaps = new FontFace(
    `Latin Modern Caps`,
    `url('${staticFile(
        '/font/lmromancaps10-regular.otf',
    )}') format('opentype')`,
);

fontCaps
    .load()
    .then(() => {
        document.fonts.add(font);
    })
    .catch((err) => {
        console.log('Error loading font', err);
    });

const font = new FontFace(
    `Latin Modern`,
    `url('${staticFile('/font/lmroman10-regular.otf')}') format('opentype')`,
);

font.load()
    .then(() => {
        document.fonts.add(font);
        continueRender(waitForFont);
    })
    .catch((err) => {
        console.log('Error loading font', err);
    });

/// / Advanced
export const G_SCALE_IMAGE = 2;

// Base template 1
/// / Simple
export const BASE1_LEFT_COLOUR = '#00F839';
export const BASE1_RIGHT_COLOUR = '#0DFBFF';

// Base template 2
/// / Simple
