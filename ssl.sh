#!/bin/bash

domains="./ssl-checker.widget/domains.txt"

function process {
  local result=$(echo | openssl s_client -servername $1 -connect $1:$2 2>/dev/null | openssl x509 -noout -enddate | awk -F= '/^notAfter/ { print $2; exit }')
  echo $(date -j -f "%b %d %T %Y %Z" "$result" +"%Y-%m-%d")
}

while IFS=':' read -r domain port; do
  if [ -n $domain ]; then
    echo $domain $(process $domain $port)
  fi
done <$domains