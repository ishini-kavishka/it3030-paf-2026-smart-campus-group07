package backend.service;

import backend.dto.IncidentTicketRequest;
import backend.dto.TicketUpdateRequest;
import backend.exception.ResourceNotFoundException;
import backend.model.IncidentTicket;
import backend.model.TechnicianUpdate;
import backend.model.User;
import backend.repository.IncidentTicketRepository;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidentTicketService {

    @Autowired
    private IncidentTicketRepository repository;

    @Autowired
    private UserRepository userRepository;

    public List<IncidentTicket> getAllTickets() {
        return repository.findAll();
    }

    public List<IncidentTicket> getUserTickets(String userId) {
        return repository.findByCreatedByOrderByCreatedAtDesc(userId);
    }

    public IncidentTicket getTicketById(String id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    public IncidentTicket createTicket(IncidentTicketRequest request, String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setContact(request.getContact());
        ticket.setStatus("OPEN");
        if (request.getAttachments() != null) {
            ticket.setAttachments(request.getAttachments());
        }
        ticket.setCreatedBy(user.getId());
        ticket.setCreatedByUsername(user.getUsername());
        ticket.setCreatedByRole(user.getRole());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return repository.save(ticket);
    }

    public IncidentTicket updateTicket(String id, TicketUpdateRequest request, String technicianId) {
        IncidentTicket ticket = getTicketById(id);
        User tech = userRepository.findById(technicianId).orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            ticket.setStatus(request.getStatus());
        }

        if (request.getNewAttachments() != null && !request.getNewAttachments().isEmpty()) {
            ticket.getAttachments().addAll(request.getNewAttachments());
        }

        if (request.getUpdateMessage() != null && !request.getUpdateMessage().isEmpty()) {
            TechnicianUpdate update = new TechnicianUpdate(
                    tech.getId(), 
                    tech.getUsername(), 
                    request.getUpdateMessage(), 
                    LocalDateTime.now()
            );
            ticket.getTechnicianUpdates().add(update);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return repository.save(ticket);
    }

    public void deleteTicket(String id) {
        repository.deleteById(id);
    }
}
