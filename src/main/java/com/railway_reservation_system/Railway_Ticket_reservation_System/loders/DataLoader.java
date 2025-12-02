package com.railway_reservation_system.Railway_Ticket_reservation_System.loders;

import com.railway_reservation_system.Railway_Ticket_reservation_System.module.FoodItem;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Role;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.Train;
import com.railway_reservation_system.Railway_Ticket_reservation_System.module.User;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.FoodItemRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.TrainRepository;
import com.railway_reservation_system.Railway_Ticket_reservation_System.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private TrainRepository trainRepository;
    @Autowired private FoodItemRepository foodItemRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // --- UPDATED SECTION: Seed Users ---
        if (userRepository.count() == 0) {
            System.out.println("Seeding initial users...");

            // 1. Admin User
            User admin = new User();
            admin.setName("Dhiraj Parida (Admin)");
            admin.setEmail("dhiraj@gmail.com");
            admin.setPassword(passwordEncoder.encode("pass123"));
            admin.setRole(Role.ADMIN);
            admin.setPhoneNumber("+918625977324"); // Example phone

            // 2. Regular User
            User user = new User();
            user.setName("John Doe (User)");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(Role.USER);
            user.setPhoneNumber("+912000000002"); // Example phone

            // 3. TTE Staff User
            User tte = new User();
            tte.setName("TTE Raj");
            tte.setEmail("tte@gmail.com");
            tte.setPassword(passwordEncoder.encode("tte123"));
            tte.setRole(Role.TTE);
            tte.setPhoneNumber("+913000000003"); // TTE's phone

            // 4. Police Staff User
            User police = new User();
            police.setName("Officer Singh");
            police.setEmail("police@gmail.com");
            police.setPassword(passwordEncoder.encode("police123"));
            police.setRole(Role.POLICE);
            police.setPhoneNumber("+914000000004"); // Police's phone

            userRepository.saveAll(List.of(admin, user, tte, police));
            System.out.println("Seeded Admin, User, TTE, and Police users.");
        }
        // --- END OF UPDATED SECTION ---


        // Seed Trains (Unchanged)
        if (trainRepository.count() == 0) {
            System.out.println("Seeding trains...");
            Train train1 = new Train();
            train1.setName("Rajdhani Express");
            train1.setFromStation("NDLS");
            train1.setToStation("BOM");
            train1.setDeparture("17:00");
            train1.setArrival("09:00");
            train1.setDuration("16h 0m");
            train1.setPrice(2500);
            train1.setSeatsAvailable(100);

            Train train2 = new Train();
            train2.setName("Shatabdi Express");
            train2.setFromStation("NDLS");
            train2.setToStation("BPL");
            train2.setDeparture("06:00");
            train2.setArrival("14:00");
            train2.setDuration("8h 0m");
            train2.setPrice(1200);
            train2.setSeatsAvailable(150);

            trainRepository.saveAll(List.of(train1, train2));
            System.out.println("Seeded trains.");
        }

        // Seed Food Items (Unchanged)
        if (foodItemRepository.count() == 0) {
            System.out.println("Seeding food items...");
            FoodItem item1 = new FoodItem();
            item1.setName("Veg Thali");
            item1.setDescription("Rice, Roti, Dal, Sabzi, Curd");
            item1.setPrice(150.00);
            item1.setAvailable(true);

            FoodItem item2 = new FoodItem();
            item2.setName("Water Bottle");
            item2.setDescription("1 Litre");
            item2.setPrice(20.00);
            item2.setAvailable(true);

            FoodItem item3 = new FoodItem();
            item3.setName("Tea/Coffee");
            item3.setDescription("Hot beverage");
            item3.setPrice(25.00);
            item3.setAvailable(true);

            foodItemRepository.saveAll(List.of(item1, item2, item3));
            System.out.println("Seeded food items.");
        }

    }
}