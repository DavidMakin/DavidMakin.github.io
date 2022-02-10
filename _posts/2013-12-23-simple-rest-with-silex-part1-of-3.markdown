---
layout: post
title: Creating a simple REST application with Silex. Part 1 of 3
date: 2013-12-23 10:52:34 +0000
description: 
img: silex.webp # Add image post (optional)
fig-caption: Photo by <a href="https://unsplash.com/@zoltantasi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Zoltan Tasi</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
 # Add figcaption (optional)
tags: [Silex, REST, PHP]
---
So you have come to the conclusion that, rather than having the code to update customer details and that little fix to convert the date from GMT to UTC should happen in once place rather than being copied into several pieces of code, a REST service is the answer. Perhaps you just think you should know how to create a REST service. Either way this post is for you.

In this post we will start off with a blank directory and go through installing Silex and getting it to serve a couple of simple routes.

## Lets Start

For this example I will be using a directory called **toyshop**.

## Install Silex
There are multiple ways to install Silex but let us use Composer.

Inside your working directory run the command

    composer require silex/silex ~1.1

With this command you have told it to: *require* adds a new package to the project *silex/silex* the name of the package in the format vendor/package *~1.1* the version of the package, *~1.1* means Greater than or equal to 1.1 and less than 2.0

As this is running you will see that it goes off and installs libraries you didn’t request, don’t worry this is meant to happen as Silex relies upon them to run.

Once it is finished you will have a file structure like this.

    toyshop/
        composer.json
        composer.lock
        vendor/
            ...

All the Silex code is stored inside of vendor with the 2 composer files contain the information about which packages and versions are installed.

## Composer.json
Let us have a look at composer.json, it should look something like this

~~~
{
    "require": {
        "silex/silex": "~1.1"
    }
}
~~~
{: .language-json}

## Composer.lock
This file contains a list of every single package installed as well as the version. This is useful as it means you don’t need to commit the _vendor/_ folder into VCS.

As long as you check in _composer.json_ and _composer.lock_ into your VCS of choice as once the code is checked out you run _composer install_ and it will download the exact have versions you currently have installed.

## Creating our first Routes
As this example is a toyshop let us think what it will need. People browsing our site will want to see the presents so lets create a route to do just that.

Let us create the file _index.php_ and it should look like this

~~~
<?php
require_once __DIR__.'/vendor/autoload.php';

$app = new Silex\Application();
// Please set to false in a production environment
$app['debug'] = true;

$toys = array(
    '00001'=> array(
        'name' => 'Racing Car',
        'quantity' => '53',
        'description' => '...',
        'image' => 'racing_car.jpg',
    ),
    '00002' => array(
        'name' => 'Raspberry Pi',
        'quantity' => '13',
        'description' => '...',
        'image' => 'raspberry_pi.jpg',
    ),
);

$app->get('/', function() use ($toys) {

    return json_encode($toys);
});

$app->get('/{stockcode}', function (Silex\Application $app, $stockcode) use ($toys) {

    if (!isset($toys[$stockcode])) {
        $app->abort(404, "Stockcode {$stockcode} does not exist.");
    }
    return json_encode($toys[$stockcode]);
});

$app->run();
~~~
{: .language-php}

There are 2 routes in this `/` and `/{stockcode}`

## Route /
This route is designed so you can GET all the toys. All it does is encode them as JSON and return that to the requester.

To allow the anonymous function to access the _$toys_ array we need to import it by adding _use ($toys)_ at the end of the definition but before the opening _{_.

## Route /{stockcode}
This will GET the information about a particular toy as passed in via the _stockcode_ parameter. As you can see it has a slightly more complicated function header to accommodate this.

As well as `use ($toys)` we are passing in a couple of variables to the function itself `Silex\Application $app` & `$stockcode`.

`Silex\Application $app` is the Silex application and helps us provide a nice 404 page if an invalid stockcode is provided. `$stockcode` is the Id of the toy we are interested in. As you can see it matches `{stockcode}` in the route.

## View your routes.
Once you have setup your webserver of choice to route everything via index.php you can browse to your routes at http://toyshop/ & http://toyshop/00001 and see the toys.

http://toyshop/00001 will display

~~~
{"name":"Raspberry Pi","quantity":"13","description":"...","image":"raspberry_pi.jpg"}
~~~
{: .language-json}

This is now in a format suitable for your frontend shop or backend telephone operator system to json_decode and display in a friendly html format.

### Why Silex?
Good question. The answer is because as it is a micro-framework it doesn’t try to get in the way by forcing it’s own preferred method of working on me and it just happens to be what I am currently using. If you wanted you could use Slim, any other micro-framework or even a full fat framework like Symfony or Zend.

## Links
[Creating a simple REST application with Silex. Part 1 of 3](/simple-rest-with-silex-part1-of-3)  
[Creating a simple REST application with Silex. Part 2 of 3](/simple-rest-with-silex-part2-of-3)  
[Creating a simple REST application with Silex. Part 3 of 3](/simple-rest-with-silex-part3-of-3)  
