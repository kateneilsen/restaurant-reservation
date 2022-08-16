# Restaurant Reservation System

Live Application:
<https://restaurant-reservations-4emjxwc0v-kateneilsen.vercel.app>

## Summary of Application

### Technology Used

- React.js
- HTML
- CSS
- Bootstrap
- Express
- PostgreSQL
- Knex.js

## API Documentation

| Method | URL                                  | Description                                                     |
| ------ | ------------------------------------ | --------------------------------------------------------------- |
| GET    | /reservations                        | Lists reservations for current date                             |
| POST   | /reservations                        | Creates a new reservation                                       |
| GET    | /reservations?date=YYYY-MM-DD        | Lists all reservations for a given date                         |
| GET    | /reservations/:reservation_id        | Reads reservation by reservation id                             |
| PUT    | /reservations/:reservation_id        | Updates reservation by reservation id                           |
| PUT    | /reservations/:reservation_id/status | Updates reservation status by reservation id                    |
| GET    | /tables                              | Lists all tables                                                |
| POST   | /tables                              | Creates a new table                                             |
| PUT    | /tables/:table_id/seat               | Updates table with a given reservation id (seats a reservation) |
| DELETE | /tables/:table_id/seat               | Removes a reservation id from the table                         |

## Screenshots of Application

## Installation Instructions
