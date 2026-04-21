package backend.service;

import backend.dto.BookingRequestDTO;
import backend.dto.BookingResponseDTO;
import backend.enums.BookingStatus;
import backend.model.Booking;
import backend.model.Resource.Resource;
import backend.repository.BookingRepository;
import backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private NotificationService notificationService;

    public BookingResponseDTO createBooking(@NonNull BookingRequestDTO request, @NonNull String userId) {
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));

        if (!"ACTIVE".equals(resource.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resource is not active");
        }

        if (request.getExpectedAttendees() != null && request.getExpectedAttendees() > resource.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected attendees exceed resource capacity (" + resource.getCapacity() + ")");
        }

        if (resource.getAvailableFrom() != null && request.getStartTime().isBefore(resource.getAvailableFrom())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking start time cannot be before resource available time (" + resource.getAvailableFrom() + ")");
        }

        if (resource.getAvailableTo() != null && request.getEndTime().isAfter(resource.getAvailableTo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking end time cannot be after resource available time (" + resource.getAvailableTo() + ")");
        }

        // Conflict Checking: Prevent more than one booking per day for the resource
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDate(request.getResourceId(),
                request.getDate());

        boolean hasConflict = existingBookings.stream()
                .anyMatch(b -> b.getStatus() == BookingStatus.PENDING || b.getStatus() == BookingStatus.APPROVED);

        if (hasConflict) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Resource is already booked for this day");
        }

        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setUserId(userId);
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        notificationService.createNotification(userId, "Your booking request for " + resource.getName() + " on " + booking.getDate() + " is currently PENDING admin approval.");
        return mapToDTO(savedBooking, resource);
    }

    public List<BookingResponseDTO> getUserBookings(@NonNull String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToDTOWithResourceFetch)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToDTOWithResourceFetch)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO updateBooking(@NonNull String id, @NonNull BookingRequestDTO request, @NonNull String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending bookings can be updated");
        }

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));

        if (request.getExpectedAttendees() != null && request.getExpectedAttendees() > resource.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected attendees exceed resource capacity (" + resource.getCapacity() + ")");
        }

        if (resource.getAvailableFrom() != null && request.getStartTime().isBefore(resource.getAvailableFrom())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking start time cannot be before resource available time (" + resource.getAvailableFrom() + ")");
        }

        if (resource.getAvailableTo() != null && request.getEndTime().isAfter(resource.getAvailableTo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking end time cannot be after resource available time (" + resource.getAvailableTo() + ")");
        }

        // Conflict Checking: Prevent more than one booking per day for the resource
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDate(request.getResourceId(),
                request.getDate());

        boolean hasConflict = existingBookings.stream()
                .filter(b -> !b.getId().equals(id))
                .anyMatch(b -> b.getStatus() == BookingStatus.PENDING || b.getStatus() == BookingStatus.APPROVED);

        if (hasConflict) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Resource is already booked for this day");
        }

        booking.setResourceId(request.getResourceId());
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setUpdatedAt(LocalDateTime.now());

        return mapToDTO(bookingRepository.save(booking), resource);
    }

    public BookingResponseDTO updateBookingStatus(@NonNull String id, @NonNull BookingStatus newStatus, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        booking.setStatus(newStatus);
        if (newStatus == BookingStatus.REJECTED) {
            booking.setRejectionReason(reason);
        }
        booking.setUpdatedAt(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);

        Resource resource = resourceRepository.findById(booking.getResourceId()).orElse(null);
        String resourceName = resource != null ? resource.getName() : "Unknown Resource";
        
        if (newStatus == BookingStatus.APPROVED) {
            notificationService.createNotification(booking.getUserId(), "Your booking for " + resourceName + " on " + booking.getDate() + " has been APPROVED! [ACTION:MY_BOOKINGS]");
        } else if (newStatus == BookingStatus.REJECTED) {
            notificationService.createNotification(booking.getUserId(), "Your booking for " + resourceName + " on " + booking.getDate() + " was REJECTED. [REASON]" + reason + "[/REASON]");
        }

        return mapToDTO(savedBooking, resource);
    }

    public BookingResponseDTO cancelBooking(@NonNull String id, @NonNull String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is already cancelled or rejected");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return mapToDTOWithResourceFetch(bookingRepository.save(booking));
    }

    public void deleteBooking(@NonNull String id, @NonNull String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!booking.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        bookingRepository.deleteById(id);
    }

    private BookingResponseDTO mapToDTOWithResourceFetch(Booking booking) {
        Resource resource = resourceRepository.findById(booking.getResourceId()).orElse(null);
        return mapToDTO(booking, resource);
    }

    private BookingResponseDTO mapToDTO(Booking booking, Resource resource) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setResourceId(booking.getResourceId());
        dto.setResourceName(resource != null ? resource.getName() : "Unknown Resource");
        dto.setUserId(booking.getUserId());
        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setExpectedAttendees(booking.getExpectedAttendees());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }
}
