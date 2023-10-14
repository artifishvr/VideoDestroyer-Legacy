const { program } = require('commander');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const SnowflakeCodon = require('snowflake-codon');

const snowflakeGenerator = new SnowflakeCodon();

program
    .requiredOption('-i, --input <file>', 'Input file (any format supported by ffmpeg)')
    .requiredOption('-o, --output <file>', 'Output file (.mp4)')
    .option('-l, --layers <count>', '# of compression layers', '1')
    .option('-b, --bitrate <rate>', 'Video bitrate', '1')
    .option('-ab, --audiobitrate <rate>', 'Audio bitrate', '1')
    .option('-bb, --bassboost <amount>', 'Video bassboost', '5')
    .option('-v, --volume <volume>', 'Video volume', '5')
    .option('-f, --fps <fps>', 'Video framerate', '5')
    .option('-r, --resolution <WxH>', 'Video resolution', '100x100')

program.parse(process.argv);

const options = program.opts();

console.log("Compressing...\n")
if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

(async () => {
    let snowflake;

    for (let i = 0; i < options.layers; i++) {
        snowflake = snowflakeGenerator.nextId();
        await compressvideo(snowflake);
        console.log(`Finished layer ${i + 1}/${options.layers}...\n`);
    }

    const finishCompress = ffmpeg(`./temp/${snowflake}.webm`)
        .size('1920x1080')
        .videoBitrate(1)
        .fps(30)
        .save(options.output);

    finishCompress.on('start', () => {
        console.log(`Started final re-encode`);
    });

    finishCompress.on('end', () => {
        console.log(`\rFinished compressing! Saved to ${options.output}`);
        fs.rmSync("./temp", { recursive: true, force: true });
    });
    finishCompress.on('error', (err) => {
        console.error("Error in finishCompress:" + err);
    });

    function compressvideo(snowflake) {
        return new Promise((resolve, reject) => {
            const mainCompression = ffmpeg(options.input)
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
                .size(options.resolution)
                .format('webm')
                .save(`./temp/${snowflake}.webm`);

            mainCompression.on('error', (err) => {
                reject(err);
            });

            mainCompression.on('end', () => {
                resolve();
            });
        });
    }

})();