FROM frontdev
MAINTAINER Douézan-Grard Guillaume - Quorums

ADD . /srv/http

WORKDIR /srv/http

RUN gulp prod

VOLUME ["/srv/http"]
