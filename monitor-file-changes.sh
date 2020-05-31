#!/bin/bash

SECONDS_TO_WAIT=5

function current_time_in_sec() {
  echo `date -u +"%s"`
}

last_updated_sec=$(current_time_in_sec)

fswatch -o -0 ./ ./lib | while read -d "" event
do
  current_sec=$(current_time_in_sec)
  diff_sec="$(($current_sec-$last_updated_sec))"

  if [ "$diff_sec" -gt "$SECONDS_TO_WAIT" ]; then
    ./prepare-package.sh

    last_updated_sec=$(current_time_in_sec)
  fi
done
