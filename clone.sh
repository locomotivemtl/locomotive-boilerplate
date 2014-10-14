# !/bin/bash

if [ "$#" -ne 1 ]
then
	echo "Usage: \"sh clone.sh {project-name}\"";
	exit 1
fi

echo "Creating project \"$1\"";

project=$1

mkdir $project 2> /dev/null;
cp -R project-x/* $project 2> /dev/null;
cp project-x/.* $project 2> /dev/null;
find $project/ -type d -name .svn -exec rm {} \; 2> /dev/null;
find $project/ -type d -name node_modules -exec rm -rf {} \; 2> /dev/null;

#find $1/ -name *boilerplate*  -exec sed -i -e 's/boilerplate/$1/g' {} \;
module=$project;
module="$(tr '[:lower:]' '[:upper:]' <<< ${module:0:1})${module:1}"

for file in $(grep -irl "boilerplate" $project/*)
do
	sed -e "s/boilerplate/$project/g" $file > /tmp/clone-$project-tempfile.tmp;
	mv /tmp/clone-$project-tempfile.tmp $file;
done

for file in $(grep -irl "Boilerplate" $project/*)
do
	sed -e "s/Boilerplate/$module/g" $file > /tmp/clone-$project-tempfile.tmp;
	mv /tmp/clone-$project-tempfile.tmp $file;
done

find $project/ -name "*boilerplate*" | while read f; do 
  mv "$f" "${f/boilerplate/$project}" 2> /dev/null;
done

find $project/ -name "*boilerplate*" | while read f; do 
  mv "$f" "${f/boilerplate/$project}" 2> /dev/null;
done
