---
layout: post
path: /react/reactjs/javascript/cryptography/diffie/hellman/key/exchange/2016/09/09/trading-secrets-secretly.html
title:  "Trading Secrets Secretly"
date:   2016-09-09 22:05:11
categories: react reactjs javascript cryptography diffie hellman key exchange
---

## Sending Messages Across the Battlefield

For thousands of years people have been trying to hiding information. The
Nazis had the Enigma, Julius Caesar used a Caesar Cipher, the Freemasons
had the Pigpen Cipher, and Mary Queen of Scots used a substitution cipher
alphabet while imprisioned by her cousin.

The Caesar Cipher was particularly weak, as letters were just shifted three
places to obscure the message. While initially useful, once discovered the
messages could be easily intersepted.

The Freemasons used the Pigpen Cipher. This substituted letters for symbols,
which allowed easy hiding of messages. Though once the codebook was
discovered, the messages transmitted could again be easily intersepted.

Mary Queen of Scots was imprisioned by her cousin (Queen Elisabeth I) for
plotting to take the throne. She, and her Catholic supporters were in
communication where she consented to the assasination of the Protestant
Queen. Little did she know, she responded directly to Elisabeth's spymaster,
who had already broken the code.

While these examples use substituions or codebooks, symmetric ciphers use
keys which are traded, which allow the sender and recipient to communicate.

There does however seem to be a very glaring issue here. How do you share a
key with a person you've never met? If you send the key, how could you
trust that intermediate party isn't trying to steal your secrets?

## Exchanging a Key

Up until the 1970's, the only way to share a key was to physically share
the key. But in 1976 the a paper which discussed generating a mutually
agreed key from public and private keys was published. This is known as the
**Diffie Hellman Key Exchange** after its creators
Whitfield Diffie and Martin Hellman.

## Diffie Hellman Key Exchange

In this example, we're using a simplified explanation of the key exchange
using colours. This works as an example, as it allows us to show how you
could create a secret colour between two parties who have never met, while
not providing enough information for a third party to calculate the secret.

<p data-height="1400px" data-theme-id="light" data-slug-hash="amOPra" data-default-tab="result" data-user="amonger" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/amonger/pen/amOPra/">Diffie Hellman Key Exchange</a> by Alan monger (<a href="http://codepen.io/amonger">@amonger</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

In reality, large primes are used as keys as they're more difficult to
calculate (as we want to make it as difficult as possible to break), and
the numbers are multiplied instead of added.
