#!/bin/bash

command=$1
if [ "$command" = "" ]; then
    command="cells"
fi

RECIPES=$($command -lr |grep " - "|cut -d " " -f 4 -f 6)

SAVEIFS=$IFS
IFS=$'\n'

for recipe in $RECIPES; do
    module=$(echo $recipe|cut -d " " -f 1)
    version=$(echo $recipe|cut -d " " -f 2|grep "\."|grep -v ")")
    if [ "$version" != "" ]; then
        lastversion=$(npm info $module|grep "version:"|cut -d "'" -f 2)
        echo "module: $module -> v.real: $version - v.last: $lastversion"
        if [ "$version" != "$lastversion" ]; then
            echo "installing $module ..."
            npm install -g $module
        fi
    fi
done