package backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "incident_tickets")
public class IncidentTicket {
    @Id
    private String id;
    private String title;
    private String category;
    private String description;
    private String status; // OPEN, IN_PROGRESS, RESOLVED
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private String contact;
    private List<String> attachments = new ArrayList<>();
    private List<TechnicianUpdate> technicianUpdates = new ArrayList<>();
    private String createdBy;
    private String createdByUsername;
    private String createdByRole;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IncidentTicket() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public List<String> getAttachments() { return attachments; }
    public void setAttachments(List<String> attachments) { this.attachments = attachments; }

    public List<TechnicianUpdate> getTechnicianUpdates() { return technicianUpdates; }
    public void setTechnicianUpdates(List<TechnicianUpdate> technicianUpdates) { this.technicianUpdates = technicianUpdates; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getCreatedByUsername() { return createdByUsername; }
    public void setCreatedByUsername(String createdByUsername) { this.createdByUsername = createdByUsername; }

    public String getCreatedByRole() { return createdByRole; }
    public void setCreatedByRole(String createdByRole) { this.createdByRole = createdByRole; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
