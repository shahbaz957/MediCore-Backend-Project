# Hospital Management System Backend

A robust and scalable backend for a Hospital Management System built using **JavaScript**, **Node.js**, **Express.js**, **MongoDB**, **JWT**, **Multer** and **Cloudinary**. This project provides a comprehensive API for managing hospital operations, including users, patients, doctors, departments, hospitals, and medical records. It implements secure authentication, file uploads, and efficient data handling.

## Features
- **User Management**: Register, login, logout, and manage user profiles with JWT-based authentication.
- **Patient Management**: Create, update, and retrieve patient details.
- **Doctor Management**: Manage doctor profiles, availability, and assignments.
- **Department Management**: Handle hospital departments and their details.
- **Hospital Management**: Manage hospital information and configurations.
- **Medical Records**: Store and retrieve patient medical records with file upload support via Cloudinary.
- **Secure Authentication**: Token-based authentication using JWT for secure access.
- **File Uploads**: Image and document uploads for medical records and profiles using Cloudinary.
- **CORS Support**: Configurable Cross-Origin Resource Sharing for secure frontend integration.
- **Scalable Architecture**: Modular structure with separate controllers, models, routes, and utilities.

## Technologies Used
- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for creating RESTful APIs.
- **MongoDB**: NoSQL database for storing data, with Mongoose for schema modeling.
- **JWT**: JSON Web Tokens for secure authentication.
- **Cloudinary**: Cloud-based service for managing file uploads (images/documents).
- **Nodemon**: Development tool for auto-restarting the server.
- **dotenv**: Environment variable management.
- **Other Dependencies**: bcrypt (password hashing), cors, cookie-parser, multer (file uploads).

## Project Structure
```plaintext
Hospital_Management_System/
├── public/                 # Static files (e.g., uploaded images/documents)
│   └── temp/              # Temporary storage for uploaded files
├── src/                   # Source code
│   ├── controllers/       # Request handlers for API endpoints
│   ├── db/                # Database connection and configuration
│   ├── middlewares/       # Custom middleware (e.g., authentication, error handling)
│   ├── models/            # Mongoose schemas and models
│   ├── routes/            # Express route definitions
│   └── utils/             # Utility functions (e.g., error handling, file uploads)
├── .env                   # Environment variables (not tracked in git)
├── .gitignore             # Files and directories to ignore in git
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shahbaz957/MediCore-Backend-Project.git
   cd MediCore-Backend-Project
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=your_frontend_url
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Install MongoDB**:
   Ensure MongoDB is installed locally or use a cloud-based MongoDB service like MongoDB Atlas.

## Configuration
- **MongoDB**: Update the `MONGODB_URI` in the `.env` file with your MongoDB connection string.
- **Cloudinary**: Configure Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) for file uploads.
- **JWT Secret**: Set a strong `JWT_SECRET` for secure token generation.
- **CORS**: Specify allowed origins in `CORS_ORIGIN` to enable communication with your frontend.

## Running the Project
1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   This uses `nodemon` to auto-restart the server on file changes.

2. **Production Build**:
   ```bash
   npm start
   ```

3. The server will run on `http://localhost:8000` (or the port specified in `.env`).

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
Most endpoints require a JWT token for authentication. Include the token in the `Authorization` header as follows:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### User Routes (`/api/v1/user`)
| Method | Endpoint                | Description                          | Request Body/Parameters                          | Response                       |
|--------|-------------------------|--------------------------------------|--------------------------------------------------|--------------------------------|
| POST   | `/register`             | Register a new user                  | `{ username, email, password, role }`           | `{ user, token }`              |
| POST   | `/login`                | Login a user                        | `{ email, password }`                           | `{ user, token }`              |
| POST   | `/logout`               | Logout a user                       | None                                            | `{ message: "Logged out" }`    |
| GET    | `/profile`              | Get user profile                    | None (requires JWT)                             | `{ user }`                     |
| PUT    | `/profile`              | Update user profile                 | `{ username, email, avatar? }`                  | `{ user }`                     |

#### Patient Routes (`/api/v1/patient`)
| Method | Endpoint                | Description                          | Request Body/Parameters                          | Response                       |
|--------|-------------------------|--------------------------------------|--------------------------------------------------|--------------------------------|
| POST   | `/`                     | Create a new patient                 | `{ name, age, gender, contact, address }`       | `{ patient }`                  |
| GET    | `/`                     | Get all patients                    | None                                            | `{ patients }`                 |
| GET    | `/:id`                  | Get patient by ID                   | `id` (path parameter)                           | `{ patient }`                  |
| PUT    | `/:id`                  | Update patient details              | `id`, `{ name, age, gender, contact, address }` | `{ patient }`                  |
| DELETE | `/:id`                  | Delete a patient                    | `id` (path parameter)                           | `{ message: "Patient deleted" }` |

#### Doctor Routes (`/api/v1/doctor`)
| Method | Endpoint                | Description                          | Request Body/Parameters                          | Response                       |
|--------|-------------------------|--------------------------------------|--------------------------------------------------|--------------------------------|
| POST   | `/`                     | Create a new doctor                  | `{ name, specialization, contact, hospitalId }` | `{ doctor }`                   |
| GET    | `/`                     | Get all doctors                     | None                                            | `{ doctors }`                  |
| GET    | `/:id`                  | Get doctor by ID                    | `id` (path parameter)                           | `{ doctor }`                   |
| PUT    | `/:id`                  | Update doctor details               | `id`, `{ name, specialization, contact }`       | `{ doctor }`                   |
| DELETE | `/:id`                  | Delete a doctor                     | `id` (path parameter)                           | `{ message: "Doctor deleted" }` |

#### Department Routes (`/api/v1/department`)
| Method | Endpoint                | Description                          | Request Body/Parameters                          | Response                       |
|--------|-------------------------|--------------------------------------|--------------------------------------------------|--------------------------------|
| POST   | `/`                     | Create a new department              | `{ name, description, hospitalId }`             | `{ department }`               |
| GET    | `/`                     | Get all departments                 | None                                            | `{ departments }`              |
| GET    | `/:id`                  | Get department by ID                | `id` (path parameter)                           | `{ department }`               |
| PUT    | `/:id`                  | Update department details           | `id`, `{ name, description }`                   | `{ department }`               |
| DELETE | `/:id`                  | Delete a department                 | `id` (path parameter)                           | `{ message: "Department deleted" }` |

#### Hospital Routes (`/api/v1/hospital`)
| Method | Endpoint                | Description                          | Request Body/Parameters                          | Response                       |
|--------|-------------------------|--------------------------------------|--------------------------------------------------|--------------------------------|
| POST   | `/`                     | Create a new hospital                | `{ name, address, contact, logo? }`             | `{ hospital }`                 |
| GET    | `/`                     | Get all hospitals                   | None                                            | `{ hospitals }`                |
| GET    | `/:id`                  | Get hospital by ID                  | `id` (path parameter)                           | `{ hospital }`                 |
| PUT    | `/:id`                  | Update hospital details             | `id`, `{ name, address, contact, logo? }`       | `{ hospital }`                 |
| DELETE | `/:id`                  | Delete a hospital                   | `id` (path parameter)                           | `{ message: "Hospital deleted" }` |

#### Medical Record Routes (`/api/v1/record`)
| Method | Endpoint                | Description                          | Request Body/Parameters                          | Response                       |
|--------|-------------------------|--------------------------------------|--------------------------------------------------|--------------------------------|
| POST   | `/`                     | Create a new medical record          | `{ patientId, doctorId, diagnosis, file? }`     | `{ record }`                   |
| GET    | `/`                     | Get all medical records              | None                                            | `{ records }`                  |
| GET    | `/:id`                  | Get medical record by ID             | `id` (path parameter)                           | `{ record }`                   |
| PUT    | `/:id`                  | Update medical record                | `id`, `{ diagnosis, file? }`                    | `{ record }`                   |
| DELETE | `/:id`                  | Delete a medical record              | `id` (path parameter)                           | `{ message: "Record deleted" }` |

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a Pull Request.

## Author 
# **Mirza Shahbaz Ali Baig**  
Software Engineer | AI Engineer | Full Stack Developer (in progress)  

- 📧 [Email me](mailto:mirzashahbazbaig724@gmail.com)  
- 🔗 [Connect with me on LinkedIn](https://www.linkedin.com/in/mirza-shahbaz-ali-baig-3391b3248)
