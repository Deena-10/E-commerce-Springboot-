# Backend Setup Guide - Spring Boot Ecommerce API

This is a Spring Boot 3.5.0 ecommerce backend application built with Java 17, MySQL, JWT authentication, and OAuth2 support.

## Prerequisites

Before running the backend, ensure you have the following installed:

1. **Java 17** or higher
   - Check installation: `java -version`
   - Download from: https://www.oracle.com/java/technologies/downloads/#java17

2. **Maven 3.6+**
   - Check installation: `mvn -version`
   - Download from: https://maven.apache.org/download.cgi

3. **MySQL 8.0+**
   - Check installation: `mysql --version`
   - Download from: https://dev.mysql.com/downloads/mysql/

4. **IDE (Optional but recommended)**
   - IntelliJ IDEA, Eclipse, or VS Code with Java extensions

## Database Setup

1. **Start MySQL Server**
   - Make sure MySQL service is running on your system

2. **Create Database**
   ```sql
   CREATE DATABASE shoppino;
   ```

3. **Update Database Credentials** (if needed)
   - Edit `src/main/resources/application.properties`
   - Update these lines if your MySQL credentials differ:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/shoppino
     spring.datasource.username=root
     spring.datasource.password=your_password_here
     ```

## Configuration

The application uses `application.properties` for configuration. Key settings:

- **Server Port**: 8080 (default)
- **Database**: MySQL on localhost:3306
- **JWT Secret**: Already configured
- **OAuth2**: Google OAuth configured
- **Razorpay**: Payment gateway configured
- **Email**: Gmail SMTP configured

> ⚠️ **Note**: The `application.properties` file contains sensitive credentials. For production, use environment variables or Spring profiles.

## Running the Backend

### Option 1: Using Maven (Command Line)

1. **Navigate to the Ecom directory**:
   ```bash
   cd Ecom
   ```

2. **Build the project**:
   ```bash
   mvn clean install
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

   Or use the Maven wrapper:
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run
   
   # Linux/Mac
   ./mvnw spring-boot:run
   ```

### Option 2: Using IDE

1. **IntelliJ IDEA**:
   - Open the `Ecom` folder as a project
   - Wait for Maven to download dependencies
   - Right-click on `EcomApplication.java` → Run

2. **Eclipse**:
   - Import as Maven project
   - Right-click on `EcomApplication.java` → Run As → Java Application

3. **VS Code**:
   - Install Java Extension Pack
   - Open `EcomApplication.java` and click "Run"

### Option 3: Run JAR File

If you've already built the project, you can run the JAR:

```bash
java -jar target/Ecom-0.0.1-SNAPSHOT.jar
```

## Verify Backend is Running

Once started, you should see:
- Spring Boot banner in the console
- Database connection messages
- Server started on port 8080

Test the backend:
- Open browser: http://localhost:8080
- Health check: http://localhost:8080/api/health (if available)
- API endpoint: http://localhost:8080/api/products

## API Endpoints

The backend provides the following main endpoints:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?query={query}` - Search products
- `POST /api/products` - Add product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Verify user

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/{productId}` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order by ID

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

## Troubleshooting

### Port 8080 Already in Use
```bash
# Windows - Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

Or change the port in `application.properties`:
```properties
server.port=8081
```

### Database Connection Error
- Ensure MySQL is running
- Verify database `shoppino` exists
- Check username/password in `application.properties`
- Verify MySQL is accessible on port 3306

### Maven Build Fails
- Check internet connection (Maven downloads dependencies)
- Clear Maven cache: `mvn clean`
- Delete `.m2/repository` folder if corrupted

### Java Version Error
- Ensure Java 17+ is installed
- Set JAVA_HOME environment variable
- Verify: `java -version` shows Java 17 or higher

## Development Tips

1. **Hot Reload**: The project includes Spring Boot DevTools for automatic restarts
2. **Database Auto-Update**: `spring.jpa.hibernate.ddl-auto=update` automatically creates/updates tables
3. **SQL Logging**: SQL queries are logged to console (can be disabled in production)

## Frontend Integration

The frontend is configured to connect to:
- **Base URL**: `http://localhost:8080`
- **CORS**: Enabled for all origins (configured in controllers)

Make sure the backend is running before starting the frontend!

## Project Structure

```
Ecom/
├── src/
│   ├── main/
│   │   ├── java/demo/webproject/
│   │   │   ├── controller/     # REST API endpoints
│   │   │   ├── service/        # Business logic
│   │   │   ├── repository/     # Data access layer
│   │   │   ├── Entity/         # JPA entities
│   │   │   ├── dto/            # Data transfer objects
│   │   │   ├── security/       # Security configuration
│   │   │   └── config/         # Spring configuration
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml                     # Maven dependencies
└── README.md                   # This file
```

## Dependencies

Key dependencies include:
- Spring Boot Web
- Spring Data JPA
- Spring Security
- MySQL Connector
- JWT (JSON Web Tokens)
- OAuth2 Client
- Razorpay SDK
- Spring Mail

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure database is running and accessible
4. Check that port 8080 is available

