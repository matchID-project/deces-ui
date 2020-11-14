FROM alpine:edge AS builds
RUN apk add geoip goaccess

VOLUME /var/www/goaccess
EXPOSE 7890
ENTRYPOINT ["/usr/bin/goaccess"]
CMD ["--help"]

