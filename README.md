# GS

To run Postgres database using Docker, follow these steps:

1. Make sure you have Docker installed on your system.
2. Open a terminal or command prompt.
3. Run the following command to start a Postgres container:

   ```bash
   docker run --name GS -e POSTGRES_PASSWORD=gs -e POSTGRES_USER=gs -e POSTGRES_DB=gs -p 5432:5432 -d postgres
