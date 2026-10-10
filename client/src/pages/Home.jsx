import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, CalendarHeart, Camera, ChevronRight, MapPin, Sparkles, Users, Wallet } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import InteractiveHeroBackground from '../components/InteractiveHeroBackground';

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth) || {};
  const [tipIndex, setTipIndex] = useState(0);
  const [visitCount, setVisitCount] = useState(null);
  const visitRecordedRef = useRef(false);
  const [selectedCelebration, setSelectedCelebration] = useState('Birthday');
  const celebrationIdeas = {
    Birthday: {
      eyebrow: 'Make their day unforgettable',
      title: 'A birthday that feels like them.',
      description: 'Start with a venue that fits your guest list, then bring the food, decor, and little surprises together.',
      icon: Sparkles,
      link: '/venues',
      action: 'Find a birthday venue',
      color: 'from-fuchsia-600 to-rose-500'
    },
    Wedding: {
      eyebrow: 'Celebrate your next chapter',
      title: 'Make space for your kind of wedding.',
      description: 'Explore event spaces and discover the vendors who can help bring your celebration to life.',
      icon: CalendarHeart,
      link: '/vendors',
      action: 'Explore wedding vendors',
      color: 'from-violet-700 to-indigo-500'
    },
    Corporate: {
      eyebrow: 'Bring people together',
      title: 'Plan a polished team gathering.',
      description: 'Find a venue for your group and keep event details, guest information, and budget in one plan.',
      icon: Users,
      link: '/venues',
      action: 'Browse event venues',
      color: 'from-sky-600 to-cyan-500'
    }
  };
  const planningTips = [
    'Set your guest count first. It helps you choose the right venue and budget.',
    'Book popular venues early, especially for weekends and holiday dates.',
    'Keep a small part of your budget aside for last-minute details.'
  ];

  useEffect(() => {
    if (visitRecordedRef.current) return undefined;
    visitRecordedRef.current = true;
    api.post('/stats/visits')
      .then(({ data }) => {
        setVisitCount(data.totalVisits);
      })
      .catch((error) => console.error('Unable to load site visit count:', error));
  }, []);

  const getPlanningLink = () => {
    if (!userInfo) return "/register";
    if (userInfo.role === 'vendor') return "/vendor/dashboard";
    if (userInfo.role === 'admin') return "/admin/dashboard";
    return "/customer/dashboard";
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <InteractiveHeroBackground />
        
        {/* Subtle overlay to ensure text is always readable over the 3D canvas */}
        <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Plan Your Perfect <span className="text-pink-500">Celebration</span> 🎉
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-200 mb-10"
          >
            Everything you need to plan, organize, and celebrate your special event, all in one place.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={getPlanningLink()} className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg">
              Start Planning
            </Link>
            <Link to="/venues" className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Explore Venues
            </Link>
            <Link to="/vendors" className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Explore Vendors
            </Link>
          </motion.div>
          <p className="mt-6 text-xs md:text-sm text-gray-300/80 pointer-events-none">
            Click the background to launch a firework · Move your cursor to stir the confetti
          </p>
        </div>
      </section>

      {/* About section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Who we are</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Every great celebration starts with a thoughtful plan.</h2>
            <p className="mt-5 text-gray-600 leading-7">EventPlanner brings the key pieces of your event together. Find a place to celebrate, discover service professionals, and keep the details of your event organized.</p>
            <Link to={getPlanningLink()} className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary-dark transition-colors">
              Start planning <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900 p-8 flex items-end">
            <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border-[36px] border-white/10" />
            <div className="absolute right-20 top-12 h-28 w-28 rounded-full bg-pink-400/30 blur-2xl" />
            <div className="relative max-w-sm text-white">
              <CalendarHeart className="h-10 w-10 text-purple-200 mb-5" />
              <p className="text-2xl font-bold">From the first idea to the final detail</p>
              <p className="mt-3 text-sm leading-6 text-purple-100">Keep your venue, services, guests, and budget connected to your event plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Explore our services</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">Everything your event needs</h2>
            </div>
            <Link to="/vendors" className="inline-flex items-center gap-1 text-primary font-semibold hover:text-primary-dark transition-colors">
              Explore vendors <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Find your venue', description: 'Browse event spaces by location, capacity, and venue type.', icon: MapPin, link: '/venues', action: 'Explore venues', tone: 'from-rose-500 to-orange-400', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop' },
              { title: 'Book event services', description: 'Discover caterers, decorators, photographers, and more.', icon: Camera, link: '/vendors', action: 'Browse vendors', tone: 'from-violet-600 to-fuchsia-500', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop' },
              { title: 'Keep plans on track', description: 'Bring your event details, guest list, and budget together.', icon: Wallet, link: getPlanningLink(), action: 'Create an event', tone: 'from-blue-600 to-cyan-400', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop' }
            ].map(({ title, description, icon: Icon, link, action, tone, image }) => (
              <article key={title} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className={`relative h-48 bg-gradient-to-br ${tone} p-6 flex items-end overflow-hidden`}>
                  <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                  <div className="relative z-10 rounded-2xl bg-white/20 p-3 text-white backdrop-blur-md border border-white/20 shadow-lg group-hover:bg-white/30 transition-colors"><Icon className="h-7 w-7" /></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">{description}</p>
                  <Link to={link} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    {action} <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive celebration picker */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">A little inspiration</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">What are you celebrating?</h2>
            <p className="mt-4 text-gray-400 leading-7">Choose an event to see a few ideas to get your plans moving.</p>
            <div className="mt-7 flex flex-wrap gap-3" role="tablist" aria-label="Choose an event type">
              {Object.keys(celebrationIdeas).map((occasion) => (
                <button
                  key={occasion}
                  id={`occasion-${occasion.toLowerCase()}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedCelebration === occasion}
                  aria-controls="celebration-idea"
                  onClick={() => setSelectedCelebration(occasion)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${selectedCelebration === occasion ? 'bg-white text-gray-900 shadow-lg' : 'border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'}`}
                >
                  {occasion}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[270px]">
            <AnimatePresence mode="wait">
              {(() => {
                const idea = celebrationIdeas[selectedCelebration];
                const IdeaIcon = idea.icon;
                return (
                  <motion.div
                    key={selectedCelebration}
                    id="celebration-idea"
                    role="tabpanel"
                    aria-labelledby={`occasion-${selectedCelebration.toLowerCase()}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className={`h-full min-h-[270px] rounded-3xl bg-gradient-to-br ${idea.color} p-8 md:p-10 flex flex-col justify-between shadow-2xl`}
                  >
                    <div>
                      <IdeaIcon className="h-9 w-9 text-white/80" />
                      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/75">{idea.eyebrow}</p>
                      <h3 className="mt-2 text-2xl md:text-3xl font-bold">{idea.title}</h3>
                      <p className="mt-3 max-w-xl leading-7 text-white/85">{idea.description}</p>
                    </div>
                    <Link to={idea.link} className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-gray-900 hover:gap-3 transition-all">
                      {idea.action} <ChevronRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 rounded-2xl bg-gray-50 hover:shadow-xl transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Top Venues</h3>
              <p className="text-gray-600">Discover and book the most beautiful venues for your events with ease.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 hover:shadow-xl transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Vendors</h3>
              <p className="text-gray-600">Connect with rated professionals including photographers, caterers, and decorators.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 hover:shadow-xl transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarHeart size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Planning</h3>
              <p className="text-gray-600">Manage guests, track budgets, and organize your event timeline perfectly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-violet-700 to-purple-600 px-6 py-12 md:px-12 text-center text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-200">Make it memorable</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Ready to bring your celebration to life?</h2>
          <p className="mt-4 mx-auto max-w-2xl text-purple-100">Start with an event plan, then find the venue and people to make it yours.</p>
          <Link to={getPlanningLink()} className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-purple-700 hover:bg-purple-50 transition-colors">
            Get started <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-12" aria-label="Website visits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Visitors welcomed</p>
          <p className="mt-2 text-4xl font-bold text-primary" aria-live="polite">
            {visitCount === null ? '—' : visitCount.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-gray-500">visits to EventPlanner</p>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-xl">
                <CalendarHeart className="h-7 w-7 text-purple-400" /> EventPlanner
              </Link>
              <p className="mt-4 text-sm leading-6 text-gray-400 max-w-xs">
                Make room for the moments that matter. Plan your next celebration in one place.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h2>
              <div className="mt-4 flex flex-col items-start gap-3 text-sm">
                <Link className="hover:text-white transition-colors" to="/venues">Browse venues</Link>
                <Link className="hover:text-white transition-colors" to="/vendors">Find vendors</Link>
                <Link className="hover:text-white transition-colors" to={getPlanningLink()}>Plan an event</Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sparkles className="h-4 w-4 text-purple-300" /> A little planning tip
              </div>
              <p aria-live="polite" className="mt-3 min-h-[3rem] text-sm leading-6 text-gray-400">
                {planningTips[tipIndex]}
              </p>
              <button
                type="button"
                onClick={() => setTipIndex((tipIndex + 1) % planningTips.length)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-purple-300 hover:text-white transition-colors"
              >
                Another tip <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col items-start lg:items-end justify-between gap-5">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              >
                Back to top <ArrowUp className="h-4 w-4" />
              </button>
              <p className="text-xs text-gray-500">© {new Date().getFullYear()} EventPlanner</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
