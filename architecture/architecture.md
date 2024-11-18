# Architecture

:heavy_check_mark:_(COMMENT) Add a description of the architecture of your application and create a diagram like the one below. Link to the diagram in this document._

![eShopOnContainers Architecture](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/media/eshoponcontainers-development-architecture.png)

[Source](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/introduce-eshoponcontainers-reference-app)

# Uitleg:

De webapp (gebruikt door gebruiker, redacteur of hoofd redacteur) zal synchroon communiceren met de API Gateway.
Deze zal op zijn beurt communiceren met de correcte microservices.

De microservices zouden kunnen communiceren via RabbitMQ. Dan word er een message bus aangemaakt om bijvoorbeeld een review te plaatsen en deze te linken aan een post.
Deze post word dan opgehaald via RabbitMQ.

Er zou ook gewerkt kunnen worden met OpenFeign om te communiceren tussen CommentService en PostService.

Samengevat:
Communicatie tussen PostService & ReviewService (om post op te halen) = RabbitMQ
Communicatie tussen PostService & CommentService (om post op te halen) = OpenFeign