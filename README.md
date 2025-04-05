# Farmer's Market & Community App

A web application for connecting local farmers with their community. This platform allows farmers to sell their products online and share updates with customers through a social media-like interface.

## Features

- **Marketplace**: Browse and purchase products from local farmers
- **Community Feed**: Follow farmers and see their latest updates
- **User Profiles**: Separate interfaces for farmers and consumers
- **Product Management**: Farmers can easily add and manage their products

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Supabase for authentication, database, and storage
- **Styling**: Custom CSS

## Database Structure

The application uses two main Supabase tables:

1. **users**:
   - username
   - first_name
   - last_name
   - is_farmer (boolean)
   - email
   - phone_number
   - created_at
   - profile_photo (URL string)

2. **items**:
   - name
   - description
   - price
   - quantity
   - farmer_id (references users)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/farmers-market.git
   cd farmers-market
   ```

2. Install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Create a Supabase project and set up the database tables:
   - Create a new Supabase project
   - Run the SQL scripts provided in `database/schema.sql`
   - Enable email authentication in Supabase Auth settings

4. Set up environment variables:
   - Create a `.env.local` file in the frontend directory
   - Add your Supabase URL and anon key:
     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

5. Start the development server:
   ```
   npm run dev
   ```

## Future Enhancements

- Google Auth integration
- Order management system
- Payment processing
- Real-time chat between farmers and customers
- Location-based search for nearby farmers
- Review and rating system

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.