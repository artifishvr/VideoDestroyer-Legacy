import { program } from 'npm:commander';
import pjson  from './package.json' with { type: "json" };
import ffmpeg from 'npm:fluent-ffmpeg';
import fs from 'node:fs';

program
    .name('VideoDestroyer')
    .requiredOption('-i, --input <file>', 'Input file (any format supported by ffmpeg)')
    .requiredOption('-o, --output <file>', 'Output file (.mp4)')
    .option('-l, --layers <count>', '# of compression layers', '1')
    .option('-b, --bitrate <rate>', 'Video bitrate', '1')
    .option('-ab, --audiobitrate <rate>', 'Audio bitrate', '1')
    .option('-bb, --bassboost <amount>', 'Video bassboost', '5')
    .option('-v, --volume <volume>', 'Video volume', '5')
    .option('-f, --fps <fps>', 'Video framerate', '5')
    .option('-r, --resolution <WxH>', 'Video resolution (useless setting)', '100x100')
    .version(pjson.version)

if (program.args.length === 0) program.help();

program.parse(process.argv);

const options = program.opts();

console.log("Compressing...\n")
if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

function isEven(n) {
    return (n % 2 == 0);
}

(async () => {
    let snowflake;
    snowflake = "temp"

    for (let i = 0; i < options.layers; i++) {
        let resOverride;

        if (i > 0 && isEven(i)) resOverride = '100x100';
        if (i > 0 && !isEven(i)) resOverride = '1080x720';
        if (i < 1) await compressvideo(options.input, resOverride, i);

        if (i > 0) await compressvideo(`./temp/${snowflake}.webm`, resOverride, i);
        console.log(`Finished layer ${i + 1}/${options.layers}...`);
    }

    const finishCompress = ffmpeg(`./temp/${snowflake}.webm`)
        .size('1080x720')
        .videoBitrate(1)
        .fps(30)
        .save(options.output);

    finishCompress.on('start', () => {
        console.log(`Started final re-encode`);
    });

    finishCompress.on('end', () => {
        console.log(`\nFinished compressing! Saved to ${options.output}`);
        fs.rmSync("./temp", { recursive: true, force: true });
    });
    finishCompress.on('error', (err) => {
        console.error("Error in finishCompress:" + err);
    });

    function compressvideo(compressPath, resOverride, index) {
        return new Promise((resolve, reject) => {
            const mainCompression = ffmpeg(compressPath)
                .outputOptions([
                    '-preset veryfast',
                    `-minrate ${options.bitrate}`,
                    `-maxrate ${options.bitrate}`,
                    `-bufsize ${options.bitrate}`,
                ])
                .videoBitrate(options.bitrate)
                .audioFilter(`bass=g=${options.bassboost}`)
                .audioFilter(`volume=${options.volume}dB`)
                .audioBitrate(options.audiobitrate)
                .fps(options.fps)
                .size(resOverride || options.resolution)
                .format('webm')
                .save(`./temp/${index}.webm`);
            snowflake = `${index}`

            mainCompression.on('error', (err) => {
                reject(err);
            });

            mainCompression.on('end', () => {
                resolve();
            });
        });
    }

})();