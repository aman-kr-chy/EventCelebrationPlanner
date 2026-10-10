import Venue from '../models/Venue.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import SiteStats from '../models/SiteStats.js';

export const autoSeed = async () => {
  try {
    const venueCount = await Venue.countDocuments();
    if (venueCount === 0) {
      console.log('Database empty: Seeding default venues and vendors...');
      
      let vendorUser = await User.findOne({ email: 'vendor@example.com' });
      if (!vendorUser) {
        vendorUser = await User.create({
          name: 'Sample Vendor',
          email: 'vendor@example.com',
          password: 'password123',
          role: 'vendor',
          phone: '9876543210'
        });
      }

      const sampleVenues = [
        {
          name: 'Grand Royal Banquet',
          description: 'A luxurious banquet hall for premium weddings and corporate events.',
          location: { city: 'Mumbai', address: '123 Royal Avenue, Andheri West' },
          capacity: 500, pricePerDay: 50000, venueType: 'Banquet Hall',
          facilities: ['AC', 'Catering', 'Parking', 'DJ'],
          images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          owner: vendorUser._id
        },
        {
          name: 'Green View Farmhouse',
          description: 'Spacious farmhouse with lush green lawns perfect for outdoor celebrations.',
          location: { city: 'Delhi', address: '45 Green Lane, Chhatarpur' },
          capacity: 1000, pricePerDay: 75000, venueType: 'Farmhouse',
          facilities: ['Lawn', 'Pool', 'Rooms', 'Catering'],
          images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          owner: vendorUser._id
        },
        {
          name: 'Silicon Valley Retreat',
          description: 'Modern resort style venue ideal for tech meetups and parties.',
          location: { city: 'Bangalore', address: '88 Tech Park Road, Whitefield' },
          capacity: 800, pricePerDay: 60000, venueType: 'Resort',
          facilities: ['AC', 'Pool', 'Parking', 'Projectors'],
          images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          owner: vendorUser._id
        },
        {
          name: 'Nizam Palace Hotel',
          description: 'Heritage hotel with royal ambiance and top-tier services.',
          location: { city: 'Hyderabad', address: '12 Heritage Way, Banjara Hills' },
          capacity: 1200, pricePerDay: 100000, venueType: 'Hotel',
          facilities: ['Rooms', 'AC', 'Catering', 'Valet Parking'],
          images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          owner: vendorUser._id
        },
        {
          name: 'Marina Beach Pavilion',
          description: 'Beautiful beach-facing venue perfect for evening gatherings.',
          location: { city: 'Chennai', address: '50 Marina Drive, Besant Nagar' },
          capacity: 400, pricePerDay: 45000, venueType: 'Outdoor',
          facilities: ['Beach Access', 'Catering', 'DJ', 'Parking'],
          images: ['https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          owner: vendorUser._id
        },
        {
          name: 'Victoria Grand Banquet',
          description: 'Classic colonial style banquet hall with exquisite decor.',
          location: { city: 'Kolkata', address: '10 Park Street Area' },
          capacity: 600, pricePerDay: 55000, venueType: 'Banquet Hall',
          facilities: ['AC', 'Catering', 'Decor', 'Parking'],
          images: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          owner: vendorUser._id
        }
      ];

      await Venue.insertMany(sampleVenues);
      console.log('Default venues seeded successfully!');

      const sampleVendors = [
        {
          user: vendorUser._id,
          businessName: 'Delight Catering',
          category: 'Catering',
          description: 'Premium catering services for all types of events.',
          location: { city: 'Mumbai', address: '45 Food Street, Bandra' },
          startingPrice: 500,
          rating: 4.8,
          numReviews: 24,
          services: [{ name: 'Buffet', price: 500, description: 'Standard buffet per plate' }],
          portfolio: ['https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
        },
        {
          user: vendorUser._id,
          businessName: 'Capture Moments',
          category: 'Photography',
          description: 'Professional wedding and event photography.',
          location: { city: 'Delhi', address: '12 Camera Lane, CP' },
          startingPrice: 15000,
          rating: 4.9,
          numReviews: 45,
          services: [{ name: 'Pre-wedding shoot', price: 15000, description: 'One day outdoor shoot' }],
          portfolio: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
        },
        {
          user: vendorUser._id,
          businessName: 'Magic Decorators',
          category: 'Decoration',
          description: 'Transforming venues into magical spaces.',
          location: { city: 'Bangalore', address: '78 Flower Road, Indiranagar' },
          startingPrice: 20000,
          rating: 4.7,
          numReviews: 32,
          services: [{ name: 'Stage Decoration', price: 20000, description: 'Basic floral stage decor' }],
          portfolio: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
        },
        {
          user: vendorUser._id,
          businessName: 'DJ RockStars',
          category: 'DJ/Music',
          description: 'Get the party started with the best music.',
          location: { city: 'Mumbai', address: '99 Sound Avenue, Juhu' },
          startingPrice: 10000,
          rating: 4.6,
          numReviews: 18,
          services: [{ name: 'DJ Setup', price: 10000, description: 'Standard DJ setup for 4 hours' }],
          portfolio: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
        }
      ];

      await Vendor.insertMany(sampleVendors);
      console.log('Default vendors seeded successfully!');
    }

    await SiteStats.findOneAndUpdate(
      { key: 'main' },
      { $setOnInsert: { key: 'main', totalVisits: 1 } },
      { upsert: true }
    );
  } catch (error) {
    console.error('AutoSeed error:', error.message);
  }
};
