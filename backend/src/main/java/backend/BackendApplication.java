package backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner init(MongoTemplate mongoTemplate) {
		return args -> {
			System.out.println("✅ Connected to MongoDB: " + mongoTemplate.getDb().getName());
			System.out.println("✅ Smart Campus Backend Started Successfully!");
		};
	}
}