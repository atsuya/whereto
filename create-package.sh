#!/bin/bash

BUILD_DIRECTORY_PATH=`pwd`"/build"
TEMP_DIRECTORY_PATH=`pwd`"/tmp"
DIST_DIRECTORY_PATH=`pwd`"/dist"
DIST_FILE_PATH="${DIST_DIRECTORY_PATH}/whereto-"`date -u +"%s"`".zip"

echo -e "Preparing a package..."

#
# prepare directories
#
mkdir -p ${DIST_DIRECTORY_PATH}

rm -rf ${TEMP_DIRECTORY_PATH}
mkdir -p ${TEMP_DIRECTORY_PATH}


#
# build files first
#
npx rollup --config ./rollup.config.js

#
# copy files
#
cp -r ${BUILD_DIRECTORY_PATH}/* ${TEMP_DIRECTORY_PATH}

#
# remove sroucemap files
#
rm ${TEMP_DIRECTORY_PATH}/*.map

#
# zip them up
#
zip -r ${DIST_FILE_PATH} ${TEMP_DIRECTORY_PATH}

echo -e "Done"
