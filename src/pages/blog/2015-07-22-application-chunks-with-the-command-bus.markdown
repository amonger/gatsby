---
layout: post
path: /php/commands/command/bus/ddd/domain/driven/design/cqrs/2015/07/22/application-chunks-with-the-command-bus.html
title:  "Application Chunks with the Command Bus"
date:   2015-07-22 21:39:15
categories: PHP commands command bus DDD domain driven design CQRS
---

## The command bus

I've recently been playing around with Laravel and have been using the command
bus for several projects. I've found the ability to abstract chunks of  functionality from your controllers makes a lot more sense, and allows easier integration testing later on, as well as making it easier to reuse code. On top of this, it's far easier to see what your application is doing by looking at the structure of the application.

## How it works
The command bus is an implementation of the command pattern. You pass it a Data Transport Object (DTO) which then gets resolved by the bus in a 1-1 mapping. So every DTO (the command) gets resolved by a single handler.

As this is a 1-1 mapping some libraries forgo the separation of DTO and handler, and allow you to have a command handle itself.

## An example
In this example I'll use a library I created, [Command](https://github.com/amonger/command).

Imagine you have a chunk of functionality in your controller which handles billing. You might want to reuse this in several areas and put it into a service, but this would still mean binding it quite closely to your application.
By separating this out into a command, you could create a library which could be used on several projects.

{% highlight php %}
<?php
class BuyItemsInCartCommand implements SelfHandling, ApplicationInterface
{
    private $card;
    private $cart;
    private $application;

    public function __construct(Card $card, Cart $cart)
    {
        $this->card = $card;
        $this->cart = $cart;
    }

    public function handle()
    {
        $payments = $this->application->getServiceManager('Payments');
        $payments->charge($this->card, $this->cart);

        $this->application->dispatchEvent('payment.success', new SucessfulPaymentEvent);
    }

    public setApplication(Application $application)
    {
        $this->application = $application;
    }
}
{% endhighlight %}

In this example, we've charge the customers card, and dispatched a new event. We can handle any exception thrown by the charge function in our controller so we can output to the customer any issue that they may have with their card. The class name is also very descriptive, so it is easy to track down when we're looking to make any modifications later on.

## CQRS

CQRS (Command Query Responsibility Segregation) is taking this pattern one step further. For large enterprise applications this may be a desirable way to separate a monolith, and by using a command bus they can achive this.

CQRS is identical to the command bus, except it replaces the service layer completely with query objects, which are commands dedicated to a single query.
