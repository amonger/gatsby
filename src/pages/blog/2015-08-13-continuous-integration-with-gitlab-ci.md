---
layout: post
path: /php/continuous/integration/gitlab/ci/docker/2015/08/13/continuous-integration-with-gitlab-ci.html
title:  "Continuous Integration With Gitlab CI"
date:   2015-08-13 22:05:11
categories: PHP Continuous integration gitlab CI docker
---
<img src="/assets/gitlabci/gitlabci.png" alt="gitlab ci">

## Existing Solutions

There are some fantastic tools available for continuous integration, particuarly for open source projects. Jenkins is probably the most popular; written in java its compatible with most operating systems and works with many languages. It also has multiple plugins so you're able to configure the system to suit you.


Jenkins is however quite an old project. By default each project has operate within the state of the server, which might not accurately represent the server your application is going to end up being deployed on.


Travis CI is a fantastic example of the next version of continuous integration tools. As each project is run in an individual virtual machine, you're able to define what version of the language you're running, the queue software and database to accurately mimic your server.


This is fantastic to run your unit, functional and integration tests, and is completely free for open source projects. By integrating this software with the git software you're using, you can ensure that a branch you've created is working correctly before merging into master.


Unfortunately Travis CI is quite an expensive solution if you have small projects you want to keep private, or you have a large number of projects which each have few commits.


### Enter Gitlab CI... and Docker

Gitlab CI is a fantastic piece of software, which leverages docker images, to give you complete control over your environment. This means you can choose the type of server, software and memory you need to allocate to a project.


As runners are attached to Gitlab CI, you can increase the number of runners on each project, and scale them as a project grows.


## Setting up

For this example, we're going to configure Gitlab CI with Gitlab Enterprise.


### Gitlab Enterprise

Gitlab enterprise is available as a free service with unlimited private repositories. This is a great solution for agencies who need to manage multiple projects across several developers.


It can also be self hosted, so if security is a concern, that is always an option.


* Sign up for an account over at (http://www.gitlab.com)[Gitlab]
* Create a repository and push some stuff onto it

#### Gitlab CI

As you now already are registered with a gitlab account, you can access Gitlab CI by accessing [http://ci.gitlab.com](ci.gitlab.com).


Add your newly created project to the tool by clicking "Add project to CI".


Click on runners in the left navigation menu, where you can copy your registration token (you'll need this in the next step).


### Create a Runner

Gitlab CI needs a runner from you to be able to carry out some operation. Gitlab (the company) provides a service written in go which uses Docker to "contain" that image.
What we're aiming to contain within this example is:

* An Apache server
* PHP 5.6
* MySQL
* MailCatcher

#### Server Setup

<a href="https://www.digitalocean.com/?refcode=72661a1914c1" target="_blank" onclick="ga('send', 'event', 'referal', 'click', 'Digital Ocean', '25');">Digital Ocean</a> provide low cost servers you can configure for multiple services. For small companies, a server with a single core (meaning you can only carry out one runner at a time) should work well for most purposes. So in this instance, we're going to be setting up a $10 a month server. This is a recommended specification from Gitlab themselves, though the bare minimum is a 512mb server.



The server needs to be the x64 version, as docker isn't compatible with the 386 architecture. Here, I've chosen Ubuntu 14.04.

You can add your public key here or if you prefer, create without and you'll be emailed your password.

After you press create droplet, it'll take about 30 seconds to setup your VPS (Virtual Private Server).


#### Runner Setup

SSH into your new server. Update aptitude and install the runner by executing:

    apt-get update \
    curl -sSL https://get.docker.com/ | sh \
    curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.deb.sh | sudo bash \
    apt-get install gitlab-ci-multi-runner -y


Now you'll need to register the runner you configured earlier.
Run:

    gitlab-ci-multi-runner register

Register the runner:

    Please enter the gitlab-ci coordinator URL (e.g. http://gitlab-ci.org:3000/ )
    https://ci.gitlab.org/
    Please enter the gitlab-ci token for this runner
    [The token you generated earlier]
    Please enter the gitlab-ci description for this runner
    my-runner
    INFO[0034] fcf5c619 Registering runner... succeeded
    Please enter the executor: shell, docker, docker-ssh, ssh?
    docker
    Please enter the Docker image (eg. ruby:2.1):
    ubuntu

Apply the key you took from the GitLab CI website from the previous step.


#### Runner Image

Now we've setup the runner, we can work on the image. As previously stated, the image is a docker container which we're going to configure to lose its state after the build has completed.

As we've already installed docker in the last step, we can work on our docker file. This is a file which defines which packages we want to install for our container.

As we're mainly concerned about running tests then losing state, we're going to configure docker to install all these dependancies within a single configuration file. However if you begin to look further into using docker you'd likely separate these out.


#### Dockerfile

    FROM ubuntu:14.04

    RUN apt-get update -y
    RUN apt-get install apache2 make build-essential -y
    RUN apt-get install mysql-server libapache2-mod-auth-mysql php5-mysql curl wget git -y
    RUN apt-get install php5 libapache2-mod-php5 php5-mcrypt php5-mysql php5-curl php5-gd php5-intl php-pear php5-imagick php5-imap php5-mcrypt php5-memcache php5-ming php5-ps php5-pspell php5-recode php5-sqlite php5-tidy php5-xmlrpc php5-xsl -y

    RUN apt-get install ruby1.9.1-dev libsqlite3-dev -y
    RUN gem install mailcatcher

    RUN export DEBIAN_FRONTEND=noninteractive
    RUN curl -sS https://getcomposer.org/installer | php

    EXPOSE 22 80
    CMD ["/usr/sbin/apache2ctl -D FOREGROUND"]

Here we're installing apache, mysql, ruby, and mailcatcher. These tools are adequate for our needs, but we can update this whenever we need to. Save this as "Dockerfile".


#### Build

Now we need to build the file. You can do this by changing to the directory containing the Dockerfile and running:

    docker build -t "php56" .

The "php56" is the name of the image you're creating. This can be whatever you want. You can create multiple builds with several docker files if you have different environments you'd like to test.


#### Final configuration


Finally we need to tell the CI tool what images it's allowed to run. Although Docker Inc. have updated docker to prevent container breakout, we don't really want to allow any images to run on the server. By default this is disabled, and the image provided will be the image defined when defining the runner.


#### /etc/gitlab-runner/config.toml

    [[runners]]
      name = "docker-lamp"
      url = "https://ci.gitlab.com/"
      token = "28fj239jf2983jf283j9283jf98j382j3"
      limit = 1
      executor = "docker"
      environment = ["MYSQL_ALLOW_EMPTY_PASSWORD=1"]
      [runners.docker]
        image = "ubuntu"
        allowed_images = ["php56"]

Here we've defined the image we built earlier can be used with Gitlab CI under allowed_images. This can be replaced with a "*" if you'd prefer to run any image.


## Enable The Runner

Now we've done all that admin work, we can enable the runner on the Gitlab CI website.


## Setup a .gitlab-ci.yml file

We've finished setting up our runner, so now we can begin running tests! Our image already contains the majority of services we need, so we just need to create a file which defines how to run our tests. This file is placed in our projects repository and is committed into version control (in the root of the project).


### .gitlab-ci.yml
    image: php56

    before_script:
        - service mysql start
        - echo "create database laravel" | mysql -u root
        - mysql -u root laravel < "sql/laravel.sql"
        - echo "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('root');" | mysql -u root
        - php /composer.phar install --no-progress
    job1:
        script:
            - php artisan migrate
            - vendor/bin/phpunit tests

## Finishing Up

As we've already configured the service to run with our runner, so the next time you commit to the project, the projects tasks will be run and you will be able to view the status of each build on the GitLab CI website.

![Success](/assets/gitlabci/success.png)

Merge requests will now also have the additional merge status field which will tell you whether you should merge your branch into master.

Build badges are also generated, which are a nice extra to quickly view the status of a project.

As you can see, the Gitlab CI tool is very powerful, as you could define multiple environments, with different versions of software which could run on the same server, and are quickly provisioned thanks to the Docker container.


## Some Freebies
If you want to have a play around with Digital Ocean, following my <a href="https://www.digitalocean.com/?refcode=72661a1914c1" target="_blank" onclick="ga('send', 'event', 'referal', 'click', 'Digital Ocean', '25');">affiliate link</a> will give you $10 free.

