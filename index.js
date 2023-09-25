const { program } = require('commander');
const ffmpeg = require('fluent-ffmpeg');

program
    .requiredOption('-i, --input <file>', 'input file')
    .requiredOption('-o, --output <file>', 'output file')
    .option('-b, --bitrate <rate>', 'video bitrate')
    .option('--bassboost <value>', 'video bass boost')
    .option('-v, --volume <value>', 'video volume boost');
// TODO add more options

program.parse(process.argv);

const options = program.opts();

console.log('Input file: ', options.input);
console.log('Output file: ', options.output);


const command = ffmpeg(options.input)
    .videoBitrate(options.bitrate || '1')
    .audioFilter(`bass=g=${options.bassboost || '5'}`)
    .audioFilter(`volume=${options.volume || '5'}dB`)
    .audioCodec('libmp3lame')
    .audioBitrate('2')
    .fps(5)
    .size('320x240')
    .output(options.output);

command.on('end', () => {
    console.log('Finished processing');
});

command.on('error', (err) => {
    console.error(err);
});

command.run();