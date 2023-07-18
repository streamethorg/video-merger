import { Config } from '@remotion/cli/config';
import { webpackOverride } from './src/webpack-override';

Config.setCrf(1);
Config.setJpegQuality(100);
Config.setOverwriteOutput(true);
Config.setBrowserExecutable('~/Applications/Google Chrome.app');

Config.overrideWebpackConfig(webpackOverride);
