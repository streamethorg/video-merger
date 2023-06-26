import { Config } from 'remotion';
import { webpackOverride } from './src/webpack-override';

Config.setImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setBrowserExecutable('~/Applications/Google Chrome.app');

Config.overrideWebpackConfig(webpackOverride);
