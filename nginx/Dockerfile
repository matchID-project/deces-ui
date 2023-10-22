#######################
# Step 1: Base target #
#######################
FROM nginx:1.25.2-alpine as base
ARG app_name
ARG app_ver

WORKDIR /home/nginx

COPY run.sh run.sh
COPY nginx-dev.template /etc/nginx/nginx.template

RUN  [ -f "run.sh" ] && chmod +x run.sh

EXPOSE 80
################################
# Step 2: "development" target #
################################
FROM base as development
ARG app_name
ARG app_ver

COPY default-dev.template /etc/nginx/conf.d/default.template

CMD ["/home/nginx/run.sh"]
################################
# Step 2: "production" target #
################################
FROM base as production
ARG app_name
ARG app_ver

VOLUME /var/log/nginx

COPY default-run.template /etc/nginx/conf.d/default.template
COPY gzip.conf /etc/nginx/gzip.conf
COPY nginx-run.template /etc/nginx/nginx.template

COPY ${app_name}-${app_ver}-frontend-dist.tar.gz .

RUN  [ -f "${app_name}-${app_ver}-frontend-dist.tar.gz" ] && \
     tar -zxvf ${app_name}-${app_ver}-frontend-dist.tar.gz --strip=1 -C /usr/share/nginx/html  && \
     rm -rf ${app_name}-${app_ver}-frontend-dist.tar.gz

CMD ["/home/nginx/run.sh"]
