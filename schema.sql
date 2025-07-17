-- Users Table
CREATE TABLE Users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR NOT NULL,
    fullname VARCHAR NOT NULL,
    age INT,
    phone VARCHAR,
    password VARCHAR NOT NULL
);

-- Movies Table
CREATE TABLE Movies (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    genre VARCHAR,
    rating FLOAT,
    image_url VARCHAR,
    description VARCHAR
);

-- Theatres Table
CREATE TABLE Theatres (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    location VARCHAR,
    rating FLOAT
);

-- Screens Table
CREATE TABLE Screens (
    id VARCHAR PRIMARY KEY,
    theater_id VARCHAR NOT NULL,
    name VARCHAR,
    FOREIGN KEY (theater_id) REFERENCES Theatres (id)
);

-- Seats Table
CREATE TABLE Seats (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    screen_id VARCHAR NOT NULL,
    price FLOAT,
    FOREIGN KEY (screen_id) REFERENCES Screens (id)
);

-- Shows Table
CREATE TABLE Shows (
    id VARCHAR PRIMARY KEY,
    start_time VARCHAR NOT NULL,
    end_time VARCHAR NOT NULL,
    movie_id VARCHAR NOT NULL,
    screen_id VARCHAR NOT NULL,
    date TIMESTAMP NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES Movies (id),
    FOREIGN KEY (screen_id) REFERENCES Screens (id)
);

-- Tickets Table
CREATE TABLE Tickets (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    seat_id VARCHAR NOT NULL,
    show_id VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users (id),
    FOREIGN KEY (seat_id) REFERENCES Seats (id),
    FOREIGN KEY (show_id) REFERENCES Shows (id)
);

-- User Login Tokens
CREATE TABLE LoginTokens (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    token VARCHAR NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users (id)
);
