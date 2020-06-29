#!/usr/bin/env bash
dir="/usr/share/jitsi-meet/"
file="index.html"

if [[ $# -eq 0 ]]; then
        dir=${dir}
fi

cp recorder.html ${dir}/static
cp recorder.js ${dir}/static
echo Copied recorder files to ${dir}static

file=${dir}${file}

if grep -q '<!--#include virtual="static\/recorder.html" -->' ${file}; then
        echo Local recorder already exists in ${file}
else
        sed -i '/<div id="react"><\/div>/a\    <!--#include virtual="static\/recorder.html" -->' ${file}
        echo inserted recorder into ${file}
fi
