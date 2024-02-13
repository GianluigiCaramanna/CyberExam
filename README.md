# SETUP KEYCLOAK USING DOCKER AND POSTGRES

In questa repository si trova il file docker-compose.yml in cui vengono settate tutte le variabili e le porte. Qualora si volesse runnare il file bisogna scrivere da terminale il seguente comando: 

Linux: 
> sh start.sh

Windows: 
> bash start.sh

Docker provvede a creare un container (nome: cyberexam_pgadmin) contenente 3 sotto-container in cui instanzia 3 immagini separate: 

- Un'immagine per keycloak predefinita (quay.io/keycloak/keycloak). Vedere documentazione Keycloak: https://www.keycloak.org/getting-started/getting-started-docker 

- Un'immagine per il database, in questo caso postgresql (nome: postgres);

- Un'immagine per il client psql (nome: dpage/pgadmin4). 