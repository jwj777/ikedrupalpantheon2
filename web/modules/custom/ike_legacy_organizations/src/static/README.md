 
# Pre-requisites

1. Node.js (https://nodejs.org/download)
2. NPM `sudo npm install npm -g`
3. Coffeescript `npm install -g grunt-cli`

## Instructions

* $ cd lpapp/static
* Edit `package.json` if neccessary 
* $ bundle install
* $ bower install
* $ npm install
* $ grunt



### Grunt/Bower setup and usage
* if you have JS files that are missing a coffee source and watch to batch convert JS files to Coffee
* $ sudo npm install js2coffee -g
* $ sh js2coffee.sh


### Run Compass / Complile SASS without Grunt

    # Path that contains the config.rb
    cd path/to/project/legacy/static/src/sass
    compass watch
    or
    compass compile
    

### Compile COFFEESCRIPT without Grunt

    # Path to static directory
    cd path/to/project/legacy/static
    coffee -o js/ -cw src/coffee
    
    
### Validate Video assets

Before uploading video assets, drag and drop file onto blank browser window for each major browser. If the content doesn't work, download [Free MP4 Converter](https://itunes.apple.com/us/app/free-mp4-converter/id693443591?mt=12) and reexport file ensuring it is h.264 with AAC or MP3 encoding. Repeat browser validation until the file plays in all browsers.