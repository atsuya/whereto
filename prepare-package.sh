#!/bin/bash

DIST_DIRECTORY_PATH=`pwd`"/dist"
LIBRARY_DIRECTORY_PATH="${DIST_DIRECTORY_PATH}/lib"
TLDJS_UGLIFIED_PATH="${DIST_DIRECTORY_PATH}/vendor/tldjs/tld.min.js"

echo -e "Preparing files for distribution..."

#
# clean up the directory
#
mkdir -p ${DIST_DIRECTORY_PATH}
rm -rf ${DIST_DIRECTORY_PATH}/*

#
# copy files
#

# vendors
#if [ ! -f "${TLDJS_UGLIFIED_PATH}" ]; then
#  printf "\tTLDJS doesn't exist, generating..."
#
#  tldjs_directory_path=$(dirname "${TLDJS_UGLIFIED_PATH}")
#  mkdir -p ${tldjs_directory_path}
#  npx browserify node_modules/tldjs/index.js --s tldjs | npx uglifyjs -c -o ${TLDJS_UGLIFIED_PATH}
#
#  printf "Done\n"
#fi

# libraries
mkdir -p ${LIBRARY_DIRECTORY_PATH}

cp ./lib/request-manager.js ${LIBRARY_DIRECTORY_PATH}

npx browserify ./lib/domain-utility.js --s DomainUtility -o ${LIBRARY_DIRECTORY_PATH}/domain-utility.js
#cp ./lib/domain-utility.js ${LIBRARY_DIRECTORY_PATH}

# other files
cp ./background.js ${DIST_DIRECTORY_PATH}
cp ./LICENSE ${DIST_DIRECTORY_PATH}
cp ./manifest.json ${DIST_DIRECTORY_PATH}
cp ./popup.css ${DIST_DIRECTORY_PATH}
cp ./popup.html ${DIST_DIRECTORY_PATH}
cp ./popup.js ${DIST_DIRECTORY_PATH}
cp ./README.md ${DIST_DIRECTORY_PATH}

echo -e "Done"
