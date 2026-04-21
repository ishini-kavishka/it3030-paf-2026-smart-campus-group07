package backend.controller;

import backend.dto.BookingRequestDTO;
import backend.dto.BookingResponseDTO;
import backend.enums.BookingStatus;
import backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") // Adjust in production
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // POST /api/bookings
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody @NonNull BookingRequestDTO request,
            org.springframework.security.core.Authentication authentication) {
        String userId = authentication.getName();
        BookingResponseDTO response = bookingService.createBooking(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // GET /api/bookings/my
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            org.springframework.security.core.Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    // GET /api/bookings
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // PUT /api/bookings/{id}
    @PutMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> updateBooking(
            @PathVariable @NonNull String id,
            @Valid @RequestBody @NonNull BookingRequestDTO request,
            org.springframework.security.core.Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(bookingService.updateBooking(id, request, userId));
    }

    // PATCH /api/bookings/{id}/status  -- For Admin approval/rejection
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable @NonNull String id,
            @RequestBody Map<String, String> updates) {
        BookingStatus status = BookingStatus.valueOf(updates.get("status"));
        String reason = updates.get("reason");
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, reason));
    }

    // PATCH /api/bookings/{id}/cancel
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable @NonNull String id,
            org.springframework.security.core.Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

    // DELETE /api/bookings/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable @NonNull String id,
            org.springframework.security.core.Authentication authentication) {
        String userId = authentication.getName();
        bookingService.deleteBooking(id, userId);
        return ResponseEntity.noContent().build();
    }
}
