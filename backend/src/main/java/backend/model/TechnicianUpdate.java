package backend.model;

import java.time.LocalDateTime;

public class TechnicianUpdate {
    private String technicianId;
    private String technicianName;
    private String updateMessage;
    private LocalDateTime updateDate;

    public TechnicianUpdate() {}

    public TechnicianUpdate(String technicianId, String technicianName, String updateMessage, LocalDateTime updateDate) {
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.updateMessage = updateMessage;
        this.updateDate = updateDate;
    }

    public String getTechnicianId() { return technicianId; }
    public void setTechnicianId(String technicianId) { this.technicianId = technicianId; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getUpdateMessage() { return updateMessage; }
    public void setUpdateMessage(String updateMessage) { this.updateMessage = updateMessage; }

    public LocalDateTime getUpdateDate() { return updateDate; }
    public void setUpdateDate(LocalDateTime updateDate) { this.updateDate = updateDate; }
}
