FROM quorum/frontdev
MAINTAINER Douézan-Grard Guillaume - Quorums

ADD . /srv/http/front

WORKDIR /srv/http/front

RUN gulp prod

VOLUME ["/srv/http/front"]

CMD ["/bin/true"]
