---
layout: post
title: Running Composer via Phing via Composer
date: 2014-01-31 13:32:20 +0000
description: Running Composer via Phing via Composer
img: composer-phing-composer.webp # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Composer, Phing, Jenkins]
---
I have set up [Jenkins](http://jenkins-ci.org/) to run a [Phing](http://www.phing.info/) task every time we commit to our repo, php-lint, documentor, mess detector and a few other.  This is working perfectly but I wanted to expand it to perform `composer install`.  Now Phing can do this via [ComposerTask](http://www.phing.info/docs/guide/stable-legacy/chapters/appendixes/AppendixC-OptionalTasks.html#ComposerTask") but not when using a svn repo and called via Jenkins.

When run via Phing this is the error you get

    Package could not be downloaded, can not ask for authentication in non interactive mode (svn: OPTIONS of 'http://svn.repo/reponame/trunk': authorization failed: Could not authenticate to server: rejected Basic challenge (http://svn.repo/reponame/trunk)  

Lets take a step back and have a look at the composer.json file

~~~
{
    "repositories": [
        {
            "url": "http://svn.repo/reponame/",
            "type": "svn"
        }
    ],  
    "require": {
        "dmakin/reponame" : ">=1.0.0"
    }
}
~~~
{: .language-json}

## Try adding user and password details?

My first theory was to try adding the username and password to the url `"url": "http://user:password@svn.repo/reponame/"`, but that still came back with the same error.

## Try storing the login details?

The next idea was to run `composer install` from the cmd line on the Jenkins box as the jenkins user in the hope that the credentials would then be stored and available for the web interface.

~~~
sudo su jenkins
cd /var/lib/jenkins/jobs/JobName/workspce
composer install
~~~
{: .language-shell}

Composer then asked me for my svn login details and pulled the packages in successfully. Good start but the web interface still had issues.

## Solution
After wondering if this was going to be possible at all I figured I would repeat my last attempt. It was asking me for my credentials, why would this be as they should be stored?

Turns out they where not being stored. A quick edit of `~/.subversion/config`, uncommenting the lines with `store-passwords` and `store-auth-creds` and setting them to yes, a quick run of `composer install` to save the svn login details then allowed me to run the Jenkins task and it worked. Hurrah!
