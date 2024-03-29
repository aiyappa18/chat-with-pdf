# Chat with PDF

Chat with PDF is a full-stack web application that allows users to upload PDF files and engage in interactive chat conversations with the PDF content. Users can ask questions about the PDF and receive responses in real-time.

## Technologies Used

- **Frontend**:
  - Next.js

- **Backend**:
  - ShadCn
  - ClerkAuth
  - DrizzleORM
  - PineCone DB

- **API**:
  - OpenAI API

- **Storage**:
  - AWS S3

## Features

- **PDF Upload**: Users can upload PDF files to the application.
- **Interactive Chat**: Users can engage in interactive chat conversations with the PDF content.
- **Question and Answer**: Users can ask questions about the PDF and receive responses generated by OpenAI API.
- **Authentication**: User authentication is handled using ClerkAuth to ensure secure access to the application.
- **File Storage**: PDF files are stored securely on AWS S3.

## Installation

1. Clone the repository:
git clone <repository-url>


2. Set up environment variables:
- Create a `.env` file in the root directory of the project.
- Define environment variables such as API keys, database credentials, AWS S3 credentials, etc.

3. Install dependencies:
npm install


4. Run the development server:
npm run dev
