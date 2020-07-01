#!/bin/bash

#
# Licensed under MIT
# (https://github.com/atsuya/whereto/blob/master/LICENSE)
#

BUILD_DIRECTORY_PATH=`pwd`"/build"

echo -e "Building files..."

#
# clean up the directory
#
mkdir -p ${BUILD_DIRECTORY_PATH}
rm -rf ${BUILD_DIRECTORY_PATH}/*

#
# build files
#
npx rollup --config ./rollup.config.js

#
# copy files
#

# other files
cp ./LICENSE ${BUILD_DIRECTORY_PATH}
cp ./manifest.json ${BUILD_DIRECTORY_PATH}
cp ./popup.css ${BUILD_DIRECTORY_PATH}
cp ./popup.html ${BUILD_DIRECTORY_PATH}
cp ./README.md ${BUILD_DIRECTORY_PATH}
cp ./images/*.png ${BUILD_DIRECTORY_PATH}

echo -e "Done"
