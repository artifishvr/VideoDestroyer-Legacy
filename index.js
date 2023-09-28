const { program } = require('commander');
const ffmpeg = require('fluent-ffmpeg');

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

console.log('Input file: ', options.input);
console.log('Output file: ', options.output);


const command = ffmpeg(options.input)
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
    .output(options.output);

const command2 = ffmpeg(options.output)
    .size('1920x1080')
    .videoBitrate(1)
    .output(options.output + "2.mp4");

command.on('end', () => {
    console.log('Finished processing, doing it again');
    command2.run();
});

command.on('error', (err) => {
    console.error(err);
});

command.run();

command2.on('end', () => {
    console.log('Finished processing');
});
command2.on('error', (err) => {
    console.error(err);
});