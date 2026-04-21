package backend.controller;

import backend.model.Resource.Resource;
import backend.model.User;
import backend.repository.ResourceRepository;
import backend.repository.UserRepository;
import backend.service.NotificationService;
import backend.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"})
public class ResourceController {

    @Value("${demo.mode.enabled:false}")
    private boolean demoModeEnabled;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // ========== GET Endpoints ==========
    
    // GET all resources (with optional filters)
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer minCapacity) {
        
        if (demoModeEnabled) {
            System.out.println("ℹ️ Serving resources in Demo Mode (Bypassing Database)");
            return ResponseEntity.ok(getDemoResources());
        }

        try {
            if (type != null) {
                return ResponseEntity.ok(resourceRepository.findByType(type));
            }
            if (location != null) {
                return ResponseEntity.ok(resourceRepository.findByLocation(location));
            }
            if (status != null) {
                return ResponseEntity.ok(resourceRepository.findByStatus(status));
            }
            if (minCapacity != null) {
                return ResponseEntity.ok(resourceRepository.findByCapacityGreaterThanEqual(minCapacity));
            }
            return ResponseEntity.ok(resourceRepository.findAll());
        } catch (Exception e) {
            // FALLBACK: Return mock data if DB is unreachable
            System.err.println("⚠️ Database unreachable. Serving demo data: " + e.getMessage());
            return ResponseEntity.ok(getDemoResources());
        }
    }

    private List<Resource> getDemoResources() {
        Resource r1 = new Resource();
        r1.setId("demo-1");
        r1.setName("Main Lecture Hall A");
        r1.setType("Classroom");
        r1.setCapacity(120);
        r1.setLocation("Building 01, Level 02");
        r1.setStatus("ACTIVE");
        r1.setAvailableFrom(java.time.LocalTime.of(8, 0));
        r1.setAvailableTo(java.time.LocalTime.of(20, 0));

        Resource r2 = new Resource();
        r2.setId("demo-2");
        r2.setName("Advanced Computing Lab");
        r2.setType("Lab");
        r2.setCapacity(40);
        r2.setLocation("Building 03, Level 01");
        r2.setStatus("ACTIVE");
        r2.setAvailableFrom(java.time.LocalTime.of(9, 0));
        r2.setAvailableTo(java.time.LocalTime.of(18, 0));

        Resource r3 = new Resource();
        r3.setId("demo-3");
        r3.setName("Faculty Meeting Room");
        r3.setType("Meeting Room");
        r3.setCapacity(15);
        r3.setLocation("Admin Block, Level 03");
        r3.setStatus("OUT_OF_SERVICE");
        r3.setAvailableFrom(java.time.LocalTime.of(8, 30));
        r3.setAvailableTo(java.time.LocalTime.of(17, 30));

        return java.util.Arrays.asList(r1, r2, r3);
    }

    // GET one resource by ID
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable @NonNull String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return ResponseEntity.ok(resource);
    }

    // GET resources by type (path variable version)
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Resource>> getResourcesByType(@PathVariable @NonNull String type) {
        List<Resource> resources = resourceRepository.findByType(type);
        return ResponseEntity.ok(resources);
    }

    // GET active resources only
    @GetMapping("/active")
    public ResponseEntity<List<Resource>> getActiveResources() {
        return ResponseEntity.ok(resourceRepository.findByStatus("ACTIVE"));
    }

    // ========== POST Endpoint ==========
    
    // CREATE new resource
    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        if (resource.getStatus() == null || resource.getStatus().isEmpty()) {
            resource.setStatus("ACTIVE");
        }
        if (demoModeEnabled) {
            System.out.println("ℹ️ Demo Mode: Simulating resource creation for '" + resource.getName() + "'");
            resource.setId("demo-" + System.currentTimeMillis());
            return new ResponseEntity<>(resource, HttpStatus.CREATED);
        }
        Resource newResource = resourceRepository.save(resource);

        // Broadcast notification to all non-admin users
        String fromTime = newResource.getAvailableFrom() != null ? newResource.getAvailableFrom().toString() : "08:00";
        String toTime   = newResource.getAvailableTo()   != null ? newResource.getAvailableTo().toString()   : "20:00";
        String broadcastMsg = "\uD83C\uDFEB New Facility Available: " + newResource.getName()
                + " | Type: " + newResource.getType()
                + " | Location: " + newResource.getLocation()
                + " | Capacity: " + newResource.getCapacity() + " people"
                + " | Hours: " + fromTime + " - " + toTime
                + " [ACTION:CATALOGUE]";

        List<User> targetUsers = userRepository.findByRoleNot("ROLE_ADMIN");
        for (User u : targetUsers) {
            notificationService.createNotification(u.getUsername(), broadcastMsg);
        }

        return new ResponseEntity<>(newResource, HttpStatus.CREATED);
    }

    // ========== PUT Endpoint ==========
    
    // UPDATE existing resource
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(
            @PathVariable @NonNull String id,
            @Valid @RequestBody Resource resourceDetails) {

        if (demoModeEnabled) {
            System.out.println("ℹ️ Demo Mode: Simulating resource update for id '" + id + "'");
            resourceDetails.setId(id);
            return ResponseEntity.ok(resourceDetails);
        }

        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        existingResource.setName(resourceDetails.getName());
        existingResource.setType(resourceDetails.getType());
        existingResource.setCapacity(resourceDetails.getCapacity());
        existingResource.setLocation(resourceDetails.getLocation());
        existingResource.setAvailableFrom(resourceDetails.getAvailableFrom());
        existingResource.setAvailableTo(resourceDetails.getAvailableTo());
        existingResource.setStatus(resourceDetails.getStatus());

        Resource updatedResource = resourceRepository.save(existingResource);
        return ResponseEntity.ok(updatedResource);
    }

    // ========== DELETE Endpoint ==========
    
    // DELETE resource by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable @NonNull String id) {
        if (demoModeEnabled) {
            System.out.println("ℹ️ Demo Mode: Simulating deletion of resource id '" + id + "'");
            return ResponseEntity.noContent().build();
        }
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        resourceRepository.delete(resource);
        return ResponseEntity.noContent().build();
    }

    // ========== PATCH Endpoint (Bonus) ==========
    
    // UPDATE status only (ACTIVE/OUT_OF_SERVICE)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Resource> updateResourceStatus(
            @PathVariable @NonNull String id,
            @RequestParam String status) {

        if (demoModeEnabled) {
            System.out.println("ℹ️ Demo Mode: Simulating status update for id '" + id + "' to '" + status + "'");
            Resource r = new Resource();
            r.setId(id);
            r.setStatus(status);
            return ResponseEntity.ok(r);
        }

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setStatus(status);
        Resource updatedResource = resourceRepository.save(resource);
        return ResponseEntity.ok(updatedResource);
    }
}