# NAVS Global School Website - Mini Report

## 1. Project Explanation

The NAVS Global School (NAVS) website is a modern, responsive web application designed to showcase the school's mission, values, programs, and facilitate student registration. The website aims to provide prospective students and parents with comprehensive information about the school, its academic excellence, character-building focus, and leadership development.

### Mission
To provide exceptional education rooted in Christian values, fostering academic excellence and character development, preparing students to become confident, compassionate leaders who make positive contributions to society.

### Vision
To be the leading educational institution that transforms lives through holistic education, creating future leaders who embody integrity, excellence, and service to humanity in everything they do.

### Core Values
- Discipline: Church-inspired discipline building character and respect.
- Integrity: Honesty and moral courage in all actions.
- Excellence: Striving for the highest standards in all we do.
- Leadership: Developing confident, responsible leaders.
- Wisdom: Combining knowledge with understanding.
- Compassion: Fostering empathy and service to others.

## 2. Models

### Payment Model and Flow
The website integrates with the Chapa payment gateway to handle student registration fees. The payment API initializes transactions with details such as student name, grade, parent name, email, phone, and message. A unique transaction reference is generated using the `nanoid` library. Payment callbacks are handled to confirm transaction status.

### Student Registration Data Model
Student registration data includes:
- Student Name
- Grade
- Parent Name
- Email
- Phone Number
- Additional Message

This data is used both for payment processing and registration confirmation.

## 3. Modules

The website is organized into several main modules/pages:

- **About:** Provides the school's story, history, mission, vision, and core values.
- **Admissions:** Information and processes related to student admissions.
- **Contact:** Contact details and communication form.
- **Events:** School events and activities.
- **Faculty:** Information about teachers and staff.
- **Pricing:** Tuition and fee details.
- **Programs:** Academic programs offered.
- **Register:** Student registration form and process.
- **Register Success:** Confirmation page after successful registration.

Additionally, there are reusable UI components organized under the `components/ui` directory, including buttons, forms, dialogs, navigation menus, and more.

## 4. Tools

The project uses the following tools and technologies:

- **Next.js:** React framework for server-side rendering and static site generation.
- **React:** JavaScript library for building user interfaces.
- **TypeScript:** Typed superset of JavaScript for improved developer experience.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Radix UI:** Accessible, unstyled UI primitives for React.
- **Supabase:** Backend as a service for database and authentication (client library used).
- **nanoid:** Library for generating unique IDs.
- **Chapa Payment Gateway:** Payment processing integration for registration fees.
- **Other Libraries:** React Hook Form, Zod for form validation, Lucide React for icons, Recharts for charts, and more.

## 5. Setup

### Dependencies
All dependencies are listed in `package.json`. Key dependencies include Next.js, React, Tailwind CSS, Radix UI components, Supabase client, and various utility libraries.

### Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs linting checks.

## 6. How to Run

### Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000` to view the site.

### Production
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```

---

This mini report provides an overview of the NAVS Global School website project, its structure, models, tools, and instructions for setup and running.
