##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################

SHELL=/bin/bash

export USE_TTY := $(shell test -t 1 && USE_TTY="-t")

export OS_TYPE := $(shell cat /etc/os-release | grep -E '^NAME=' | sed 's/^.*debian.*$$/DEB/I;s/^.*ubuntu.*$$/DEB/I;s/^.*fedora.*$$/RPM/I;s/.*centos.*$$/RPM/I;')

#search-ui
export PORT=8083

#AB-switch (in percent)
#currently used for backend / no backend test
export AB_THRESHOLD=100

#google analytics disable by default
export GOOGLE_ANALYTICS_ID=

export MAKEBIN = $(shell which make || echo make)
export MAKE = ${MAKEBIN} --no-print-directory -s

#base paths
export APP = deces-ui
export DATASET=fichier-des-personnes-decedees
export APP_GROUP = matchID
export APP_PATH := $(shell pwd)
export APP_DNS=deces.matchid.io
export API_EMAIL?=matchid.project@gmail.com
export FRONTEND := ${APP_PATH}
export FRONTEND_DEV_HOST = frontend-development
export FRONTEND_DEV_PORT = ${PORT}
# export LOG_BUCKET = s3bucket/override/me
# export STATS_BUCKET = s3bucket/override/me
# export LOG_DB_BUCKET = s3bucket/override/me
# export PROOFS_BUCKET = s3bucket/override/me
export LOG_DIR = ${FRONTEND}/log/mirror
export LOG_DB_DIR = ${FRONTEND}/log/db
export STATS_SCRIPTS = ${FRONTEND}/stats/src
export STATS_UPDATE_DAYS = 35
export STATS = ${FRONTEND}/stats/public
export BACKEND_PORT=8080
export BACKEND_HOST=backend
export BACKEND_JOB_CONCURRENCY=2
export BACKEND_CHUNK_CONCURRENCY=4
export BACKEND_LOG_LEVEL=error
export BACKEND_TOKEN_USER?=${API_EMAIL}
export BACKEND_TOKEN_KEY?=$(shell openssl rand -base64 16)
export BACKEND_TOKEN_PASSWORD?=$(shell openssl rand -base64 16)
export SMTP_HOST=smtp
export SMTP_PORT=25
export SMTP_USER?=${API_EMAIL}
export SMTP_PWD?=$(shell echo $$RANDOM )
export API_PATH = deces
export BACKEND_PROXY_PATH=/${API_PATH}/api/v1
export NGINX = ${APP_PATH}/nginx
export NGINX_TIMEOUT = 30
export API_TIMEOUT = 45
export NGINX_CSP=default-src https: 'self';script-src https: 'self' 'unsafe-inline';style-src https: 'self' 'unsafe-inline';font-src 'self' data:;img-src 'self' data: https://a.basemaps.cartocdn.com https://b.basemaps.cartocdn.com https://c.basemaps.cartocdn.com https://upload.wikimedia.org;
#export NGINX_CSP=default-src https: 'self' 'unsafe-inline' 'unsafe-eval';font-src 'self' data:;img-src 'self' data: https://*.cartocdn.com http://*.wikimedia.org https://www.google-analytics.com https://www.googletagmanager.com https://*.doubleclick.net;
export API_SEARCH_LIMIT_RATE=1r/s
export API_SEARCH_USER_BURST=30 nodelay
export API_SEARCH_GLOBAL_LIMIT_RATE=20r/s
export API_SEARCH_GLOBAL_BURST=400 nodelay
export API_BULK_SUBMIT_LIMIT_RATE=4r/m
export API_BULK_SUBMIT_BURST=4 nodelay
export API_MISC_LIMIT_RATE=2r/s
export API_MISC_USER_BURST=7 nodelay
export API_MISC_GLOBAL_LIMIT_RATE=5r/s
export API_MISC_GLOBAL_BURST=40 nodelay
export API_AGG_LIMIT_RATE=30r/m
export API_AGG_USER_BURST=15 nodelay
export API_AGG_GLOBAL_LIMIT_RATE=1r/s
export API_AGG_GLOBAL_BURST=15 nodelay
export API_DOWNLOAD_LIMIT_RATE=30r/m
export API_USER_SCOPE=http_x_forwarded_for
export API_READ_TIMEOUT=3600
export API_SEND_TIMEOUT=1200
export API_MAX_BODY=100m
export MITM_URL=/mitm/mitm.html
export THEME_DNUM=0
export API_TEST_PATH = ${API_PATH}/api/v1/search
export API_TEST_JSON_PATH=response
export API_TEST_REQUEST={"fuzzy":"false","sort":[{"score":"desc"}],"page":1,"size":20,"scroll":"1m","firstName":"jean"}

export DC_DIR=${APP_PATH}
export DC_FILE=${DC_DIR}/docker-compose
export DC_PREFIX := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]' | tr '_' '-')
export DC_IMAGE_NAME = ${DC_PREFIX}
export DC_NETWORK := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]')
export DC_BUILD_ARGS = --pull --no-cache
export DC := docker-compose
export GIT_ORIGIN=origin
export GIT_BRANCH := $(shell git branch | grep '*' | awk '{print $$2}')
export GIT_BRANCH_MASTER=master
export GIT_DATAPREP = deces-dataprep
export GIT_BACKEND = deces-backend
export BACKEND_APP=${GIT_BACKEND}
export GIT_BACKEND_BRANCH = dev
export GIT_ROOT = https://github.com/matchid-project
export GIT_TOOLS = tools
export API_URL?=${APP_DNS}
export API_SSL?=1
export APP_NODES=1
# export KUBE_NAMESPACE:=$(shell echo -n ${APP_GROUP}-${APP}-${GIT_BRANCH} | tr '[:upper:]' '[:lower:]' | tr '_' '-')
export KUBE_DIR=${FRONTEND}/k8s
export ES_MEM_KUBE:=$(shell echo -n ${ES_MEM} | sed 's/\s*m/Mi/')
export STORAGE_ACCESS_KEY_B64:=$(shell echo -n ${STORAGE_ACCESS_KEY} | openssl base64)
export STORAGE_SECRET_KEY_B64:=$(shell echo -n ${STORAGE_SECRET_KEY} | openssl base64)


export PROOFS=${FRONTEND}/${GIT_BACKEND}/backend/data/proofs

# backup dir
export BACKUP_DIR = ${APP_PATH}/backup

# datagouv paths for downloading files
export DATAGOUV_PROXY_PATH = /${API_PATH}/api/v0/getDataGouvFile
export DATAGOUV_CATALOG_URL = https://www.data.gouv.fr/api/1/datasets/${DATASET}/
export DATAGOUV_RESOURCES_HOST = https://static.data.gouv.fr
export DATAGOUV_RESOURCES_PATH = resources/${DATASET}
export DATAGOUV_RESOURCES_URL = ${DATAGOUV_RESOURCES_HOST}/${DATAGOUV_RESOURCES_PATH}
export DATAGOUV_RESOURCES_PROXY = $(shell echo ${http_proxy} | sed 's|^$$|${DATAGOUV_RESOURCES_HOST}|;')
export DATAGOUV_RESOURCES_REWRITE_PATH := $(shell echo ${DATAGOUV_RESOURCES_HOST}/${DATAGOUV_RESOURCES_PATH} | sed 's|^${DATAGOUV_RESOURCES_PROXY}||')

# elasticsearch defaut configuration
export ES_HOST = elasticsearch
export ES_PORT = 9200
export ES_TIMEOUT = 60
export ES_INDEX = deces
export ES_MAX_RESULTS = 10000
export ES_DATA = ${APP_PATH}/esdata
export ES_NODES = 1
export ES_MEM = 512m
export ES_VERSION = 7.17.1
export ES_BACKUP_BASENAME := esdata
export DATAPREP_VERSION_FILE = ${APP_PATH}/.dataprep.sha1
export DATA_VERSION_FILE = ${APP_PATH}/.data.sha1
export FILES_TO_PROCESS=deces-([0-9]{4}|2022-m[0-9]{2}).txt.gz

vm_max_count            := $(shell cat /etc/sysctl.conf | egrep vm.max_map_count\s*=\s*262144 && echo true)


export STORAGE_BUCKET=${DATASET}
#prebuild image with docker and nginx-node-elasticsearch docker images
export SCW_IMAGE_ID=110f4bd4-85ca-494b-9337-12971c6f3b5f

dummy		    := $(shell touch artifacts)
include ./artifacts

export VERSION := $(shell cat tagfiles.version | xargs -I '{}' find {} -type f -not -name '*.tar.gz'  | sort | xargs cat | sha1sum - | sed 's/\(......\).*/\1/')

commit              := $(shell git describe --tags || cat VERSION )
tag                 := $(shell git describe --tags | sed 's/-.*//')
lastcommit          := $(shell touch .lastcommit && cat .lastcommit)
date                := $(shell date -I)

export APP_VERSION :=  ${tag}-${VERSION}

export FILE_FRONTEND_APP_VERSION = $(APP)-$(APP_VERSION)-frontend.tar.gz
export FILE_FRONTEND_DIST_APP_VERSION = $(APP)-$(APP_VERSION)-frontend-dist.tar.gz
export FILE_FRONTEND_DIST_LATEST_VERSION = $(APP)-latest-frontend-dist.tar.gz

export DOCKER_USERNAME=matchid
export DC_BUILD_FRONTEND = ${DC_FILE}-build.yml
export DC_RUN_NGINX_FRONTEND = ${DC_FILE}.yml
export BUILD_DIR=${APP_PATH}/${APP}-build

include /etc/os-release

version:
	@echo ${APP_VERSION}

config-minimal:
	@if [ -z "${TOOLS_PATH}" ];then\
		git clone ${GIT_ROOT}/${GIT_TOOLS};\
		${MAKE} -C ${APP_PATH}/${GIT_TOOLS} tools-install ${MAKEOVERRIDES};\
	else\
		ln -s ${TOOLS_PATH} ${APP_PATH}/${GIT_TOOLS};\
	fi

config-stats: geolite-city
	@if [ -z "$(wildcard /usr/lib/*/perl*/*/Date/Pcalc)" ] || \
		[ -z "$(wildcard /usr/lib/*/perl*/*/JSON/XS)" ] || \
		[ -z "$(wildcard /usr/lib/*/perl*/*/MaxMind/DB)" ]; then\
		if [ "${OS_TYPE}" = "DEB" ]; then\
			sudo apt-get install -yqq libdate-calc-perl libjson-xs-perl libmaxmind-db-reader-perl libmaxmind-db-reader-xs-perl libgeoip2-perl; true;\
		fi;\
		if [ "${OS_TYPE}" = "RPM" ]; then\
			sudo yum install -y perl-Date-Calc perl-Geo-IP perl-JSON-XS perl-Digest-SHA; true;\
		fi;\
	fi

config:
	@if [ -z "${TOOLS_PATH}" ];then\
		git clone ${GIT_ROOT}/${GIT_TOOLS};\
		${MAKE} -C ${APP_PATH}/${GIT_TOOLS} config ${MAKEOVERRIDES};\
	else\
		ln -s ${TOOLS_PATH} ${APP_PATH}/${GIT_TOOLS};\
	fi
	@cp artifacts ${APP_PATH}/${GIT_TOOLS}/
	@touch config


clean-data: elasticsearch-clean backup-dir-clean
	@sudo rm -rf ${APP_PATH}/${GIT_DATAPREP} ${DATA_VERSION_FILE} ${DATAPREP_VERSION_FILE}\
		${DATA_VERSION_FILE}.list > /dev/null 2>&1 || true

clean-frontend: rollup-clean build-dir-clean frontend-clean-dist frontend-clean-dist-archive

clean-backend: backend-clean-dir

clean-remote:
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-clean ${MAKEOVERRIDES} > /dev/null 2>&1 || true

clean-config:
	@rm -rf ${APP_PATH}/${GIT_TOOLS} ${APP_PATH}/aws config > /dev/null 2>&1 || true

clean-local: clean-data clean-frontend clean-backend clean-config

clean: clean-remote clean-local

docker-push:
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} docker-push DC_IMAGE_NAME=${DC_IMAGE_NAME} APP_VERSION=${APP_VERSION} ${MAKEOVERRIDES}

docker-pull:
	docker pull ${DOCKER_USERNAME}/${DC_IMAGE_NAME}:${APP_VERSION}

docker-check:
	@if [ ! -f ".${DOCKER_USERNAME}-${DC_IMAGE_NAME}:${APP_VERSION}" ]; then\
		(\
			(docker image inspect ${DOCKER_USERNAME}/${DC_IMAGE_NAME}:${APP_VERSION} > /dev/null 2>&1)\
			&& touch .${DOCKER_USERNAME}-${DC_IMAGE_NAME}:${APP_VERSION}\
		)\
		||\
		(\
			(docker pull ${DOCKER_USERNAME}/${DC_IMAGE_NAME}:${APP_VERSION} > /dev/null 2>&1)\
			&& touch .${DOCKER_USERNAME}-${DC_IMAGE_NAME}:${APP_VERSION}\
		)\
		|| (echo no previous build found for ${DOCKER_USERNAME}/${DC_IMAGE_NAME}:${APP_VERSION} && exit 1);\
	fi;

network-stop:
	docker network rm ${DC_NETWORK}

network: config
	@docker network create ${DC_NETWORK_OPT} ${DC_NETWORK} 2> /dev/null; true

backend-config:
	@if [ ! -d "${APP_PATH}/${GIT_BACKEND}" ]; then\
		cd ${APP_PATH};\
		git clone ${GIT_ROOT}/${GIT_BACKEND};\
		cd ${GIT_BACKEND};\
		git checkout ${GIT_BACKEND_BRANCH};\
	fi

backend-dev: backend-config
	@echo docker-compose up backend dev
	@${MAKE} -C ${APP_PATH}/${GIT_BACKEND} dev DC_NETWORK=${DC_NETWORK} GIT_BRANCH=${GIT_BACKEND_BRANCH}\
		API_URL=${API_URL} API_EMAIL=${API_EMAIL} API_SSL=${API_SSL}\
		BACKEND_JOB_CONCURRENCY=${BACKEND_JOB_CONCURRENCY} BACKEND_CHUNK_CONCURRENCY=${BACKEND_CHUNK_CONCURRENCY} BACKEND_TOKEN_USER=${BACKEND_TOKEN_USER} BACKEND_TOKEN_KEY=${BACKEND_TOKEN_KEY} BACKEND_TOKEN_PASSWORD=${BACKEND_TOKEN_PASSWORD}

backend-dev-stop:
	@${MAKE} -C ${APP_PATH}/${GIT_BACKEND} dev-stop DC_NETWORK=${DC_NETWORK} GIT_BRANCH=${GIT_BACKEND_BRANCH} API_URL=${API_URL} API_EMAIL=${API_EMAIL} API_SSL=${API_SSL}

backend-clean-version:
	rm backend-version

backend-docker-check: backend-config
	@BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	${MAKE} docker-check DC_IMAGE_NAME=deces-backend APP_VERSION=$$BACKEND_APP_VERSION GIT_BRANCH=${GIT_BACKEND_BRANCH}

backend: backend-config backend-docker-check proofs-mount
	@BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	${MAKE} -C ${APP_PATH}/${GIT_BACKEND} backend-start APP=deces-backend DC_NETWORK=${DC_NETWORK} APP_VERSION=$$BACKEND_APP_VERSION GIT_BRANCH=${GIT_BACKEND_BRANCH}\
		API_URL=${API_URL} API_EMAIL=${API_EMAIL} API_SSL=${API_SSL}\
		BACKEND_JOB_CONCURRENCY=${BACKEND_JOB_CONCURRENCY} BACKEND_CHUNK_CONCURRENCY=${BACKEND_CHUNK_CONCURRENCY} BACKEND_TOKEN_USER=${BACKEND_TOKEN_USER} BACKEND_TOKEN_KEY=${BACKEND_TOKEN_KEY} BACKEND_TOKEN_PASSWORD=${BACKEND_TOKEN_PASSWORD}

backend-stop:
	@BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	${MAKE} -C ${APP_PATH}/${GIT_BACKEND} backend-stop DC_NETWORK=${DC_NETWORK} APP_VERSION=$$BACKEND_APP_VERSION GIT_BRANCH=${GIT_BACKEND_BRANCH}
	@make proofs-umount

backend-clean-dir:
	@sudo rm -rf ${APP_PATH}/${GIT_BACKEND}

frontend-update:
	@cd ${FRONTEND}; git pull ${GIT_ORIGIN} ${GIT_BRANCH}

update: frontend-update

frontend-dev: clean-frontend
ifneq "$(commit)" "$(lastcommit)"
	@echo docker-compose up ${APP} frontend for dev after new commit ${APP_VERSION}
	${DC} -f ${DC_FILE}-dev.yml up -d
	@echo "${commit}" > ${FRONTEND}/.lastcommit
else
	@echo docker-compose up ${APP} frontend for dev
	${DC} -f  ${DC_FILE}-dev.yml up -d
endif

frontend-dev-stop:
	${DC} -f ${DC_FILE}-dev.yml down

dev: network frontend-stop elasticsearch backend-dev frontend-dev

dev-stop: frontend-dev-stop backend-dev-stop elasticsearch-stop

build: clean-frontend frontend-build nginx-build

rollup-clean:
	@sudo rm -rf public/build public/sw.js* public/workbox*

build-dir:
	@if [ ! -d "$(BUILD_DIR)" ] ; then mkdir -p $(BUILD_DIR) ; fi

build-dir-clean:
	@if [ -d "$(BUILD_DIR)" ] ; then (rm -rf $(BUILD_DIR) > /dev/null 2>&1) ; fi

${FRONTEND}/$(FILE_FRONTEND_APP_VERSION):
	( cd ${FRONTEND} && tar -zcvf $(FILE_FRONTEND_APP_VERSION) --exclude ${APP}.tar.gz \
		.eslintrc.js \
		rollup.config.js \
        src \
        public )

frontend-check-build:
	${DC} -f $(DC_BUILD_FRONTEND) config -q

frontend-build-dist: ${FRONTEND}/$(FILE_FRONTEND_APP_VERSION) frontend-check-build
	@echo building ${APP} frontend in ${FRONTEND}
	${DC} -f $(DC_BUILD_FRONTEND) build $(DC_BUILD_ARGS)

$(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION): build-dir
	${DC} -f $(DC_BUILD_FRONTEND) run -T --rm frontend-build tar czf - $$(basename /$(APP)/public) -C $$(dirname /$(APP)/public) > $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION)
	  cp $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION)
	if [ -f $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) ; fi
	if [ -f $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) ; fi

frontend-build: network frontend-build-dist $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION)

frontend-clean-dist:
	@rm -rf ${FRONTEND}/$(FILE_FRONTEND_APP_VERSION) > /dev/null 2>&1 || true

frontend-clean-dist-archive:
	@rm -rf ${FRONTEND}/$(FILE_FRONTEND_DIST_APP_VERSION) > /dev/null 2>&1 || true
	@rm -rf ${NGINX}/$(FILE_FRONTEND_DIST_APP_VERSION) > /dev/null 2>&1 || true

nginx-check-build:
	${DC} -f $(DC_RUN_NGINX_FRONTEND) config -q

nginx-build: $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) nginx-check-build
	@echo building ${APP} nginx
	cp $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) ${NGINX}/
	${DC} -f $(DC_RUN_NGINX_FRONTEND) build $(DC_BUILD_ARGS)

frontend-stop:
	${DC} -f ${DC_FILE}.yml down

frontend:
	@echo docker-compose up ${APP_GROUP} ${APP}
	@echo DATAGOUV PROXY: ${DATAGOUV_RESOURCES_PROXY}, RW: ${DATAGOUV_RESOURCES_REWRITE_PATH}
	${DC} -f ${DC_RUN_NGINX_FRONTEND} up -d
	@timeout=${NGINX_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (curl -s --fail -XGET localhost:${PORT} > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for nginx to start $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

stop: frontend-stop backend-stop elasticsearch-stop
	@echo all components stopped

start: elasticsearch backend frontend
	@sleep 2 && docker-compose logs

log:
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} docker-logs-to-API ${MAKEOVERRIDES} &

backup-dir:
	@if [ ! -d "$(BACKUP_DIR)" ] ; then mkdir -p $(BACKUP_DIR) ; fi

backup-dir-clean:
	@if [ -d "$(BACKUP_DIR)" ] ; then (rm -rf $(BACKUP_DIR) > /dev/null 2>&1 || true) ; fi

elasticsearch-storage-pull: backup-dir ${DATAPREP_VERSION_FILE} ${DATA_VERSION_FILE}
	@\
	DATAPREP_VERSION=$$(cat ${DATAPREP_VERSION_FILE});\
	DATA_VERSION=$$(cat ${DATA_VERSION_FILE});\
	ES_BACKUP_FILE=${ES_BACKUP_BASENAME}_$${DATAPREP_VERSION}_$${DATA_VERSION}.tar;\
	if [ ! -f "${BACKUP_DIR}/$$ES_BACKUP_FILE" ];then\
		echo pulling ${STORAGE_BUCKET}/$$ES_BACKUP_FILE;\
		${MAKE} -C ${APP_PATH}/${GIT_TOOLS} storage-pull\
			FILE=$$ES_BACKUP_FILE DATA_DIR=${BACKUP_DIR}\
			STORAGE_BUCKET=${STORAGE_BUCKET} STORAGE_ACCESS_KEY=${STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${STORAGE_SECRET_KEY};\
	fi

elasticsearch-stop:
	@echo docker-compose down matchID elasticsearch
	@if [ -f "${DC_FILE}-elasticsearch-huge.yml" ]; then ${DC} -f ${DC_FILE}-elasticsearch-huge.yml down;fi

elasticsearch-restore: elasticsearch-stop elasticsearch-storage-pull
	@if [ -d "$(ES_DATA)" ] ; then (echo purging ${ES_DATA} && sudo rm -rf ${ES_DATA} && echo purge done) ; fi
	@\
	DATAPREP_VERSION=$$(cat ${DATAPREP_VERSION_FILE});\
	DATA_VERSION=$$(cat ${DATA_VERSION_FILE});\
	ESBACKUPFILE=${ES_BACKUP_BASENAME}_$${DATAPREP_VERSION}_$${DATA_VERSION}.tar;\
	if [ ! -f "${BACKUP_DIR}/$$ESBACKUPFILE" ];then\
		(echo no such archive "${BACKUP_DIR}/$$ESBACKUPFILE" && exit 1);\
	else\
		echo restoring from ${BACKUP_DIR}/$$ESBACKUPFILE to ${ES_DATA} && \
		sudo tar xf ${BACKUP_DIR}/$$ESBACKUPFILE -C $$(dirname ${ES_DATA}) && \
		echo backup restored;\
	fi;

elasticsearch-clean: elasticsearch-stop
	@sudo rm -rf ${ES_DATA} > /dev/null 2>&1 || true

vm_max:
ifeq ("$(vm_max_count)", "")
	@echo updating vm.max_map_count $(vm_max_count) to 262144
	sudo sysctl -w vm.max_map_count=262144
endif

elasticsearch: network vm_max
	@echo docker-compose up elasticsearch with ${ES_NODES} nodes
	@cat ${DC_FILE}-elasticsearch.yml | sed "s/%M/${ES_MEM}/g" > ${DC_FILE}-elasticsearch-huge.yml
	@(if [ ! -d ${ES_DATA}/node1 ]; then sudo mkdir -p ${ES_DATA}/node1 ; sudo chmod g+rw ${ES_DATA}/node1/.; sudo chgrp 1000 ${ES_DATA}/node1/.; fi)
	@(i=$(ES_NODES); while [ $${i} -gt 1 ]; \
		do \
			if [ ! -d ${ES_DATA}/node$$i ]; then (echo ${ES_DATA}/node$$i && sudo mkdir -p ${ES_DATA}/node$$i && sudo chmod g+rw ${ES_DATA}/node$$i/. && sudo chgrp 1000 ${ES_DATA}/node$$i/.); fi; \
		cat ${DC_FILE}-elasticsearch-node.yml | sed "s/%N/$$i/g;s/%MM/${ES_MEM}/g;s/%M/${ES_MEM}/g" >> ${DC_FILE}-elasticsearch-huge.yml; \
		i=`expr $$i - 1`; \
	done;\
	true)
	${DC} -f ${DC_FILE}-elasticsearch-huge.yml up -d
	@timeout=${ES_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${DC_PREFIX}-elasticsearch curl -s --fail -XGET localhost:9200/_cat/indices > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for elasticsearch to start $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

up: start

down: stop

restart: down up

${GIT_DATAPREP}:
	@cd ${APP_PATH};\
	git clone ${GIT_ROOT}/${GIT_DATAPREP}

${DATAPREP_VERSION_FILE}: ${GIT_DATAPREP}
	@cat \
		${GIT_DATAPREP}/projects/deces-dataprep/recipes/deces_dataprep.yml\
		${GIT_DATAPREP}/projects/deces-dataprep/datasets/deces_index.yml\
	| sha1sum | awk '{print $1}' | cut -c-8 > ${DATAPREP_VERSION_FILE}

${DATA_VERSION_FILE}:
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} catalog-tag CATALOG_TAG=${DATA_VERSION_FILE}\
		DATAGOUV_DATASET=${DATASET} STORAGE_BUCKET=${STORAGE_BUCKET}\
		STORAGE_ACCESS_KEY=${STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${STORAGE_SECRET_KEY}\
		FILES_PATTERN='${FILES_TO_PROCESS}'

show-env:
	env | egrep 'STORAGE|BUCKET'

deploy-local: config show-env stats-background elasticsearch-storage-pull elasticsearch-restore elasticsearch docker-check up backup-dir-clean local-test-api

frontend-test:
	${DC} -f ${DC_FILE}-test.yml run ui-test yarn install
	${DC} -f ${DC_FILE}-test.yml run ui-test yarn run simpleSearch
	${DC} -f ${DC_FILE}-test.yml run ui-test yarn run advancedSearch
	${DC} -f ${DC_FILE}-test.yml run ui-test yarn run linkage

backend-test:
	@${MAKE} -C ${APP_PATH}/${GIT_BACKEND} backend-test

local-test-api:
	@timeout=${API_TIMEOUT} ;\
	ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do \
		(${MAKE} -C ${APP_PATH}/${GIT_TOOLS} local-test-api \
			PORT=${PORT} \
			API_TEST_PATH=${API_TEST_PATH} API_TEST_JSON_PATH=${API_TEST_JSON_PATH} API_TEST_DATA='${API_TEST_REQUEST}'\
			${MAKEOVERRIDES} 2>&1 | grep ': ok' ); \
		ret=$$? ;\
		if [ "$$ret" -ne "0" ] ; then echo "waiting for API to start $$timeout" ; fi ;\
		((timeout--)); sleep 1 ; \
	done ; \
	exit $$ret




deploy-k8s: deploy-k8s-elasticsearch deploy-k8s-redis deploy-k8s-backend deploy-k8s-frontend

deploy-k8s-namespace:
	@echo $@
	(cat ${KUBE_DIR}/namespace.yaml | envsubst | kubectl apply -f -) && touch $@

deploy-k8s-elasticsearch: deploy-k8s-namespace
	@echo $@
	@cat ${KUBE_DIR}/elasticsearch.yaml | envsubst | kubectl apply -f -

deploy-k8s-redis: deploy-k8s-namespace
	@echo $@
	@cat ${KUBE_DIR}/redis.yaml | envsubst | kubectl apply -f -

deploy-k8s-backend: deploy-k8s-namespace
	@echo $@
	@export BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	cat ${KUBE_DIR}/backend.yaml | envsubst | kubectl apply -f -

deploy-k8s-frontend: deploy-k8s-namespace
	@echo $@
	@cat ${KUBE_DIR}/frontend.yaml | envsubst | kubectl apply -f -

deploy-remote-instance: config-minimal backend-config ${DATAPREP_VERSION_FILE} ${DATA_VERSION_FILE}
	@\
	BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	DATAPREP_VERSION=$$(cat ${DATAPREP_VERSION_FILE});\
	DATA_VERSION=$$(cat ${DATA_VERSION_FILE});\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-config\
		CLOUD_TAG=ui:${APP_VERSION}-backend:$${BACKEND_APP_VERSION}-data:$${DATAPREP_VERSION}-$${DATA_VERSION}\
		APP=${APP} APP_VERSION=${APP_VERSION} DC_IMAGE_NAME=${DC_PREFIX}\
		SCW_IMAGE_ID=${SCW_IMAGE_ID} GIT_BRANCH=${GIT_BRANCH} ${MAKEOVERRIDES}

deploy-remote-services:
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-deploy remote-actions\
		APP=${APP} APP_VERSION=${APP_VERSION} DC_IMAGE_NAME=${DC_PREFIX}\
		ACTIONS=deploy-local GIT_BRANCH=${GIT_BRANCH}\
		TOOLS_STORAGE_ACCESS_KEY=${TOOLS_STORAGE_ACCESS_KEY}\
		TOOLS_STORAGE_SECRET_KEY=${TOOLS_STORAGE_SECRET_KEY}\
		LOG_BUCKET=${LOG_BUCKET} LOG_DB_BUCKET=${LOG_DB_BUCKET} STATS_BUCKET=${STATS_BUCKET} PROOFS_BUCKET=${PROOFS_BUCKET}\
		BACKEND_TOKEN_PASSWORD=${BACKEND_TOKEN_PASSWORD}
		${MAKEOVERRIDES}

deploy-remote-publish:
	@if [ -z "${NGINX_HOST}" -o -z "${NGINX_USER}" ];then\
		(echo "can't deploy without NGINX_HOST and NGINX_USER" && exit 1);\
	fi;
	@if [ "${GIT_BRANCH}" == "${GIT_BRANCH_MASTER}" ];then\
		APP_DNS=${APP_DNS};\
	else\
		APP_DNS="${GIT_BRANCH}-${APP_DNS}";\
	fi;\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-test-api-in-vpc nginx-conf-apply remote-test-api\
		APP=${APP} APP_VERSION=${APP_VERSION} GIT_BRANCH=${GIT_BRANCH} PORT=${PORT}\
		APP_DNS=$$APP_DNS API_TEST_PATH=${API_TEST_PATH} API_TEST_JSON_PATH=${API_TEST_JSON_PATH} API_TEST_DATA='${API_TEST_REQUEST}'\
		${MAKEOVERRIDES}

deploy-delete-old: ${DATAPREP_VERSION_FILE} ${DATA_VERSION_FILE}
	@\
	BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	DATAPREP_VERSION=$$(cat ${DATAPREP_VERSION_FILE});\
	DATA_VERSION=$$(cat ${DATA_VERSION_FILE});\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} cloud-instance-down-invalid\
		CLOUD_TAG=ui:${APP_VERSION}-backend:$${BACKEND_APP_VERSION}-data:$${DATAPREP_VERSION}-$${DATA_VERSION}\
		APP=${APP} APP_VERSION=${APP_VERSION} DC_IMAGE_NAME=${DC_PREFIX}\
		GIT_BRANCH=${GIT_BRANCH} ${MAKEOVERRIDES}

deploy-monitor:
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-install-monitor-nq NQ_TOKEN=${NQ_TOKEN} ${MAKEOVERRIDES}

deploy-cdn-purge-cache:
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} cdn-cache-purge

deploy-remote: config-minimal deploy-remote-instance deploy-remote-services deploy-remote-publish deploy-cdn-purge-cache deploy-delete-old deploy-monitor

deploy-docker-pull-base: deploy-remote-instance
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-docker-pull DOCKER_IMAGE=node:12.14.0-slim
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-docker-pull DOCKER_IMAGE=nginx:alpine
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-docker-pull DOCKER_IMAGE=docker.elastic.co/elasticsearch/elasticsearch-oss:${ES_VERSION}
	@${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-docker-pull DOCKER_IMAGE=redis:alpine

update-base-image: deploy-remote-instance deploy-docker-pull-base
	@BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags); \
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-cmd REMOTE_CMD="sync"; \
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-cmd REMOTE_CMD="rm -rf ${APP_GROUP}"; \
	sleep 5;\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} SCW-instance-snapshot \
		GIT_BRANCH=${GIT_BRANCH} APP=${APP} APP_VERSION=${APP_VERSION}\
		CLOUD_TAG=ui:${APP_VERSION}-backend:$$BACKEND_APP_VERSION\
		DC_IMAGE_NAME=${DC_PREFIX};
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} SCW-instance-image \
		CLOUD_APP=nner;\
	SCW_IMAGE_ID=$$(cat ${APP_PATH}/${GIT_TOOLS}/cloud/SCW.image.id)/;\
	cat ${APP_PATH}/Makefile | sed "s/^export SCW_IMAGE_ID=.*/export SCW_IMAGE_ID=$${SCW_IMAGE_ID}" \
		> ${APP_PATH}/Makefile.tmp && mv ${APP_PATH}/Makefile.tmp ${APP_PATH}/Makefile;\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} remote-clean;\
	git add Makefile && git commit -m '⬆️  update SCW_IMAGE_ID'

${LOG_DIR}:
	@mkdir -p ${LOG_DIR};

logs-restore: ${LOG_DIR}
	@echo sync ${LOG_BUCKET} to ${LOG_DIR};\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} storage-sync-pull\
		STORAGE_BUCKET=${LOG_BUCKET} DATA_DIR=${LOG_DIR}\
		STORAGE_ACCESS_KEY=${TOOLS_STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${TOOLS_STORAGE_SECRET_KEY};

${LOG_DB_DIR}:
	@mkdir -p ${LOG_DB_DIR};

/usr/local/share/GeoLite2/GeoLite2-City.mmdb:
	@echo downloading and installing GeoLite2-City.mmdb
	@mkdir -p ${APP_PATH}/data
	@sudo mkdir -p /usr/local/share/GeoLite2/
	@curl -s "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${MMDB_TOKEN}&suffix=tar.gz" > ${APP_PATH}/data/geolite.tar.gz
	@sudo tar xzf ${APP_PATH}/data/geolite.tar.gz -C /usr/local/share/GeoLite2/ --strip-components=1

geolite-city: /usr/local/share/GeoLite2/GeoLite2-City.mmdb

stats-db-restore: ${LOG_DB_DIR}
	@mkdir -p ${LOG_DB_DIR};\
	echo sync ${LOG_DB_BUCKET} to ${LOG_DB_DIR};\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} storage-sync-pull\
		STORAGE_BUCKET=${LOG_DB_BUCKET} DATA_DIR=${LOG_DB_DIR}\
		STORAGE_ACCESS_KEY=${TOOLS_STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${TOOLS_STORAGE_SECRET_KEY};
	touch log-db

stats-db-backup: ${LOG_DB_DIR}
	@echo sync ${LOG_DB_DIR} to ${LOG_DB_BUCKET};\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} storage-sync-push\
		STORAGE_BUCKET=${LOG_DB_BUCKET} DATA_DIR=${LOG_DB_DIR}\
		STORAGE_ACCESS_KEY=${TOOLS_STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${TOOLS_STORAGE_SECRET_KEY};

${STATS}:
	@mkdir -p ${STATS};

stats-backup: ${STATS}
	@echo sync ${STATS} to ${STATS_BUCKET};\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} storage-sync-push\
		STORAGE_BUCKET=${STATS_BUCKET} DATA_DIR=${STATS}\
		STORAGE_ACCESS_KEY=${TOOLS_STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${TOOLS_STORAGE_SECRET_KEY};

stats-restore: ${STATS}
	@echo sync ${STATS_BUCKET} to ${STATS};\
	${MAKE} -C ${APP_PATH}/${GIT_TOOLS} storage-sync-pull\
		STORAGE_BUCKET=${STATS_BUCKET} DATA_DIR=${STATS}\
		STORAGE_ACCESS_KEY=${TOOLS_STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${TOOLS_STORAGE_SECRET_KEY};

stats-full: config-stats ${STATS} logs-restore
	@\
		rm -rf ${LOG_DB_DIR} && mkdir -p ${LOG_DB_DIR};\
		(zcat -f `ls -tr ${LOG_DIR}/access*gz` ${LOG_DIR}/access.log | ${STATS_SCRIPTS}/parseLogs.pl);\
		make stats-catalog stats-db-backup stats-backup;

stats-update: config-stats ${STATS} stats-restore stats-db-restore logs-restore
	@\
		zcat -f `ls -tr ${LOG_DIR}/access.log.*gz | tail -${STATS_UPDATE_DAYS}` ${LOG_DIR}/access.log | ${STATS_SCRIPTS}/parseLogs.pl;

stats-live: config-stats ${STATS} stats-restore stats-db-restore logs-restore
	@cat ${LOG_DIR}/access.log | ${STATS_SCRIPTS}/parseLogs.pl day

stats-catalog: ${STATS}
	@ls ${STATS} | grep -v catalog | perl -e '@list=<>;print "[\n".join(",\n",map{chomp;s/.json//;"  \"$$_\""} (grep {/.json/} @list))."\n]\n"' >  ${STATS}/catalog.json

stats-background:
	((sleep 60;while (true); do make stats-live;sleep 120;done) > .stats-live 2>&1 &);\

${PROOFS}:
	@mkdir -p ${PROOFS}

proofs-restore: ${PROOFS}
	@if [ -n "${PROOFS_BUCKET}" ];then\
		echo restoring proofs data;\
		${MAKE} -C ${APP_PATH}/${GIT_TOOLS} storage-sync-pull STORAGE_BUCKET=${PROOFS_BUCKET}/${GIT_BACKEND_BRANCH} DATA_DIR=${PROOFS} \
			STORAGE_ACCESS_KEY=${TOOLS_STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${TOOLS_STORAGE_SECRET_KEY};\
	fi

proofs-backup: ${PROOFS}
	@if [ -n "${PROOFS_BUCKET}" ];then\
		${MAKE} -C ${APP_PATH}/${GIT_TOOLS} storage-sync-push STORAGE_BUCKET=${PROOFS_BUCKET}/${GIT_BACKEND_BRANCH} DATA_DIR=${PROOFS} \
			STORAGE_ACCESS_KEY=${TOOLS_STORAGE_ACCESS_KEY} STORAGE_SECRET_KEY=${TOOLS_STORAGE_SECRET_KEY};\
	fi;

proofs-mount: proofs-restore
	@if [ -n "${PROOFS_BUCKET}" ];then\
		((while (true); do  make proofs-backup;sleep 30;done) > .proofs-backup 2>&1 &);\
	fi;

proofs-umount:
	@ps -elf | grep "make proofs-backup" | awk '{print $$4}'  | head -1 | xargs kill || echo -n
