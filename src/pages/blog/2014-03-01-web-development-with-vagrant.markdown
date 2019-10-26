---
layout: post
path: /vagrant/development/2014/03/01/web-development-with-vagrant.html
title:  "Web Development With Vagrant"
date:   2014-03-01 11:44:15
categories: vagrant development
---

## The Problem

Many web developers begin with a XAMP stack like XAMPP or MAMP to provide an easy way to get a web server off the ground. Starting programming can be daunting; especially when you find out you need to learn how to configure Apache or Nginx before you can even begin to write your first hello world script.

XAMPP and MAMP fill this niche nicely. However as developers become better versed in the tools they are using, the limitations of these tools soon present themselves.

A large factor of web development is working on legacy applications, as well as working within a team using the same code base.

This is something which is difficult to do consistently when you may be working on a projects months apart, or between several developers working on different platforms.

## Enter Vagrant

Vagrant solves this issue by removing the local install completely. Instead, Vagrant works by provisioning virtual machines to replicate the same virtual environment each time a new server is built.

This is useful to developers as it means a consistent working environment regardless of your platform. The configuration is defined in a Vagrant file, annotated with YML. This can easily be updated, and a machine can be quickly re-provisioned with the new settings.

## Vagrant + VirtualBox + Puppet

Vagrant works by provisioning virtual machines using either Chef or Puppet. Both pieces of software are made to provision machines, and allow fully reproducible environments.

Vagrant supports both VirtualBox and VMware to create virtual machines. These both have their advantages and disadvantages, but fundamentally work in a identical way.

Although ideally we’d like to have an understanding of how Puppet provisions machines and the syntax used to achieve this, a quick way configure a Puppet LAMP stack would be to use an online tool like PuPHPet, which lets you interactively define your server configuration.

## Vagrant + Version Control

Vagrant really shows its worth when working with version control. The Vagrant file is just a plain text file which defines a server configuration, which means it can be committed to your project repository with very little overhead.

This is advantageous as it means several developers on differing platforms could work in an identical environment. A developer could even update the Vagrant configuration, and the other developers could merge into their environment, and re-provision their machines ensuring consistency between the team.

The environment for archived sites are also documented within the Vagrant file, so if a development is needed on a site several year later, you’re quickly able to jump back into development without concern for dependancies that may have been missed.

## It just works

Working on shared server configurations can cause issues. A corruption in an Apache or Nginx file could cause the whole department to come to a halt until the server is fixed, causing downtime and extending deadlines. Vagrant however allows the developer to destroy and re-provision a virtual machine independent of other developers in minutes.
