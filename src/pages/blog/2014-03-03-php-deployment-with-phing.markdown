---
layout: post
path: /phing/development/2014/03/03/php-deployment-with-phing.html
title:  "PHP Deployment with Phing"
date:   2014-03-03 10:44:15
categories: phing development
---

Deploying applications to remote servers can be problematic. Traditionally, files would be transferred via FTP to a remote host, using a tool like FileZilla.

This isn't however a complete solution. Depending on your project, once the files have been transferred to the server, other operations may need to be carried out (such as changing owners, or file permissions).

Another scenario is that you are using a dependency manager such as Composer. Uploading via FTP would mean that it is necessary to either download the dependancies locally then upload them via FTP or upload the files, then SSH into the remote server and download the dependancies remotely.

You may then need to clear your cache.

So in this scenario several operations need to be completed before the site is live, and these tasks need to be repeated every time a modification has been made to the local copy. So it makes sense to automate these tasks.

## Phing

Phing [Phing Is Not GNU Make] is a tool which allows us to script the deployment process using XML.

Phing comes with a host of tools to allow us to build an entire application, but for the purpose of this example, we'll focus on deployment.

## The scenario

Lets assume you have a project that you've currently got a Composer project on GitHub which you intend to be updated on a remote server via SSH. This project has a caching directory which needs to be cleared every time the server is updated.

So the order of operations will be something like this:

1. The developer will run the deployment Phing script
2. The Phing script will deploy a custom Phing server script to the remote server via ssh
3. A git pull request will be made to the git repository
4. Composer will be instructed to update and dump the autoloaded files
5. The cache will be cleared

## The Files

Initially we need to create two XML files, build.xml and buildremote.xml. The job of build.xml will be to transfer buildremote.xml and to execute it once it is on the server.

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<project name="Deploy" default="production" basedir="." description="A deployment Script">
    <property name="remote_host" value="host.com"/>
    <property name="remote_user" value="username"/>
    <property name="remote_pass" value="password"/>
    <target name="production">

        <echo msg="Uploading remote phing script"/>
        <scp host="${remote_host}" username="${remote_user}" password="${remote_pass}"
             todir="/home/learnmango/phing-example"
             file="remotebuild.xml" />
        <ssh host="${remote_host}" username="${remote_user}" password="${remote_pass}"
             command="cd phing-example; phing remotebuild.xml; mv remotebuild.xml build.xml" />
    </target>
</project>
{% endhighlight %}
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<project name="Deploy" default="production" basedir="." description="A deployment Script">
    <property name="remote_host" value="host.com"/>
    <property name="remote_user" value="user"/>
    <property name="remote_pass" value="pass"/>
    <target name="production">
        <exec command="cd site" />
        <echo msg="Pulling down latest git version"/>
        <exec command="git pull" />
        <echo msg="Updating dependancies"/>
        <exec command="composer.phar update" />
        <echo msg="Dumping autoload"/>
        <exec command="composer.phar dump-autoload -o" />
        <echo msg="Clearing the cache"/>
        <exec command="rm -rf ./cache/*" />
    </target>
</project>
{% endhighlight%}

## Execution

As these two files are now configured, the user now only needs to move to execute the command “phing” in their terminal, phing will then take over and handle the deployment.
