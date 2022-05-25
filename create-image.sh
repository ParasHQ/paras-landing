#!/bin/bash

BUILD_ENV=$1

if ([ -z "$BUILD_ENV" ])
  then
	echo "Argument BUILD_ENV (develop, testnet, mainnet) is required"
	echo "Example: ./create-image.sh develop"
	exit
fi

if ([ ! -e ".env.${BUILD_ENV}" ])
  then
	echo "errors.file .env.${BUILD_ENV} is not exist"
	exit
fi

if ([ ! -e ".sentryclirc" ])
  then
	echo "errors.file .sentryclirc is not exist"
	exit
fi

PROJECT_NAME="paras-frontend-marketplace_${BUILD_ENV}"

REGION="asia-southeast1"
GCP_PROJECT="silicon-topic-345907"
DOCKER_REGISTRY_NAME="docker-registry"
ARTIFACT_REPOSITORY="${REGION}-docker.pkg.dev/${GCP_PROJECT}/${DOCKER_REGISTRY_NAME}"

CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
LAST_COMMIT=$(git rev-parse HEAD)
GIT_STATUS=$(git status -s)
IMAGE_NAME="${PROJECT_NAME}_${CURRENT_BRANCH_NAME}"

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

echo "OK.."
echo "Creating image and push to artifact.."

docker build . -t "${REPOSITORY_WITH_TAG}" --build-arg var_name="${BUILD_ENV}"
docker push "${REPOSITORY_WITH_TAG}"

echo "$REPOSITORY_WITH_TAG"
