README


##DATABASE##

create DATABASE DriverScore;
use driverscore;

create table users(
userId INT auto_increment primary key,
firstName varchar(50) unique NOT NULL,
lastName varchar(50) unique NOT NULL,
email varchar(50) unique NOT NULL,
password varchar(255) NOT NULL,
createdAt TIMESTAMP DEFAULT NOW());

CREATE TABLE Vehicle (
vehicleId int PRIMARY KEY ,
userId int,   
make VARCHAR(100),
model VARCHAR(100),
year INT,
licenseNo VARCHAR(50),
plateNo VARCHAR(50),
createdAt TIMESTAMP DEFAULT NOW(),
foreign key (userId) REFERENCES users(userId)
);

CREATE TABLE Trip (
    tripId int PRIMARY KEY ,
    userId int,
    vehicleId int,
    startTs TIMESTAMP,
    endTs TIMESTAMP,
    distanceKm DECIMAL,
    durationSec INT,
    averageSpeedKph DECIMAL,
    scoreTotal DECIMAL,
    status VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (vehicleId) REFERENCES Vehicle(vehicleId)
);

CREATE TABLE TripSummary (
    tripId int PRIMARY KEY,
    eventsCount INT,
    harshBrakingCount INT,
    rapidAccelCount INT,
    speedingDurationSec INT,
    maxSpeed DECIMAL,
    notes TEXT,
    FOREIGN KEY (tripId) REFERENCES Trip(tripId)
);

CREATE TABLE TelemetryPoint (
    pointId int PRIMARY KEY ,
    tripId int,
    timestamp TIMESTAMP,
    speed DECIMAL,
    acceleration DECIMAL,
    lattitude double,
    longitude double,
	FOREIGN KEY (tripId) REFERENCES Trip(tripId)
);

CREATE TABLE TripEvent (
    eventId int PRIMARY KEY,
    tripId int,
    type VARCHAR(50) NOT NULL,       -- HARSH_BRAKE, RAPID_ACCEL, SPEEDING
    timestamp TIMESTAMP,
    severity VARCHAR(50),
    peakValue DECIMAL,
	lattitude double,
    longitude double,
    FOREIGN KEY (tripId) REFERENCES Trip(tripId)
);


