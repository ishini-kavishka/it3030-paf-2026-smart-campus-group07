package backend.dto;

import java.util.List;

public class TicketUpdateRequest {
    private String status;
    private String updateMessage;
    private List<String> newAttachments;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUpdateMessage() { return updateMessage; }
    public void setUpdateMessage(String updateMessage) { this.updateMessage = updateMessage; }

    public List<String> getNewAttachments() { return newAttachments; }
    public void setNewAttachments(List<String> newAttachments) { this.newAttachments = newAttachments; }
}
