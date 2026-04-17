package backend.repository;

import backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    List<Booking> findByUserId(String userId);

    // Find any overlapping bookings for a given resource, date, and overlapping times
    // and status is either PENDING or APPROVED
    @Query("{ 'resourceId': ?0, 'date': ?1, 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 }, 'status': { $in: ['PENDING', 'APPROVED'] } }")
    List<Booking> findConflictingBookings(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime);

    List<Booking> findByResourceIdAndDate(String resourceId, LocalDate date);
}
