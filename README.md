# Lake House Booking Platform

A simple, elegant booking platform for a private lake house that allows friends and family to reserve dates.

## Features

- **Google Authentication**: Secure login with Google accounts
- **Interactive Calendar**: Visual booking calendar showing available and reserved dates
- **Booking Management**: Create, view, and cancel bookings
- **Admin Override**: House owner can view and cancel any booking
- **Real-time Updates**: Instant updates when bookings are made or cancelled
- **Responsive Design**: Works beautifully on desktop and mobile devices

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Firebase (Authentication & Firestore)
- Tailwind CSS
- React Calendar
- React Toastify

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repo-url>
cd booking-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Google Authentication
   - Create a Firestore database
   - Get your configuration values

4. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration
   - Set your admin email address

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Firebase Setup

### Authentication
1. Go to Firebase Console > Authentication
2. Enable Google as a sign-in provider
3. Add your domain to authorized domains

### Firestore Database
The app will automatically create a `bookings` collection with the following structure:
```javascript
{
  userId: string,
  userEmail: string,
  userName: string,
  startDate: Timestamp,
  endDate: Timestamp,
  notes: string (optional),
  createdAt: Timestamp
}
```

### Security Rules
Set up the following Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      // Allow read access to all authenticated users
      allow read: if request.auth != null;
      
      // Allow users to create bookings
      allow create: if request.auth != null;
      
      // Allow users to delete their own bookings or admin to delete any
      allow delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.email == 'your-admin-email@gmail.com');
    }
  }
}
```

## Deployment

Deploy to Vercel (recommended):
1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables
4. Deploy!

## Contributing

Feel free to submit issues and pull requests!

## License

MIT