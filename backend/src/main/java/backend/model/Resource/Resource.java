package backend.model.Resource;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;

import java.time.LocalTime;

@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotBlank(message = "Resource type is required")
    private String type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private LocalTime availableFrom;
    private LocalTime availableTo;

    @NotBlank(message = "Status is required")
    private String status;

    // Default Constructor
    public Resource() {}

    // Parameterized Constructor
    public Resource(String name, String type, int capacity, String location, 
                    LocalTime availableFrom, LocalTime availableTo, String status) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
        this.status = status;
    }

    // ========== Getters ==========
    public String getId() { 
        return id; 
    }

    public String getName() { 
        return name; 
    }

    public String getType() { 
        return type; 
    }

    public int getCapacity() { 
        return capacity; 
    }

    public String getLocation() { 
        return location; 
    }

    public LocalTime getAvailableFrom() { 
        return availableFrom; 
    }

    public LocalTime getAvailableTo() { 
        return availableTo; 
    }

    public String getStatus() { 
        return status; 
    }

    // ========== Setters ==========
    public void setId(String id) { 
        this.id = id; 
    }

    public void setName(String name) { 
        this.name = name; 
    }

    public void setType(String type) { 
        this.type = type; 
    }

    public void setCapacity(int capacity) { 
        this.capacity = capacity; 
    }

    public void setLocation(String location) { 
        this.location = location; 
    }

    public void setAvailableFrom(LocalTime availableFrom) { 
        this.availableFrom = availableFrom; 
    }

    public void setAvailableTo(LocalTime availableTo) { 
        this.availableTo = availableTo; 
    }

    public void setStatus(String status) { 
        this.status = status; 
    }

    // ========== toString() for debugging ==========
    @Override
    public String toString() {
        return "Resource{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", capacity=" + capacity +
                ", location='" + location + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}