package backend.dto;

import java.util.List;

public class IncidentTicketRequest {
    private String title;
    private String category;
    private String description;
    private String priority;
    private String contact;
    private List<String> attachments;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public List<String> getAttachments() { return attachments; }
    public void setAttachments(List<String> attachments) { this.attachments = attachments; }
}
