#!/bin/bash

PROJECT_NAME="paras-frontend-marketplace"

REGION="asia-southeast1"
GCP_PROJECT="silicon-topic-345907"
DOCKER_REGISTRY_NAME="docker-registry"
ARTIFACT_REPOSITORY="${REGION}-docker.pkg.dev/${GCP_PROJECT}/${DOCKER_REGISTRY_NAME}"

CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
LAST_COMMIT=$(git rev-parse HEAD)
GIT_STATUS=$(git status -s)
IMAGE_NAME="${PROJECT_NAME}-${CURRENT_BRANCH_NAME}"

FIND="/"
REPLACE="-"
IMAGE_NAME=${IMAGE_NAME//$FIND/$REPLACE} 

REPOSITORY="${ARTIFACT_REPOSITORY}/${IMAGE_NAME}"
REPOSITORY_WITH_TAG="${ARTIFACT_REPOSITORY}/${IMAGE_NAME}:${LAST_COMMIT}"

if [ "$GIT_STATUS" != "" ]; then
	echo "Please commit the current changes before creating the image!"
	exit
fi

echo "Checking image.."
IMAGE_LIST=$(gcloud artifacts docker images list "${REPOSITORY}" --include-tags --quiet)

if [[ $IMAGE_LIST =~ "$LAST_COMMIT" ]]; then
	echo "Current commit version is already created.."
	echo "$REPOSITORY_WITH_TAG"
	exit
fi

echo "Ok"
 
docker build . -t "${REPOSITORY_WITH_TAG}"
docker push "${REPOSITORY_WITH_TAG}"

echo "$REPOSITORY_WITH_TAG"
