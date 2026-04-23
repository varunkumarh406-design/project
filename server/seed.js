require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Trade = require('./models/Trade');
const Watchlist = require('./models/Watchlist');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Trade.deleteMany();
    await Watchlist.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Specific Dummy Users
    const usersData = [
      { name: 'TraderX', email: 'traderx@stocksocial.com', bio: 'Day trader. High risk, high reward.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TraderX' },
      { name: 'BullKing', email: 'bull@stocksocial.com', bio: 'Long only. Always bullish on tech.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BullKing' },
      { name: 'MarketGuru', email: 'guru@stocksocial.com', bio: 'Macro trends and value investing.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarketGuru' },
      { name: 'AlphaHunter', email: 'alpha@stocksocial.com', bio: 'Finding alpha in small caps.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlphaHunter' },
      { name: 'SwingPro', email: 'swing@stocksocial.com', bio: 'Swing trading specialist.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SwingPro' }
    ];

    const users = await User.insertMany(usersData.map(u => ({ ...u, password: hashedPassword })));

    // Create Watchlists
    for (const user of users) {
        await Watchlist.create({ user: user._id, tickers: ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS'] });
    }

    // Follow relationships
    // TraderX follows everyone
    users[0].following.push(users[1]._id, users[2]._id, users[3]._id, users[4]._id);
    users[1].followers.push(users[0]._id);
    users[2].followers.push(users[0]._id);
    users[3].followers.push(users[0]._id);
    users[4].followers.push(users[0]._id);
    
    // AlphaHunter follows SwingPro
    users[3].following.push(users[4]._id);
    users[4].followers.push(users[3]._id);

    await Promise.all(users.map(u => u.save()));

    // Create Initial Trades/Posts
    const trades = [
        { user: users[0]._id, ticker: 'NVDA', action: 'buy', quantity: 10, priceAtTrade: 880.50 },
        { user: users[1]._id, ticker: 'TSLA', action: 'buy', quantity: 50, priceAtTrade: 175.20 },
        { user: users[2]._id, ticker: 'AAPL', action: 'buy', quantity: 100, priceAtTrade: 172.10 }
    ];
    await Trade.insertMany(trades);

    const posts = [
        { author: users[0]._id, body: 'Just went long on $NVDA. AI tailwinds are too strong to ignore.', ticker: 'NVDA' },
        { author: users[1]._id, body: 'Added more $TSLA to my position. Buying the dip!', ticker: 'TSLA' },
        { author: users[4]._id, body: 'Swing setup forming on $AAPL. Watching key levels.', ticker: 'AAPL' }
    ];
    await Post.insertMany(posts);

    console.log('StockSocial Seed Data Created Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
