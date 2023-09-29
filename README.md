<img 
    style="display: block; 
           margin-left: auto;
           margin-right: auto;
           width: 128px"
    src="icon.png" 
    alt=":3 icon">
</img>
<h1 align="center">VideoDestroyer</h1>
<p align="center">absolutely destroy the quality of video files in mere seconds</p>

## Example Video

<video width="640" height="360" controls>
  <source src="example.mp4" type="video/mp4">
</video>

([original video](https://youtu.be/MyoOuhsgB04))

## Installation (From Release)
- Get [ffmpeg](https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip) and add it to your PATH
- Download the VideoDestroyer executable from the [releases](https://github.com/artificialbutter/VideoDestroyer/releases/) page
- Run the executable from the command line `videodestroyer --help`

## Installation (From Source)
### Requirements
- [ffmpeg](https://ffmpeg.org/download.html)
- [nodejs](https://nodejs.org/en/download/) with npm
- [git](https://git-scm.com/downloads)

### Steps
1. Clone the repository with `git clone https://github.com/artificialbutter/VideoDestroyer.git`
2. Install dependencies with `npm ci`
3. Run the program with `node index.js --help`