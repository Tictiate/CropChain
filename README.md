# 🌱 CropChain

**CropChain** is a modern, full-stack web application designed to bring transparency, efficiency, and traceability to the agricultural supply chain. Built with a premium, glassmorphism-inspired UI, it connects farmers, distributors, retailers, and consumers on a unified platform.

![CropChain Banner](https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1000)

🌐 **Live Demo:** [https://crop-chain-two.vercel.app/](https://crop-chain-two.vercel.app/)

---

## 🚀 Features

- **Role-Based Dashboards**: Tailored experiences for Farmers, Distributors, Retailers, and Consumers.
- **Supply Chain Traceability**: Real-time tracking of crops from farm to table.
- **Dynamic QR Code Scanning**: Integrated `html5-qrcode` scanner for distributors to quickly scan, verify, and update the status of crop shipments.
- **Open Marketplace**: A direct-to-consumer marketplace where farmers can list their produce.
- **Geolocation Integration**: One-click geolocation tagging for crop origins.
- **Modern Authentication**: Secure credentials-based authentication powered by Auth.js and bcryptjs.
- **Premium Design**: A highly responsive, glassmorphism-based UI featuring fluid typography and micro-animations.

## 🛠️ Tech Stack

This project was recently migrated from legacy PHP/SQLite to a modern React ecosystem:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database Engine**: PostgreSQL (Vercel Postgres)
- **Authentication**: [Auth.js](https://authjs.dev/) (NextAuth v5)
- **Styling**: Vanilla CSS (Global variables, Glassmorphism, CSS Modules)

## 💻 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tictiate/CropChain.git
   cd CropChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your variables:
   ```env
   # Generate a secret using: npx auth secret
   AUTH_SECRET="your_secret_here"
   
   # Connection string to your Postgres/SQLite database
   DATABASE_URL="postgres://user:password@host/database"
   ```

4. **Initialize Database**
   Push the Prisma schema to your database and run the seed script to populate test data:
   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to view the application!

## 🧪 Test Credentials

If you've run the seed script or are viewing the live demo, you can log in with the following test accounts (Password for all is `password123`):

- **Farmer**: `farmer_test`
- **Distributor**: `dist_test`
- **Retailer**: `retail_test`
- **Consumer**: `consumer_test`

## 📁 Legacy Code
The original PHP/SQLite implementation of this project has been archived in the `/legacy` folder for reference and educational purposes.

---
*Built with ❤️ for a more transparent agricultural future.*
