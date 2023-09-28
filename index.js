const { program } = require('commander');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

program
    .requiredOption('-i, --input <file>', 'input file')
    .requiredOption('-o, --output <file>', 'output file')
    .option('-b, --bitrate <rate>', 'video bitrate')
    .option('--bassboost <value>', 'video bass boost')
    .option('-v, --volume <value>', 'video volume boost')
    .option('-f, --fps <value>', 'video framerate')
    .option('-r, --resolution <value>', 'video resolution')

program.parse(process.argv);

const options = program.opts();

console.log("Starting compression...\n")
fs.mkdirSync("./temp");
const mainCompression = ffmpeg(options.input)
    .outputOptions([
        '-preset veryfast',
        `-minrate ${options.bitrate || 1}`,
        `-maxrate ${options.bitrate || 1}`,
        `-bufsize ${options.bitrate || 1}`,
    ])
    .videoBitrate(options.bitrate || 1)
    .audioFilter(`bass=g=${options.bassboost || '5'}`)
    .audioFilter(`volume=${options.volume || '5'}dB`)
    .audioBitrate('1')
    .fps(options.fps || 5)
    .size(options.resolution || '100x100')
    .format('webm')
    .save('./temp/temp.webm');


mainCompression.on('end', () => {
    console.log('Main compression finished, re-encoding...\n');
    finishCompress.run();
});

mainCompression.on('error', (err) => {
    console.error("Error in mainCompression:" + err);
});

const finishCompress = ffmpeg("./temp/temp.webm")
    .size('1920x1080')
    .videoBitrate(1)
    .fps(30)
    .output(options.output);

finishCompress.on('end', () => {
    console.log(`Finished compressing! Outputted to ${options.output}`);
    fs.rmSync("./temp", { recursive: true, force: true });
});
finishCompress.on('error', (err) => {
    console.error("Error in finishCompress:" + err);
});
