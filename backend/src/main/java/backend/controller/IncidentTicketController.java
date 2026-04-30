package backend.controller;

import backend.dto.IncidentTicketRequest;
import backend.dto.TicketUpdateRequest;
import backend.model.IncidentTicket;
import backend.model.User;
import backend.repository.UserRepository;
import backend.service.IncidentTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*", maxAge = 3600)
public class IncidentTicketController {

    @Autowired
    private IncidentTicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<IncidentTicket>> getMyTickets() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(ticketService.getUserTickets(user.getId()));
    }

    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(@RequestBody IncidentTicketRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(ticketService.createTicket(request, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentTicket> updateTicket(
            @PathVariable String id,
            @RequestBody TicketUpdateRequest request) {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(ticketService.updateTicket(id, request, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok("Ticket deleted successfully.");
    }
}
