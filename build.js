const exe = require('@angablue/exe');
const pjson = require('./package.json');

const build = exe({
    entry: './index.js',
    out: './dist/VideoDestroyer.exe',
    version: pjson.version,
    target: 'node16-win',
    icon: './icon.ico',
    properties: {
        FileDescription: 'destroy the quality of videos in seconds! infinite entertainment!',
        ProductName: 'VideoDestroyer',
        OriginalFilename: 'VideoDestroyer.exe',
        LegalCopyright: 'https://github.com/artificialbutter/VideoDestroyer'
    }
});

build.then(() => console.log('Build completed!'));