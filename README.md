# QPIAI File Management Web Application

This project is a web application built with Next.js, designed for managing file uploads with robust user authentication and role-based access control. It provides different dashboards and functionalities based on user roles such as Admin, Manager, and Guest.

## Features

*   **User Authentication:** Secure user authentication powered by Clerk.
*   **Role-Based Access Control:** Differentiated access and functionalities for Admin, Manager, and Guest users.
*   **File Uploads:** Seamless file uploading capabilities.
*   **File Management:** View and manage uploaded files.
*   **User Management:** (Admin) Add, view, and manage users and their roles.
*   **Admin Dashboard:** Overview and administrative controls for administrators.
*   **Manager Dashboard:** Specific functionalities tailored for managers.
*   **User Profiles:** Dedicated pages for users to view and manage their profiles.

## Technologies Used

*   **Framework:** Next.js (React)
*   **Authentication:** Clerk
*   **Styling:** Tailwind CSS
*   **Language:** TypeScript
*   **File Uploads:** Uploadthing, Formidable
*   **UI Components:** Radix UI
*   **Utilities:** clsx, lucide-react, react-hot-toast

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

*   Node.js (v18 or higher recommended)
*   npm or Yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sharath-wq/QpiAi-mechine-task.git
    cd qpiai
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root directory of the project and add the following environment variables. You will need to obtain these from Clerk and Uploadthing.

    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    ```

### Running the Application

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
.
├── app/                  # Next.js pages and API routes
│   ├── api/              # API routes (e.g., file upload)
│   ├── dashboard/        # Admin dashboard page
│   ├── guest/            # Guest specific page
│   ├── manager/          # Manager specific page
│   ├── profile/          # User profile page
│   ├── upload/           # File upload page
│   ├── uploads/          # Page to display uploaded files
│   └── user/             # User management page
├── components/           # Reusable React components
│   ├── ui/               # Shadcn UI components
│   └── ...               # Other custom components (e.g., file-uploader, users-list)
├── constants/            # Application constants
├── contexts/             # React contexts (e.g., upload context)
├── lib/                  # Utility functions
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── ...                   # Other configuration files (next.config.ts, tsconfig.json, etc.)
```

## Routes and Access Control

This application implements role-based access control to manage user permissions across different routes.

| Route             | Description                                   | Roles with Access                               |
| :---------------- | :-------------------------------------------- | :---------------------------------------------- |
| `/`               | Home page                                     | All (Guest, User, Manager, Admin)               |
| `/guest`          | Guest-specific content                        | Guest                                           |
| `/dashboard`      | Admin dashboard                               | Admin                                           |
| `/manager`        | Manager-specific dashboard                    | Manager, Admin                                  |
| `/profile`        | User profile management                       | User, Manager, Admin                            |
| `/upload`         | File upload page                              | User, Manager, Admin                            |
| `/uploads`        | View uploaded files                           | User, Manager, Admin                            |
| `/user`           | User management (add/view/manage users)       | Admin                                           |
| `/api/upload`     | API endpoint for file uploads                 | User, Manager, Admin (Authenticated users)      |