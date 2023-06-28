#!/bin/bash
codeDir=/mnt/Dev/Code/javascript/zougui/src
testPattern=*.spec.*
confPattern=*.config.*
jsonPattern=*.json
sort=files

titleColor="\033[31m"
subtitleColor="\033[94m"
reset="\033[0m"

text () {
  echo -e "$1$2${reset}"
}

code () {
  tokei $@ --exclude=$testPattern --exclude=$confPattern --exclude=$jsonPattern --sort=$sort
}

text $subtitleColor "Zougui repo"
code $codeDir/packages $codeDir/projects
