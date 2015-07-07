FROM silverwyrda/docker-node-ruby
MAINTAINER Douézan-Grard Guillaume - Quorums

ADD . /srv/http

WORKDIR /srv/http

RUN \
  bundle install && \
  npm install && \
  gulp prod

VOLUME ["/srv/http"]
