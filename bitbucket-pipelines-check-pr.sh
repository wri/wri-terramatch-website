#!/bin/bash
# exit when any command fails
set -e

DESTINATION_BRANCH=${1}
SOURCE_BRANCH=${2}
REPO_NAME=${3}
CHATBOT_KEY=${4}
PR_ID=${5}
CHATBOT_CHANNEL_ID=${6}

informSlack () {
    curl -sS -k --location 'https://slack.com/api/chat.postMessage' \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer ${CHATBOT_KEY}" \
    --data '{"channel":"'${CHATBOT_CHANNEL_ID}'", "text":":warning: Hey <!subteam^SR7AGDR41>, Please check bitbucket, a PR has been setup for: \n\n - '$SOURCE_BRANCH' -> '$DESTINATION_BRANCH'\n - https://bitbucket.org/'${REPO_NAME}'/pull-requests/'${PR_ID}' \n "}' > temp.log
}

printf "\nPull Request Checks for ${SOURCE_BRANCH} -> ${DESTINATION_BRANCH} \n\n";

if [[ "${SOURCE_BRANCH}" = "develop" || "${SOURCE_BRANCH}" = "staging" ]]
then 
    printf "\t Checking if ${SOURCE_BRANCH} is allowed to be merged into ${DESTINATION_BRANCH} \n"
    if [[ $DESTINATION_BRANCH == *"release"*  || $DESTINATION_BRANCH == *"support"* ]]; then
        printf "\t ERROR: This is not allowed! Please double check! \n\n"
        informSlack
        exit 1
    fi
else
    printf "\t All good! \n\n"
fi

