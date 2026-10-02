/**
 * Ride model representing an offered ride between campus and local destinations.
 */
public class Ride {
    private String rideId;
    private String source;
    private String destination;
    private String driverName;
    private String time;
    private int seatsAvailable;
    private int totalSeats;

    public Ride(String rideId, String source, String destination, String driverName, String time, int seatsAvailable) {
        this.rideId = rideId;
        this.source = source;
        this.destination = destination;
        this.driverName = driverName;
        this.time = time;
        this.seatsAvailable = Math.max(0, seatsAvailable);
        this.totalSeats = this.seatsAvailable;
    }

    public String getRideId() {
        return rideId;
    }

    public void setRideId(String rideId) {
        this.rideId = rideId;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public synchronized int getSeatsAvailable() {
        return seatsAvailable;
    }

    public synchronized void setSeatsAvailable(int seatsAvailable) {
        this.seatsAvailable = Math.max(0, seatsAvailable);
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    /**
     * Atomically books one seat on this ride.
     * Decrements seat count safely and guarantees it never drops below 0.
     *
     * @return true if a seat was successfully reserved; false if 0 seats available.
     */
    public synchronized boolean bookSeat() {
        if (seatsAvailable > 0) {
            seatsAvailable--;
            return true;
        }
        return false;
    }

    public synchronized boolean isAvailable() {
        return seatsAvailable > 0;
    }

    @Override
    public String toString() {
        return "Ride[" + rideId + ": " + source + " -> " + destination + ", Driver=" + driverName + ", Seats=" + seatsAvailable + "/" + totalSeats + "]";
    }
}
