#######################
# Step 1: Base target #
#######################
FROM node:18.18-alpine3.17 as base
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG npm_ssl
ARG MIRROR_DEBIAN
ARG NPM_GIT
ARG NPM_FIX
ARG NPM_LATEST
ARG NPM_VERBOSE
ARG app_path
ARG app_name
ARG app_ver
ENV APP ${APP}
ENV APP_VERSION ${app_ver}

WORKDIR /$app_path

# update debian w/proxy & mirror then installs git in case of git dependencies
RUN if [ ! -z "${NPM_GIT}" ]; then \
      echo "$http_proxy $no_proxy"; \
      (set -x && [ -z "$MIRROR_DEBIAN" ] || sed -i.orig -e "s|http://deb.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian9|g ; s|http://security.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian9-security|g" /etc/apt/sources.list) ; \
      apt-get update; \
      buildDeps="git"; \
      apt-get install -qy --no-install-recommends $buildDeps ; \
      git config --global url."https://".insteadOf git:// ; \
   fi

# use proxy & private npm registry
RUN if [ ! -z "$http_proxy" ] ; then \
        npm config delete proxy; \
        npm config set proxy $http_proxy; \
        npm config set https-proxy $https_proxy ; \
        npm config set no-proxy $no_proxy; \
   fi ; \
   [ -z "${npm_registry}" ] || npm config set registry=$npm_registry; \
   [ -z "$npm_ssl" ] || npm config set strict-ssl false ; \
   [ -z "${sass_registry}" ] || npm config set sass_binary_site=$sass_registry;

RUN [ -z "${NPM_LATEST}" ] || npm i npm@latest -g

COPY package.json ./

RUN npm --no-git-tag-version version ${APP_VERSION}
RUN if [ -z "${NPM_VERBOSE}" ]; then\
      npm install;  \
    else \
      npm install --verbose; \
    fi

# set warn level to high, to avoid unreachable warning
RUN npm config set audit-level high 

RUN if [ -z "${NPM_FIX}" ]; then \
      npm audit --registry=https://registry.npmjs.org; \
    else \
      npm audit fix --registry=https://registry.npmjs.org; \
    fi

################################
# Step 2: "development" target #
################################
FROM base as development
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG app_path
ARG app_name
ARG app_ver
ARG FRONTEND_DEV_PORT

VOLUME /$app_path/src
VOLUME /$app_path/public

EXPOSE ${FRONTEND_DEV_PORT}

CMD ["npm", "run", "dev"]

################################
# Step 3:   "build" target     #
################################
FROM base as build
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG AB_THRESHOLD
ARG API_EMAIL
ARG API_MAX_BODY
ARG ES_PROXY_PATH
ARG ES_MAX_RESULTS
ARG BACKEND_TOKEN_USER
ARG BACKEND_PROXY_PATH
ARG DATAGOUV_PROXY_PATH
ARG DATAGOUV_CATALOG_URL
ARG DATAGOUV_RESOURCES_URL
ARG MITM_URL
ARG THEME_DNUM

ARG app_path
ARG app_name
ARG app_ver
ENV APP ${app_name}
ENV APP_VERSION ${app_ver}
ENV AB_THRESHOLD ${AB_THRESHOLD}
ENV API_EMAIL ${API_EMAIL}
ENV API_MAX_BODY ${API_MAX_BODY}
ENV ES_PROXY_PATH ${ES_PROXY_PATH}
ENV ES_MAX_RESULTS ${ES_MAX_RESULTS}
ENV BACKEND_PROXY_PATH ${BACKEND_PROXY_PATH}
ENV BACKEND_TOKEN_USER ${BACKEND_TOKEN_USER}
ENV DATAGOUV_PROXY_PATH ${DATAGOUV_PROXY_PATH}
ENV DATAGOUV_CATALOG_URL ${DATAGOUV_CATALOG_URL}
ENV DATAGOUV_RESOURCES_URL ${DATAGOUV_RESOURCES_URL}
ENV MITM_URL ${MITM_URL}
ENV THEME_DNUM ${THEME_DNUM}
# VOLUME /$app_path/build

RUN echo API ${ES_PROXY_PATH}

COPY ${APP}-${APP_VERSION}-frontend.tar.gz .

RUN  set -ex ; tar -zxvf ${APP}-${APP_VERSION}-frontend.tar.gz  && \
     npm run build 2>&1 | tee npm.log; egrep -E '(ERROR|error)' npm.log && exit 1 ; rm -f npm.log \
     rm -rf ${app_name}-${app_ver}-frontend.tar.gz

CMD ["npm", "run", "build"]

