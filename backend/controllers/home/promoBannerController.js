const PromoBanner = require('../../models/PromoBannerModel');

// Get Promo Banner (create default if not exists)
exports.getPromoBanner = async (req, res) => {
  try {
    let banner = await PromoBanner.findOne();
    if (!banner) {
      banner = await PromoBanner.create({
        title: 'Up to 35% OFF',
        subtitle: 'on first order',
        highlightText: '*Only on App',
        buttonText: 'Download Now',
        buttonLink: '/',
        cards: [
          { image: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Trending', label: 'Trending Now', link: '/shop' },
          { image: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Budget', label: 'Budget Buys', link: '/shop' },
          { image: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Top+Rated', label: 'Top Rated Picks', link: '/shop' },
          { image: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Essentials', label: 'Daily Essentials', link: '/shop' }
        ]
      });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Promo Banner
exports.updatePromoBanner = async (req, res) => {
  try {
    const { title, subtitle, highlightText, buttonText, buttonLink, cards } = req.body;
    
    // Validate cards length if needed, but schema handles structure
    
    let banner = await PromoBanner.findOne();
    if (!banner) {
      banner = new PromoBanner(req.body);
    } else {
      banner.title = title || banner.title;
      banner.subtitle = subtitle || banner.subtitle;
      banner.highlightText = highlightText || banner.highlightText;
      banner.buttonText = buttonText || banner.buttonText;
      banner.buttonLink = buttonLink || banner.buttonLink;
      banner.cards = cards || banner.cards;
    }
    
    await banner.save();
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
