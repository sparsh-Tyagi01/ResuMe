# ResuMe 📄✨

ResuMe is a premium, interactive resume builder web application that features a modern GSAP-driven scrollytelling interface, real-time builder options, and a dynamic Admin Templates Catalog for custom resume styles.

---

## 🚀 Key Features

### 1. Dynamic Resume Builder
* **Interactive Drag & Drop**: Rearrange resume sections (Summary, Experience, Education, Projects, Skills, etc.) dynamically using `@dnd-kit`.
* **Real-time Customization**: Pick custom accents, spacing margins (tight, normal, loose), typography (EB Garamond, Inter, Plus Jakarta Sans), and border designs.
* **Auto-Save Security**: Real-time synchronization keeps your progress saved.
* **PDF Export**: Generate high-fidelity ATS-friendly PDFs instantly using `html2pdf.js`.

### 2. Premium Landing Experience
* **GSAP Scrollytelling**: Seamless folding transitions that shift between light and dark modes elegantly on scroll.
* **Fanned CardStack Carousel**: Swipeable, draggable, and keyboard-responsive stack for choosing resume presets.
* **Interactive Resource Modals**: Read documentation, terms, and policies in a sleek animated interface directly from the page footer.

### 3. Admin Custom Template Catalog
* **Dynamic Design Form**: Add custom layouts (e.g. Overleaf-style templates: Banner, Split Grid, Line Accent) from a visual admin panel.
* **Section Hierarchy Ordering**: Drag/move fields up and down to customize default sections.
* **Manage Catalog**: View, register, and delete template definitions stored in the database.

### 4. Robust Infrastructure
* **Security & OTP Verification**: Node.js/Express authorization backed by JSON Web Tokens and one-time password email verifications.
* **Media Assets Pipeline**: Cloudinary integrations to store and fetch user assets.

---

## 🛠️ Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, TypeScript |
| **Styles & Motion** | TailwindCSS v4, GSAP (`@gsap/react`), Framer Motion, Lucide icons |
| **State & Drag** | React Context API, `@dnd-kit` core/sortable |
| **Backend Core** | Node.js, Express |
| **Database** | MongoDB, Mongoose |
| **Emails & Assets** | Nodemailer (SMTP), Cloudinary API |

---

## 📂 Project Structure

```text
ResuMe/
├── backend/                  # Express REST API Server
│   ├── config/               # Mailer / Mail transporter configurations
│   ├── controllers/          # Business logic (Auth, Resume, Template)
│   ├── database/             # MongoDB connection scripts
│   ├── middlewares/          # JWT tokens & role check gates
│   ├── models/               # Mongoose Schemas (User, Resume, Template)
│   └── routes/               # Express endpoints mount
└── frontend/                 # React SPA client
    ├── public/               # Static icons and graphic assets
    └── src/
        ├── components/       # Shared layout and template components
        ├── context/          # Auth context state providers
        ├── lib/              # Axios instance configuration
        └── pages/            # View pages (Landing, AdminTemplates, Builder)
```

---

## ⚙️ Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/resume
   BASE_URL=http://localhost:5173
   JWT_SECRET=your_super_secret_jwt_key
   EMAIL_USER=your_smtp_email@gmail.com
   EMAIL_PASS=your_smtp_app_password
   ADMIN_EMAIL=sparshtyagi5544@gmail.com
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Setup Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
4. Run the development client:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.

---

## 🧪 Development Operations

* **TypeScript Compilation Check**:
  ```bash
  npm run build
  ```
  Runs `tsc -b && vite build` on the client.
* **Code Style Linter**:
  ```bash
  npm run lint
  ```
  Validates code standards using ESLint.

---

## 🔒 License
This project is licensed under the ISC License.
