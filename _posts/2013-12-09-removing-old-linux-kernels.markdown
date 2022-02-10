---
layout: post
title: Removing old linux kernels in Ubuntu.
date: 203-12-09 13:52:26 +0000
description: 
img: # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Ubuntu]
---
As I always forget how to remove the older kernel headers I am posting this here

    sudo apt-get remove --purge $(dpkg -l 'linux-*' | sed '/^ii/!d;/'"$(uname -r | sed "s/\(.*\)-\([^0-9]\+\)/\1/")"'/d;s/^[^ ]* [^ ]* \([^ ]*\).*/\1/;/[0-9]/!d')

and a link back to the [originating page](http://askubuntu.com/questions/2793/how-do-i-remove-or-hide-old-kernel-versions-to-clean-up-the-boot-menu)
