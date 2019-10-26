---
layout: post
path: /alexa/javascript/lambda/dot/echo/amazon/home/automation/2017/01/28/writing-skills-with-alexa.html
title:  "Writing Skills with Alexa"
date:   2017-01-28 11:44:15
categories: alexa javascript lambda dot echo amazon home automation
---

## A bit of background

I've always loved the idea of home automation, and with the release of voice controlled devices, such as Alexa, Siri, and Google Home, we can now control devices, or query information on the internet.

Here I'll show how to create an Alexa skill, and what steps you need to go through to create your own.

## Setting up alexa
Amazon have made writing skills surprisingly easy. You're able to use several languages on their Lambda platform, which handles all the requests (though you can use an external server secured with SSL).

We first need to setup the interaction model with alexa through their [amazon developer console](https://developer.amazon.com/edw/home.html#/skills/list).

### Skill name
When writing a skill, you'll need to choose an invocation name which will get triggered when you ask alexa to perform a task.
For example, if you're looking at writing a skill which interacts with the Kodi media player, you'd say ```Alexa, ask Kodi to play south park```. You're also able to trigger and action by using ```Alexa, tell Kodi to play south park```.

### Interaction Model
The first thing we need to figure out what tasks we want to execute. We might want to start playing a movie, bring up a tv series list, or play the next episode in a tv series.

We define this in JSON, where we define our _Intents_, which are keywords which we bind our _Utterances_ and code to. We also have _Slots_ which are variables that have a defined type.

{% highlight json %}
{
  "intents": [
    {
      "intent": "TVShowSearchIntent",
      "slots": [
        {
          "name": "TVShowName",
          "type": "TVSHOW"
        }
      ]
    },
    {
      "intent": "MovieSearchIntent",
      "slots": [
        {
          "name": "MovieTitle",
          "type": "MOVIETITLE"
        }
      ]
    }
  ]
}
{% endhighlight %}

### Slots
Slots are variables which have an associated type. The type generally has predefined variables(see [Slot Type reference](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/slot-type-reference)), however if we're using a custom slot type (like we're using above), we can have undefined variables which get passed through to our code.

Annoyingly, some slot types are (as yet) unavailable in the UK, which is why we needed to setup our own slot type for tv shows and movie types.

### Phrasing (Utterances)
The next thing we need to define is how we're going to interact with Alexa. This just maps a phrase, and integrates variables (if any).

```
TVShowSearchIntent to put on {TVShowName}
TVShowSearchIntent to put on the tv show {TVShowName}
TVShowSearchIntent to play the tv show {TVShowName}
TVShowSearchIntent to on {TVShowName}
MovieSearchIntent to put on the movie {MovieTitle}
MovieSearchIntent play {MovieTitle}
MovieSearchIntent to play {MovieTitle}
MovieSearchIntent to play the movie {MovieTitle}
```

As you can see above, the slot name is the variable name, which is assiciated with an intent. This allows us to interact with the skill naturally, and not have to ensure there is one specific way of asking for information.

## The code
Now we've set up how we're going to interact with Alexa, we now need to write some code to actually perform some tasks. For this, we're going to use Lambda.

### Lambda
[Lambda is part of Amazons "Amazon Web Services"](https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions). This is pretty cool as it only runs as long as the process is running, so you don't need to keep a server constantly running, and waiting for Alexa to communicate with it. Lambda also is free for the first million requests, and $0.20 for each million requests after that. So unless you end up publishing an insanely popular skill, it's not going to be very expensive.

#### Setting up
After signing into AWS, follow Lambda > Blank Function > Select Alexa Skills Kit.

Here you will need to name your function, but also set up some configuration. Scroll down to Role under _Lambda function handler and role_ > create a custom role > under IAM choose lambda_basic_execution > Click allow.

You'll notice under advanced settings you can increase the memory and timeout. Currently, we don't need to worry about this, though if you are using a slow service, you might need to configure this later on.

Click next, and then create function.

### Alexa SDK
Amazon have made an SDK which provides a class which generates responses. You can get a copy [here](https://raw.githubusercontent.com/amzn/alexa-skills-kit-js/master/samples/helloWorld/src/AlexaSkill.js), or you can use npm to install the official sdk using ```npm i --save alexa-sdk```, which we'll later upload to Lambda.

### Writing the code
Make a Alexa skill directory which is going to hold your index.js file, and any node modules, or your AlexaSkill js module. The downside of using npm is you won't be able to live update your code on Lambda, though you will be able to utilise npm libraries in your project.


{% highlight javascript %}
var AlexaSkill = require('./AlexaSkill');
var http = require('http');


var Kodi = function () {
    AlexaSkill.call(this, undefined);
};

// Extend AlexaSkill
Kodi.prototype = Object.create(AlexaSkill.prototype);
Kodi.prototype.constructor = Kodi;

Kodi.prototype.intentHandlers = {
    "TVShowSearchIntent": function (intent, session, response) {
        TvShowSearchIntent(intent.slots.TVShowName.value).then(data => {
            response.tellWithCard(
                `I've put on ${data.show.title}`,
                `Put on ${data.show.title}`,
                `Put on ${data.show.title}`
            );
        })
    },
    "MovieSearchIntent": function (intent, session, response) {
        MovieSearchIntent(intent.slots.MovieTitle.value).then(data => {
            response.tellWithCard(
                `I've started playing ${data.movie.title}`,
                `Started playing ${data.movie.title}`,
                `Started playing ${data.movie.title}`
            );
        })

    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

function TvShowSearchIntent (tvShowTitle) {
    var endpoint = 'http://mykodiapp.net:3000/show/' + tvShowTitle;

    return new Promise((resolve, reject) => {
        getUrl(endpoint).then(data => {
            resolve(data);
        });
    });
}

function MovieSearchIntent (movieTitle) {
    var endpoint = 'http://mykodiapp.net:3000/movie/' + movieTitle;

    return new Promise((resolve, reject) => {
        getUrl(endpoint).then(data => {
            resolve(data);
        });
    });
}

function getUrl(endpoint) {
    var body = "";
    return new Promise((resolve, reject) => {
        http.get(endpoint, (response) => {
            response.on('data', (chunk) => {
                body += chunk
            });
            response.on('end', () => {
                resolve(JSON.parse(body));
            });
        });
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var kodi = new Kodi();
    kodi.execute(event, context);
};

{% endhighlight %}

You can see above that the intentHandlers define an object literal of the intents we defined in our Interaction Model. This is what is executed when our utterance has been detected. The slot data is passed across in the `intent.slots` array, which we can then pass across to some other method. In this example, we're passing it across to different methods to get resolved, and returning a promise, so we only send a response once we've recieved the data we're expecting. Depending on how fast the external sources you're looking at, you might need to bump up the execution time on your Lambda function (under configuration).

Finally, you just need to upload your files in a bundled zip file. As long as your file is not huge, you're going to be able to edit the page window, otherwise you'll just need to upload another zipped up bundle again.

## Finishing up
You now need to link your Lambda function to your Alexa Skill. You should notice in the top right corner of the lambda skill will have an **ARN** (Amazon Resource Number). You need to paste this reference into the configuration section in the Config Section of your Alexa Skill.

If you're using the same account Alexa is already linked to, you'll now be able to issue commands.
