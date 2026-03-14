# CineGo Backend ERD

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string googleId UK
        string facebookId UK
        string githubId UK
        string photo
        string phone
        date dateOfBirth
        string[] prefer_genres
        ObjectId[] watchlist
    }

    CINEMA {
        ObjectId _id PK
        string name
        string address
        string city
        string location.type
        number[] location.coordinates
    }

    HALL {
        ObjectId _id PK
        ObjectId cinema FK
        string hallName
        number totalSeats
        string[] seatLayout.rowLabels
        number seatLayout.seatsPerRow
    }

    MOVIE {
        ObjectId _id PK
        number tmdbId
        string title
        date releaseDate
        number duration
        number voteAverage
        number voteCount
        string overview
        string posterPath
        string backdropPath
    }

    TIMESLOT {
        ObjectId _id PK
        ObjectId movie FK
        ObjectId hall FK
        date start_time
        date end_time
        date show_date
        number base_price
    }

    BOOKING {
        ObjectId _id PK
        ObjectId showtime FK
        ObjectId hall FK
        ObjectId movie FK
        ObjectId cinema FK
        ObjectId user FK
        string[] seats
        number seatCount
        number ticketPrice
        number totalPrice
        string status
    }

    SEAT_RESERVATION {
        ObjectId _id PK
        ObjectId showtime FK
        ObjectId booking FK
        string seatId
    }

    SEAT {
        ObjectId _id PK
        ObjectId cinema FK
        number seat_no
        string seat_type
    }

    CINEMA ||--o{ HALL : has
    HALL ||--o{ TIMESLOT : schedules
    MOVIE ||--o{ TIMESLOT : shown_in

    TIMESLOT ||--o{ BOOKING : booked_by
    USER ||--o{ BOOKING : makes
    CINEMA ||--o{ BOOKING : sold_at
    HALL ||--o{ BOOKING : for_hall
    MOVIE ||--o{ BOOKING : for_movie

    BOOKING ||--o{ SEAT_RESERVATION : reserves
    TIMESLOT ||--o{ SEAT_RESERVATION : blocks_seat

    USER }o--o{ MOVIE : watchlist
    CINEMA ||--o{ SEAT : contains
```

## Notes

- `seat_reservation` enforces unique seat booking per showtime via unique index on `(showtime, seatId)`.
- `timeslot` enforces uniqueness on `(movie, hall, show_date, start_time)`.
- `booking.user` is optional (`null` allowed for guest booking).
- `seat` model exists but is not currently used in booking flow (seat layout comes from `hall.seatLayout`).
