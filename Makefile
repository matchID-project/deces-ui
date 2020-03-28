##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################

SHELL=/bin/bash

export USE_TTY := $(shell test -t 1 && USE_TTY="-t")

#npm fix while minimist failure not updated in rollup-plugin-livereload
export NPM_FIX=true

#search-ui
export PORT=8083

#AB-switch (in percent)
#currently used for backend / no backend test
export AB_THRESHOLD=100

#google analytics disable by default
export GOOGLE_ANALYTICS_ID=

#base paths
export APP = deces-ui
export DATASET=fichier-des-personnes-decedees
export APP_GROUP = matchID
export APP_PATH := $(shell pwd)
export APP_DNS=deces.matchid.io
export FRONTEND := ${APP_PATH}
export FRONTEND_DEV_HOST = frontend-development
export FRONTEND_DEV_PORT = ${PORT}
export BACKEND_PORT=8080
export BACKEND_HOST=backend
export BACKEND_PROXY_PATH=/deces/api/v1
export NGINX = ${APP_PATH}/nginx
export NGINX_TIMEOUT = 30
export API_USER_LIMIT_RATE=1r/s
export API_DOWNLOAD_LIMIT_RATE=30r/m
export API_USER_BURST=20 nodelay
export API_USER_SCOPE=http_x_forwarded_for
export API_GLOBAL_LIMIT_RATE=20r/s
export API_GLOBAL_BURST=200 nodelay
export API_TEST_JSON_PATH=hits
export API_TEST_REQUEST={"query":{"match_all":{}}}

export DC_DIR=${APP_PATH}
export DC_FILE=${DC_DIR}/docker-compose
export DC_PREFIX := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]' | tr '_' '-')
export DC_IMAGE_NAME = ${DC_PREFIX}
export API_PATH = deces
export DC_NETWORK := $(shell echo ${APP} | tr '[:upper:]' '[:lower:]')
export DC_BUILD_ARGS = --pull --no-cache

export DC := /usr/local/bin/docker-compose
export GIT_ORIGIN=origin
export GIT_BRANCH := $(shell git branch | grep '*' | awk '{print $$2}')
export GIT_BRANCH_MASTER=master
export GIT_DATAPREP = deces-dataprep
export GIT_BACKEND = deces-backend
export GIT_BACKEND_BRANCH = dev
export GIT_ROOT = https://github.com/matchid-project
export GIT_TOOLS = tools

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
export ES_PROXY_PATH = /${API_PATH}/api/v0/search
export ES_INDEX = deces
export ES_DATA = ${APP_PATH}/esdata
export ES_NODES = 1
export ES_MEM = 1024m
export ES_VERSION = 7.6.1
export ES_BACKUP_BASENAME := esdata
export DATAPREP_VERSION_FILE = .dataprep.sha1
export DATA_VERSION_FILE = .data.sha1
export FILES_TO_PROCESS=deces-([0-9]{4}|2020-m[0-9]{2}).txt.gz

vm_max_count            := $(shell cat /etc/sysctl.conf | egrep vm.max_map_count\s*=\s*262144 && echo true)


# s3 conf
# s3 conf has to be stored in two ways :
# classic way (.aws/config and .aws/credentials) for s3 backups
# to use within matchid backend, you have to add credential as env variables and declare configuration in a s3 connector
# 	export aws_access_key_id=XXXXXXXXXXXXXXXXX
# 	export aws_secret_access_key=XXXXXXXXXXXXXXXXXXXXXXXXXXX
export S3_BUCKET=${DATASET}
export AWS=${APP_PATH}/aws

dummy		    := $(shell touch artifacts)
include ./artifacts

export VERSION := $(shell cat tagfiles.version | xargs -I '{}' find {} -type f -not -name '*.tar.gz'  | sort | xargs cat | sha1sum - | sed 's/\(......\).*/\1/')

commit              := $(shell git describe --tags || cat VERSION )
tag                 := $(shell git describe --tags | sed 's/-.*//')
lastcommit          := $(shell touch .lastcommit && cat .lastcommit)
date                := $(shell date -I)
id                  := $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

export APP_VERSION :=  ${tag}-${VERSION}

export FILE_FRONTEND_APP_VERSION = $(APP)-$(APP_VERSION)-frontend.tar.gz
export FILE_FRONTEND_DIST_APP_VERSION = $(APP)-$(APP_VERSION)-frontend-dist.tar.gz
export FILE_FRONTEND_DIST_LATEST_VERSION = $(APP)-latest-frontend-dist.tar.gz

export DOCKER_USERNAME=matchid
export DC_BUILD_FRONTEND = ${DC_FILE}-build.yml
export DC_RUN_NGINX_FRONTEND = ${DC_FILE}.yml
export BUILD_DIR=${APP_PATH}/${APP}-build

include /etc/os-release

config:
	# this proc relies on matchid/tools and works both local and remote
	@sudo apt-get install make
	@if [ -z "${TOOLS_PATH}" ];then\
		git clone ${GIT_ROOT}/${GIT_TOOLS};\
		make -C ${APP_PATH}/${GIT_TOOLS} config;\
	else\
		ln -s ${TOOLS_PATH} ${APP_PATH}/${GIT_TOOLS};\
	fi
	cp artifacts ${APP_PATH}/${GIT_TOOLS}/
	@ln -s ${APP_PATH}/${GIT_TOOLS}/aws ${APP_PATH}/aws
	@touch config


clean-data: elasticsearch-clean backup-dir-clean
	@sudo rm -rf ${DATA_VERSION_FILE} ${DATAPREP_VERSION_FILE}\
		${DATA_VERSION_FILE}.list > /dev/null 2>&1 || true

clean-frontend: build-dir-clean frontend-clean-dist frontend-clean-dist-archive

clean-backend: backend-clean-dir

clean-remote:
	@make -C ${APP_PATH}/${GIT_TOOLS} remote-clean > /dev/null 2>&1 || true

clean-config:
	@rm -rf ${APP_PATH}/${GIT_TOOLS} ${APP_PATH}/aws config > /dev/null 2>&1 || true

clean-local: clean-data clean-frontend clean-backend clean-config

clean: clean-remote clean-local

docker-push:
	@make -C ${APP_PATH}/${GIT_TOOLS} docker-push DC_IMAGE_NAME=${DC_IMAGE_NAME} APP_VERSION=${APP_VERSION}

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
	@make -C ${APP_PATH}/${GIT_BACKEND} backend-dev DC_NETWORK=${DC_NETWORK}

backend-dev-stop:
	@make -C ${APP_PATH}/${GIT_BACKEND} backend-dev-stop DC_NETWORK=${DC_NETWORK}

backend-clean-version:
	rm backend-version

backend-docker-check: backend-config
	@BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	make docker-check DC_IMAGE_NAME=deces-backend APP_VERSION=$$BACKEND_APP_VERSION

backend: backend-config backend-docker-check
	@BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	make -C ${APP_PATH}/${GIT_BACKEND} backend-start DC_NETWORK=${DC_NETWORK} APP_VERSION=$$BACKEND_APP_VERSION

backend-stop:
	@BACKEND_APP_VERSION=$(shell cd ${APP_PATH}/${GIT_BACKEND} && git describe --tags);\
	make -C ${APP_PATH}/${GIT_BACKEND} backend-stop DC_NETWORK=${DC_NETWORK} APP_VERSION=$$BACKEND_APP_VERSION

backend-clean-dir:
	@sudo rm -rf ${APP_PATH}/${GIT_BACKEND}

frontend-update:
	@cd ${FRONTEND}; git pull ${GIT_ORIGIN} ${GIT_BRANCH}

update: frontend-update

frontend-dev:
ifneq "$(commit)" "$(lastcommit)"
	@echo docker-compose up ${APP} frontend for dev after new commit ${APP_VERSION}
	${DC} -f ${DC_FILE}-dev.yml up --build -d
	@echo "${commit}" > ${FRONTEND}/.lastcommit
else
	@echo docker-compose up ${APP} frontend for dev
	${DC} -f  ${DC_FILE}-dev.yml up -d
endif

frontend-dev-stop:
	${DC} -f ${DC_FILE}-dev.yml down

dev: network frontend-stop elasticsearch backend-dev frontend-dev

dev-stop: frontend-dev-stop backend-dev-stop elasticsearch-stop

build: frontend-build nginx-build

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
	@echo docker-compose up ${APP} frontend
	@echo DATAGOUV PROXY: ${DATAGOUV_RESOURCES_PROXY}, RW: ${DATAGOUV_RESOURCES_REWRITE_PATH}
	${DC} -f ${DC_RUN_NGINX_FRONTEND} up -d
	@timeout=${NGINX_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (curl -s --fail -XGET localhost:${PORT} > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for nginx to start $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

stop: frontend-stop backend-stop elasticsearch-stop
	@echo all components stopped

start: elasticsearch backend frontend
	@sleep 2 && docker-compose logs

log:
	@make -C ${APP_PATH}/${GIT_TOOLS} docker-logs-to-API &

backup-dir:
	@if [ ! -d "$(BACKUP_DIR)" ] ; then mkdir -p $(BACKUP_DIR) ; fi

backup-dir-clean:
	@if [ -d "$(BACKUP_DIR)" ] ; then (rm -rf $(BACKUP_DIR) > /dev/null 2>&1 || true) ; fi

elasticsearch-s3-pull: backup-dir ${DATAPREP_VERSION_FILE} ${DATA_VERSION_FILE}
	@\
	DATAPREP_VERSION=$$(cat ${DATAPREP_VERSION_FILE});\
	DATA_VERSION=$$(cat ${DATA_VERSION_FILE});\
	ESBACKUPFILE=${ES_BACKUP_BASENAME}_$${DATAPREP_VERSION}_$${DATA_VERSION}.tar;\
	if [ ! -f "${BACKUP_DIR}/$$ESBACKUPFILE" ];then\
		echo pulling s3://${S3_BUCKET}/$$ESBACKUPFILE;\
		${AWS} s3 cp s3://${S3_BUCKET}/$$ESBACKUPFILE ${BACKUP_DIR}/$$ESBACKUPFILE;\
	fi

elasticsearch-stop:
	@echo docker-compose down matchID elasticsearch
	@if [ -f "${DC_FILE}-elasticsearch-huge.yml" ]; then ${DC} -f ${DC_FILE}-elasticsearch-huge.yml down;fi

elasticsearch-restore: elasticsearch-stop elasticsearch-s3-pull
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
	@${AWS} s3 ls ${S3_BUCKET} | egrep '${FILES_TO_PROCESS}' |\
		awk '{print $$NF}' | sort > ${DATA_VERSION_FILE}.list
	@cat ${DATA_VERSION_FILE}.list | sed 's/\s*$$//g' | sha1sum | awk '{print $1}' |\
		cut -c-8 > ${DATA_VERSION_FILE}

deploy-local: config elasticsearch-s3-pull elasticsearch-restore elasticsearch docker-check up backup-dir-clean local-test-api

local-test-api:
	@make -C ${APP_PATH}/${GIT_TOOLS} local-test-api \
		PORT=${PORT} \
		API_TEST_PATH=${ES_PROXY_PATH} API_TEST_JSON_PATH=${API_TEST_JSON_PATH} API_TEST_DATA='${API_TEST_REQUEST}'\
		${MAKEOVERRIDES}

deploy-remote-instance: config
	@make -C ${APP_PATH}/${GIT_TOOLS} remote-config\
			APP=${APP} APP_VERSION=${APP_VERSION} DC_IMAGE_NAME=${DC_PREFIX}\
			GIT_BRANCH=${GIT_BRANCH} ${MAKEOVERRIDES}

deploy-remote-services:
	@make -C ${APP_PATH}/${GIT_TOOLS} remote-deploy remote-actions\
		APP=${APP} APP_VERSION=${APP_VERSION} DC_IMAGE_NAME=${DC_PREFIX}\
		ACTIONS=deploy-local GIT_BRANCH=${GIT_BRANCH} ${MAKEOVERRIDES}

deploy-remote-publish:
	@if [ -z "${NGINX_HOST}" -o -z "${NGINX_USER}" ];then\
		(echo "can't deploy without NGINX_HOST and NGINX_USER" && exit 1);\
	fi;
	@if [ "${GIT_BRANCH}" == "${GIT_BRANCH_MASTER}" ];then\
		APP_DNS=${APP_DNS};\
	else\
		APP_DNS="${GIT_BRANCH}-${APP_DNS}";\
	fi;\
	make -C ${APP_PATH}/${GIT_TOOLS} remote-test-api-in-vpc nginx-conf-apply remote-test-api\
		APP=${APP} APP_VERSION=${APP_VERSION} GIT_BRANCH=${GIT_BRANCH} PORT=${PORT}\
		APP_DNS=$$APP_DNS API_TEST_PATH=${ES_PROXY_PATH} API_TEST_JSON_PATH=${API_TEST_JSON_PATH} API_TEST_DATA='${API_TEST_REQUEST}'\
		${MAKEOVERRIDES}

deploy-delete-old:
	@make -C ${APP_PATH}/${GIT_TOOLS} cloud-instance-down-invalid\
		APP=${APP} APP_VERSION=${APP_VERSION} GIT_BRANCH=${GIT_BRANCH} ${MAKEOVERRIDES}

deploy-monitor:
	@make -C ${APP_PATH}/${GIT_TOOLS} remote-install-monitor-nq NQ_TOKEN=${NQ_TOKEN}

deploy-remote: config deploy-remote-instance deploy-remote-services deploy-remote-publish deploy-delete-old deploy-monitor
