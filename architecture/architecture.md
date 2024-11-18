# Architecture

:heavy_check_mark:_(COMMENT) Add a description of the architecture of your application and create a diagram like the one below. Link to the diagram in this document._

![eShopOnContainers Architecture](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/media/eshoponcontainers-development-architecture.png)

[Source](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/introduce-eshoponcontainers-reference-app)

# Uitleg:

De webapp (gebruikt door gebruiker, redacteur of hoofd redacteur) zal synchroon communiceren met de API Gateway.
Deze zal op zijn beurt communiceren met de correcte microservices.

Communicatie intern backend: 

US7: Als redacteur wil ik ingediende posts kunnen bekijken en goedkeuren of afwijzen zodat...
US9: Als redacteur wil ik opmerkingen kunnen toevoegen bij afwijzen van een post, zodat …

Om een post een status te geven moet de post eerst opgehaald worden om vervolgens deze een status te geven.
Om een post een opmerking te geven moet deze ook eerst opgehaald worden om vervolgens aan dit post id een opmerking te kunnen samenhangen.

Hiervoor word RabbitMQ gebruikt om de post op te halen. Dit zal asynchroon gebeuren.

US10 : Als gebruiker wil ik een reactie kunnen plaatsen op een post, zodat …

Om een reactie te geven moet de post opgehaald worden. Hiervoor zal OpenFeign gebruikt worden. Dit zal synchroon gebeuren.
