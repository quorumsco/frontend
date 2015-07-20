FROM silverwyrda/frontdev
MAINTAINER Douézan-Grard Guillaume - Quorums

ADD . /srv/http/front

WORKDIR /srv/http/front

RUN gulp prod

VOLUME ["/srv/http/front"]
