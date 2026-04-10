package backend.repository;

import backend.model.Resource.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    // Find by type (lecture_hall, lab, meeting_room, equipment)
    List<Resource> findByType(String type);
    
    // Find by status (ACTIVE, OUT_OF_SERVICE)
    List<Resource> findByStatus(String status);
    
    // Find by location
    List<Resource> findByLocation(String location);
    
    // Find by capacity greater than or equal to
    List<Resource> findByCapacityGreaterThanEqual(int capacity);
    
    // Custom query: search by name containing keyword (case-insensitive)
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Resource> searchByName(String keyword);
}