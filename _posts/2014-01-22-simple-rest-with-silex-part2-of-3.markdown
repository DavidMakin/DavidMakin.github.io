---
layout: post
title: Creating a simple REST application with Silex. Part 2 of 3
date: 2014-01-22 19:12:23 +0000
description: 
img: silex.jpg # Add image post (optional)
fig-caption: Photo by <a href="https://unsplash.com/@zoltantasi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Zoltan Tasi</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
 # Add figcaption (optional)
tags: [Silex, REST, PHP]
---

In [part 1](/simple-rest-with-silex-part1-of-3) you installed Silex and setup 2 routes, `/` and `/{stockcode}`. Now let us expand upon those by adding a **POST** and a **DELETE** route.
The 2 routes we created use **GET** but to make your application truly useful you will want to use at least 1 more type and that is **POST**.

## Adding a POST route
Let us add a route to allow new products to be added. To our index.php file we will need to add the following somewhere before the $app->run(); line.

~~~
<?php
$app->post('/', function (Silex\Application $app, Symfony\Component\HttpFoundation\Request $request) {

    $name = $request->get('name');
    $quantity = $request->get('quantity');
    $description = $request->get('description');
    $image = $request->get('image');
    
    // Code to add the toy into the toy db
    // and return a toy id
    //$toy_id = create_toy($name, $quantity, $description, $image);
    //$toy = get_toy($toy_id);
    
    // For now lets just assume we have saved it
    $toy = array(
        '00003' => array(
            'name' => $name,
            'quantity' => $quantity,
            'description' => $description,
            'image' => $image,
        )
    );
    
    // Useful to return the newly added details
    // HTTP_CREATED = 200
    return new Symfony\Component\HttpFoundation\Response(json_encode($toy), HTTP_CREATED);
});
~~~
{: .language-php}


## Deleting an item of stock
At some point we will want to delete items. For that you need a DELETE route

~~~
<?php
$app->delete('/{toy_id}', function (Silex\Application $app, Symfony\Component\HttpFoundation\Request $request, $toy_id) {
    
    if (delete_toy($toy_id)) {
        // The delete went ok and we can now return a no content value
        // HTTP_NO_CONTENT = 204
        $responseMessage = '';
        $responseCode = Symfony\Component\HttpFoundation\Response::HTTP_NO_CONTENT;
    } else {
        // Something went wrong
        $responseMessage = 'reason for error';
        $response_code = Symfony\Component\HttpFoundation\Response::HTTP_INTERNAL_SERVER_ERROR;
    }
    
    return new Symfony\Component\HttpFoundation\Response($responseMessage, $responseCode);
});
~~~
{: .language-php}

## The same route but different verbs
You might have noticed that we now have multiple URLs in the application that are the same, /. Acutally they are not, one uses the GET verb, one the POST and one DELETE. How does it know which to use? Well that depends on the request type it receives and explaining how to send POST, DELETE, PUT etc is a big post in itself. Have a read of REST API Tutorial to learn which verb to use in which situation.

## How do I test these routes
For **GET** you can simply browse to it in your webclient of choice but the others are a little more difficult.

If you are comfortable with the command line you can use curl. Something like this should do

    curl -i -H "Accept: application/json" -X DELETE http://127.0.0.1/00002

Where:  
`-i` show response headers  
`-H` pass request headers to the resource  
`-X` pass a HTTP method name

A much nicer way if to use a REST client, PHPStorm has one builtin or you can get a browser addon, RESTClient for Firefox or Postman for Chrome. If you want to consume a route in your client code you can use plain old php fopen, curl or the nice Guzzle library.

## Part 3
Now that we have several routes in index.php it is starting to look messy and you should be able to see that adding everything into 1 file will cause us headaches down the road in terms of readability and maintainability. Part 3 will look at moving these into separate libraries.

## Links
[Creating a simple REST application with Silex. Part 1 of 3](/simple-rest-with-silex-part1-of-3)  
[Creating a simple REST application with Silex. Part 2 of 3](/simple-rest-with-silex-part2-of-3)  
[Creating a simple REST application with Silex. Part 3 of 3](/simple-rest-with-silex-part3-of-3)  
