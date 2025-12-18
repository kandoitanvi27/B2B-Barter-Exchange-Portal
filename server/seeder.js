const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Trade = require('./models/Trade');

dotenv.config();

const users = [
    {
        username: 'Alice',
        email: 'alice@test.com',
        password: 'password123',
        role: 'user'
    },
    {
        username: 'Bob',
        email: 'bob@test.com',
        password: 'password123',
        role: 'user'
    },
    {
        username: 'Charlie',
        email: 'charlie@test.com',
        password: 'password123',
        role: 'user'
    },
    {
        username: 'Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
    },
    {
        username: 'Demo User',
        email: 'demo@test.com',
        password: 'password123',
        role: 'user'
    }
];

const listings = [
    {
        title: 'MacBook Pro 2020',
        description: '13-inch, Space Gray, 16GB RAM, 512GB SSD. In excellent condition.',
        category: 'Electronics',
        estimatedValue: 900,
        condition: 'Like New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Herman Miller Aeron Chair',
        description: 'Ergonomic office chair, size B. Fully loaded with posture fit.',
        category: 'Furniture',
        estimatedValue: 600,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Sony A7III Camera',
        description: 'Body only. Low shutter count. Perfect for video and photography.',
        category: 'Electronics',
        estimatedValue: 1400,
        condition: 'Like New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Vintage Denim Jacket',
        description: 'Levis original denim jacket from the 90s. Size Medium.',
        category: 'Clothing',
        estimatedValue: 80,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Mountain Bike',
        description: 'Trek Marlin 5. Great for trails and city riding. Recently serviced.',
        category: 'Vehicles',
        estimatedValue: 450,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Web Development Services',
        description: 'I will build a responsive website for your business using React.',
        category: 'Services',
        estimatedValue: 1000,
        condition: 'New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'iPhone 13 Pro',
        description: 'Sierra Blue, 128GB. Battery health 90%. Includes original box.',
        category: 'Electronics',
        estimatedValue: 700,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Leather Sofa',
        description: '3-seater brown leather sofa. Very comfortable. Minor scratches.',
        category: 'Furniture',
        estimatedValue: 300,
        condition: 'Fair',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Nintendo Switch OLED',
        description: 'White Joycons. Comes with Mario Kart 8 and screen protector.',
        category: 'Electronics',
        estimatedValue: 300,
        condition: 'Like New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Graphic Design Bundle',
        description: 'Logo design + Brand Identity package. 3 revisions included.',
        category: 'Services',
        estimatedValue: 500,
        condition: 'New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1626785774573-4b7993125651?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Espresso Machine',
        description: 'Breville Barista Express. Stainless steel. Works perfectly.',
        category: 'Electronics',
        estimatedValue: 400,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1520970014086-2208d157c9e2?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Gaming PC',
        description: 'RTX 3060, Ryzen 5 5600X, 16GB RAM. Runs most games on High.',
        category: 'Electronics',
        estimatedValue: 950,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Electric Guitar',
        description: 'Fender Stratocaster Player Series. Sunburst finish.',
        category: 'Other',
        estimatedValue: 650,
        condition: 'Like New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Accounting Consultation',
        description: '5 hours of tax consultation and bookkeeping setup.',
        category: 'Services',
        estimatedValue: 400,
        condition: 'New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Honda Civic 2015',
        description: 'Silver, 80k miles. Reliable daily driver. Clean title.',
        category: 'Vehicles',
        estimatedValue: 8000,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Dining Table Set',
        description: 'Oak wood table with 4 chairs. Minimalist design.',
        category: 'Furniture',
        estimatedValue: 350,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Winter Parka',
        description: 'The North Face McMurdo Parka. Size Large. Very warm.',
        category: 'Clothing',
        estimatedValue: 150,
        condition: 'Like New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1539533018447-63fcce667c1f?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Yoga Classes',
        description: '10-class pass for Vinyasa Yoga at downtown studio.',
        category: 'Services',
        estimatedValue: 120,
        condition: 'New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Drone',
        description: 'DJI Mini 2 Fly More Combo. Under 250g. 4K video.',
        category: 'Electronics',
        estimatedValue: 350,
        condition: 'Good',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1000']
    },
    {
        title: 'Bookshelf Speakers',
        description: 'Edifier R1280T. Great entry-level audiophile speakers.',
        category: 'Electronics',
        estimatedValue: 80,
        condition: 'Like New',
        status: 'available',
        images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=1000']
    }
];

const seedDB = async () => {
    try {
        // Connect to DB
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/barter-app');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Clear existing data
        await User.deleteMany();
        await Listing.deleteMany();
        console.log('Data Destroyed...');

        // Create Users
        const createdUsers = await User.create(users);
        console.log(`Created ${createdUsers.length} users`);

        // Assign listings randomly to users
        // Assign listings to Demo User and others
        const demoUser = createdUsers.find(u => u.email === 'demo@test.com');
        const otherUsers = createdUsers.filter(u => u.email !== 'demo@test.com');

        const sampleListings = listings.map((listing, index) => {
            // Give 50% of listings to Demo User for testing
            if (index % 2 === 0 && demoUser) {
                return { ...listing, owner: demoUser._id };
            }
            const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
            return {
                ...listing,
                owner: randomUser._id
            };
        });

        const createdListings = await Listing.create(sampleListings);
        console.log(`Created ${sampleListings.length} listings`);

        // Create Trades
        await Trade.deleteMany();

        // 1. Incoming Trade: Someone wants Demo User's item
        const demoUserItems = createdListings.filter(l => l.owner.toString() === demoUser._id.toString());
        const otherUserItems = createdListings.filter(l => l.owner.toString() !== demoUser._id.toString());

        if (demoUserItems.length > 0 && otherUserItems.length > 0) {
            const incomingTrade = {
                initiator: otherUserItems[0].owner,
                receiver: demoUser._id,
                listingInitiator: otherUserItems[0]._id, // They offer this
                listingReceiver: demoUserItems[0]._id,   // They want this
                status: 'pending',
                message: 'I would like to trade my item for yours!'
            };

            const acceptedTrade = {
                initiator: otherUserItems[1].owner,
                receiver: demoUser._id,
                listingInitiator: otherUserItems[1]._id,
                listingReceiver: demoUserItems[1]._id,
                status: 'accepted',
                message: 'Let\'s do this deal.'
            };

            await Trade.create([incomingTrade, acceptedTrade]);
        }

        // 2. Outgoing Trade: Demo User wants someone else's item
        if (demoUserItems.length > 2 && otherUserItems.length > 2) {
            const outgoingTrade = {
                initiator: demoUser._id,
                receiver: otherUserItems[2].owner,
                listingInitiator: demoUserItems[2]._id, // Demo offers this
                listingReceiver: otherUserItems[2]._id,  // Demo wants this
                status: 'pending',
                message: 'Are you interested in trading?'
            };

            const rejectedTrade = {
                initiator: demoUser._id,
                receiver: otherUserItems[3].owner,
                listingInitiator: demoUserItems[3]._id,
                listingReceiver: otherUserItems[3]._id,
                status: 'rejected',
                message: 'Sorry, not interested.'
            };

            await Trade.create([outgoingTrade, rejectedTrade]);
        }

        console.log('Created sample trades...');

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
