# FreelancerMate AI 🚀

An AI-powered workspace copilot for freelancers. Freelancers can paste client requests, briefs, or project emails to automatically generate:
- **Project Summary & Scope Analysis**
- **Functional & Non-Functional Requirements**
- **Optimal Tech Stack Recommendations with Architectural Justifications**
- **System Architecture Overview**
- **Sprint Timelines & Phased Milestones**
- **Client Clarification Questions** (to prevent scope creep)
- **Time & Pricing Estimates in INR (₹)**
- **Client Proposal Letters**

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Axios, Modern Glassmorphism CSS
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **AI Engine**: Google Gemma model via Ollama local API (No fine-tuning or training needed)
- **Security**: Bcrypt.js password hashing & validation

---

## 📁 Project Structure

```text
FreelancerMateAI/
├── package.json                   # Root script orchestrator (concurrently)
├── .gitignore
├── README.md                      # Documentation & API Guide
│
├── server/                        # Backend API (Express + MongoDB + Ollama)
│   ├── .env                       # Environment variables
│   ├── .env.example               # Example environment variables
│   ├── package.json
│   ├── testConnection.js          # MongoDB automated verification script
│   └── src/
│       ├── config/
│       │   └── db.js              # Mongoose connection setup
│       ├── models/
│       │   ├── User.js            # User Schema (name, email, age, password)
│       │   └── Project.js         # Project Schema (title, clientRequest, budget, analysis, etc.)
│       ├── services/
│       │   ├── ollamaService.js   # Ollama API client (health check, prompt dispatch, error handling)
│       │   └── promptService.js   # Prompt engineering & JSON output validation
│       ├── controllers/
│       │   ├── userController.js  # User registration & query logic
│       │   └── aiController.js    # AI status and Gemma project analysis controller
│       ├── routes/
│       │   ├── userRoutes.js      # /api/users routes
│       │   └── aiRoutes.js        # /api/ai routes (/analyze, /status)
│       └── server.js              # Main Express entry point
│
└── client/                        # Frontend SPA (React + Vite)
    ├── index.html
    ├── vite.config.js             # Port 3000 + /api proxy to backend (port 5000)
    ├── package.json
    └── src/
        ├── App.jsx                # Interactive dashboard
        ├── App.css
        ├── index.css
        └── main.jsx
```

---

## 🤖 Ollama & Gemma Setup Guide

The AI backend uses the **Gemma** open weights model served locally via **Ollama**.

### Step 1: Install Ollama
- **Windows**: Download and run the installer from [ollama.com/download/windows](https://ollama.com/download/windows).
- **macOS**: `brew install ollama` or download from [ollama.com/download/mac](https://ollama.com/download/mac).
- **Linux**: Run `curl -fsSL https://ollama.com/install.sh | sh`.

### Step 2: Download a Gemma Model
Open your terminal and pull a compatible Gemma model:

```bash
# Recommended for fast local CPU/GPU performance:
ollama pull gemma2:2b

# Or for higher reasoning capability (requires ~6GB VRAM/RAM):
ollama pull gemma2:9b
```

### Step 3: Verify Ollama is Running
Ensure the Ollama background daemon is active:
```bash
ollama list
```
You should see `gemma2:2b` listed. Ollama runs by default at `http://127.0.0.1:11434`.

---

## ⚙️ Environment Configuration

Check [`server/.env`](file:///c:/Users/The_Ram/OneDrive/Desktop/FreelancerMateAI/server/.env):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/freelancermate_ai
JWT_SECRET=freelancermate_secret_key_12345
NODE_ENV=development

# Ollama & Gemma Configuration
OLLAMA_BASE_URL=http://127.0.0.1:11434
GEMMA_MODEL_NAME=gemma2:2b
OLLAMA_TIMEOUT_MS=120000
```

---

## 🔌 API Endpoints

### Core Endpoints
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | API status |
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/users` | Register user (`name`, `email`, `age`, `password`) |
| `GET` | `/api/users` | List registered users |

### AI Bot Endpoints
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/ai/status` | Check if Ollama daemon is running and if Gemma model is installed |
| `POST` | `/api/ai/analyze` | Submit client requirements to Gemma for full project analysis |

---

## 📮 Postman Testing Guide

### 1. Check AI Engine Status (`GET /api/ai/status`)
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/ai/status`
- **Response**:
```json
{
  "success": true,
  "data": {
    "isOnline": true,
    "activeModel": "gemma2:2b",
    "hasActiveModel": true,
    "availableModels": ["gemma2:2b:latest"],
    "message": "Ollama is running and model \"gemma2:2b\" is available."
  }
}
```

### 2. Analyze Client Brief (`POST /api/ai/analyze`)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/ai/analyze`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body** (`raw` JSON):
```json
{
  "title": "E-Commerce Web App for Organic Skincare Brand",
  "clientRequest": "I need a modern online store to sell handmade skincare items. Must have a product catalog, filter by skin type, shopping cart, Razorpay payment gateway integration, user reviews with star ratings, and an admin dashboard to manage inventory and view orders.",
  "budget": 65000,
  "deadline": "2026-12-15",
  "preferredTechnologies": ["React", "Node.js", "MongoDB"],
  "additionalContext": "Brand prioritizes minimalistic, aesthetic design and fast mobile loading speed."
}
```

- **Expected Response (HTTP 200)**:
```json
{
  "success": true,
  "message": "Client project requirements successfully analyzed by Gemma",
  "data": {
    "title": "E-Commerce Web App for Organic Skincare Brand",
    "analysis": {
      "summary": "Full-featured e-commerce platform for an organic skincare brand featuring skin-type filters, Razorpay payments, product reviews, and admin inventory management.",
      "requirements": [
        "Functional: Product catalog with filtering by skin type",
        "Functional: Persistent shopping cart and Razorpay checkout",
        "Functional: Customer ratings and review submission system",
        "Functional: Protected Admin dashboard for stock and order tracking",
        "Non-Functional: Sub-2s page load speed and mobile-first responsive layout",
        "Non-Functional: Secure JWT authentication and encrypted transaction logs"
      ],
      "techStack": {
        "frontend": "React with Vite - Fast client bundle and dynamic product filtering",
        "backend": "Node.js with Express - Lightweight REST API for products and orders",
        "database": "MongoDB - Document store ideal for product variants and reviews",
        "deployment": "Vercel (Frontend) and Render/Railway (Backend)",
        "additionalTools": "Razorpay SDK, Cloudinary for image hosting, Tailwind CSS"
      },
      "architecture": "3-Tier MERN architecture with client-side state management, Express REST API, MongoDB database, and Razorpay webhook handlers.",
      "roadmap": [
        "Phase 1 - Planning & UI Design: Wireframes, database schemas, and project setup",
        "Phase 2 - Product Catalog & Auth: Filtering, cart state, and customer login",
        "Phase 3 - Checkout & Admin Dashboard: Razorpay payments, order processing, and admin controls",
        "Phase 4 - Testing & Handover: Payment sandbox tests, mobile QA, and production deployment"
      ],
      "missingQuestions": [
        "Do you already have a Razorpay merchant account and GST registration?",
        "Will you need automated shipping partner integration (e.g., Shiprocket) at launch?",
        "Approximately how many initial product SKUs will be uploaded?"
      ],
      "timeEstimate": "3 - 4 Weeks (approx. 70-85 hours)",
      "pricingEstimate": "₹55,000 - ₹75,000 INR",
      "proposal": "Dear Client,\n\nThank you for reaching out regarding your organic skincare store. I specialize in building high-converting, aesthetic e-commerce web applications using modern tech stacks...\n\nLooking forward to collaborating with you!"
    }
  }
}
```

---

## 🛠️ Error Handling & Troubleshooting

| Status Code | Reason | What to do |
|---|---|---|
| **400** | Missing `title` or `clientRequest` | Check that your request body contains both fields. |
| **503** | Ollama daemon not running | Run `ollama serve` or open the Ollama desktop app. |
| **404** | Gemma model not pulled | Run `ollama pull gemma2:2b` in your terminal. |
| **504** | Inference timeout | Local inference took too long. Try `gemma2:2b` or increase `OLLAMA_TIMEOUT_MS` in `.env`. |
| **502** | Invalid JSON from model | The server automatically attempts to extract and normalize the output. |
