# in an instance

IS_NEW=$1

npm install --production
node bulk-prepare.js

if $IS_NEW; then 
  bash bootstrap.sh
fi

years=("2020" "2019" "2018" "2017" "2016" "2015" "2014" "2013" "2012" "2011")
for year in ${years[@]}; do
  bash bulk-index.sh bulk-data/$year.txt
done
