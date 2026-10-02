import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Manages ride listings, searching, and bookings.
 * Stores rides dynamically without hardcoded demo rides.
 */
public class RideManager {
    private final ArrayList<Ride> rides;
    private final AtomicInteger rideIdGenerator;

    public RideManager() {
        this.rides = new ArrayList<Ride>();
        this.rideIdGenerator = new AtomicInteger(100);
    }

    /**
     * Posts a new ride.
     */
    public synchronized Ride postRide(String source, String destination, String driverName, String time, int seatsAvailable) {
        if (source == null || source.trim().isEmpty() ||
            destination == null || destination.trim().isEmpty() ||
            driverName == null || driverName.trim().isEmpty() ||
            time == null || time.trim().isEmpty()) {
            return null;
        }

        int validSeats = (seatsAvailable > 0) ? seatsAvailable : 1;
        String rideId = "RIDE-" + rideIdGenerator.incrementAndGet();

        Ride newRide = new Ride(rideId, source.trim(), destination.trim(), driverName.trim(), time.trim(), validSeats);
        rides.add(newRide);
        return newRide;
    }

    /**
     * Searches for rides matching source and destination substrings.
     */
    public synchronized List<Ride> searchRides(String source, String destination) {
        List<Ride> matches = new ArrayList<Ride>();
        String srcQuery = (source == null) ? "" : source.trim().toLowerCase();
        String dstQuery = (destination == null) ? "" : destination.trim().toLowerCase();

        for (Ride ride : rides) {
            boolean matchesSource = srcQuery.isEmpty() || ride.getSource().toLowerCase().contains(srcQuery);
            boolean matchesDest = dstQuery.isEmpty() || ride.getDestination().toLowerCase().contains(dstQuery);

            if (matchesSource && matchesDest) {
                matches.add(ride);
            }
        }
        return matches;
    }

    /**
     * Books a seat on a ride by ID.
     */
    public synchronized boolean bookRide(String rideId, StringBuilder outcomeMessage) {
        if (rideId == null || rideId.trim().isEmpty()) {
            if (outcomeMessage != null) outcomeMessage.append("Please specify a valid Ride ID.");
            return false;
        }

        Ride target = null;
        for (Ride r : rides) {
            if (r.getRideId().equalsIgnoreCase(rideId.trim())) {
                target = r;
                break;
            }
        }

        if (target == null) {
            if (outcomeMessage != null) outcomeMessage.append("Ride ").append(rideId).append(" was not found.");
            return false;
        }

        if (target.getSeatsAvailable() <= 0) {
            if (outcomeMessage != null) {
                outcomeMessage.append("Ride ").append(rideId).append(" is completely full! (0 seats available).");
            }
            return false;
        }

        boolean booked = target.bookSeat();
        if (booked) {
            if (outcomeMessage != null) {
                outcomeMessage.append("Successfully booked a seat on ride ")
                              .append(target.getRideId())
                              .append(" with driver ")
                              .append(target.getDriverName())
                              .append("! ")
                              .append(target.getSeatsAvailable())
                              .append(" seat(s) remaining.");
            }
            return true;
        } else {
            if (outcomeMessage != null) {
                outcomeMessage.append("Could not book seat: No seats remaining.");
            }
            return false;
        }
    }

    /**
     * Retrieves all rides in memory.
     */
    public synchronized List<Ride> getAllRides() {
        return new ArrayList<Ride>(rides);
    }

    /**
     * Retrieves a specific ride by its ID.
     */
    public synchronized Ride getRideById(String rideId) {
        if (rideId == null) return null;
        for (Ride r : rides) {
            if (r.getRideId().equalsIgnoreCase(rideId.trim())) {
                return r;
            }
        }
        return null;
    }

    /**
     * Removes/completes a ride by ID.
     */
    public synchronized boolean removeRide(String rideId) {
        if (rideId == null) return false;
        return rides.removeIf(r -> r.getRideId().equalsIgnoreCase(rideId.trim()));
    }

    public synchronized int getRideCount() {
        return rides.size();
    }
}
