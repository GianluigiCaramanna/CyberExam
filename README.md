# SETUP KEYCLOAK USING DOCKER AND POSTGRES

In questa repository si trova il file docker-compose.yml in cui vengono settate tutte le variabili e le porte. Qualora si volesse runnare il file bisogna scrivere da terminale il seguente comando: 

> docker-compose up -d

Docker provvede a creare un container (nome: cyberexam_pgadmin) contenente 3 sotto-container in cui instanzia 3 immagini separate: 

- Un'immagine per keycloak importata da dockerhub (nome: emilianonigro cybersecexam:latest); 

- Un'immagine per il database, in questo caso postgresql (nome: postgres:13.2);

- Un'immagine per il client psql (nome: dpage/pgadmin4:5.1). 