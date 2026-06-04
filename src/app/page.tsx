import Link from "next/link";
import { auth } from "@/lib/auth";
import { Dumbbell, Activity, ArrowRight, Zap, Shield, Brain, LayoutDashboard, Trophy, Cpu, MessageSquare } from "lucide-react";

export default async function RootHomePage() {
  //  Check if the user is logged in
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 font-sans overflow-hidden">
      
      {/* Top Navigation Bar */}
      <nav className="w-full flex items-center justify-between px-6 py-6 max-w-7xl mx-auto relative z-20">
        <Link href="/">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Dumbbell className="w-6 h-6 text-zinc-950" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-wide">
            AI<span className="text-emerald-500">thlete</span>
          </span>
        </div>
        </Link>


        {/*  Dynamic Navigation Button */}
        <div>
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-sm font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-xl transition-all border border-emerald-500/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center z-10">
        
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-md">
          <Zap className="w-4 h-4" />
          <span>Next-Generation Fitness Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Your Personal AI  Fitness Trainer. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            Available 24/7.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Stop guessing. AIthlete uses advanced AI to build dynamic workout plans, analyze your nutrition, and break through your plateaus based on your unique biometrics.
        </p>

        {/*  Dynamic Call to Action Button */}
        <Link 
          href={isLoggedIn ? "/ai-coach" : "/login"} 
          className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)]"
        >
          {isLoggedIn ? "Continue Training" : "Start Your Journey"}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

      </main>

      {/* Feature Highlights Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <Brain className="w-10 h-10 text-emerald-400 mb-5" />
          <h3 className="text-xl font-bold mb-3">Context-Aware AI</h3>
          <p className="text-zinc-400 leading-relaxed">
            AIthlete remembers your injuries, equipment, and goals, tailoring every single workout exactly to your lifestyle.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <Activity className="w-10 h-10 text-emerald-400 mb-5" />
          <h3 className="text-xl font-bold mb-3">Dynamic Progression</h3>
          <p className="text-zinc-400 leading-relaxed">
            Hit a plateau? The AI automatically adjusts your volume, intensity, and exercises to force new muscle adaptation.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <Shield className="w-10 h-10 text-emerald-400 mb-5" />
          <h3 className="text-xl font-bold mb-3">Private & Secure</h3>
          <p className="text-zinc-400 leading-relaxed">
            Your biometrics and chat history are locked behind secure authentication and encrypted databases.
          </p>
        </div>

      </section>


{/*  The App Interface Reveal */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Chat your way to a better physique.</h2>
          <p className="text-zinc-400 text-lg">A truly conversational interface that feels like texting a world-class coach.</p>
        </div>

        <div className="relative rounded-2xl md:rounded-[2rem] border border-white/10 bg-zinc-900/50 p-2 shadow-2xl backdrop-blur-xl overflow-hidden group">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-950/50">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <div className="mx-auto text-xs font-medium text-zinc-500 flex items-center gap-2">
              <Shield className="w-3 h-3" /> Secure AI Connection
            </div>
          </div>
          
          <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-zinc-950 relative overflow-hidden flex">
            <div className="hidden sm:block w-48 border-r border-white/5 p-4 space-y-4 bg-white/[0.02]">
              <div className="h-4 w-24 bg-white/10 rounded-full mb-8"></div>
              <div className="h-8 w-full bg-emerald-500/10 rounded-lg border border-emerald-500/20"></div>
              <div className="h-8 w-full bg-white/5 rounded-lg"></div>
              <div className="h-8 w-full bg-white/5 rounded-lg"></div>
            </div>
            
            <div className="flex-1 p-4 sm:p-10 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-zinc-950 to-transparent z-10 pointer-events-none"></div>

              <div className="space-y-5 w-full max-w-2xl mx-auto relative z-20">
                <div className="flex gap-3 sm:gap-4 items-start w-full opacity-60">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Brain className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 sm:p-4 text-sm text-zinc-300 border border-white/5">
                    I noticed your bench press plateaued at 185 lbs. I've adjusted today's routine to focus on tricep lockout strength. Ready to begin?
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 items-start flex-row-reverse w-full opacity-80">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-xs">You</span>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none p-3 sm:p-4 text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    Yes, let's do it. I only have dumbbells and a flat bench today.
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 items-start w-full">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Brain className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 sm:p-4 text-sm text-zinc-300 border border-white/5">
                    Perfect. We'll swap the barbell for heavy Dumbbell Floor Presses to isolate the triceps. Aim for 4 sets of 8 reps. Target RPE is 8. I've synced this to your database.
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 items-start flex-row-reverse w-full">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-xs">You</span>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none p-3 sm:p-4 text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    Got it. What about rest times?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      




 {/*  How It Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How AIthlete Works</h2>
          <p className="text-zinc-400 text-lg">Three simple steps to optimize your physical potential.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-xl">
              <MessageSquare className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">1. Tell the AI your goals</h3>
            <p className="text-zinc-400 leading-relaxed">
              Just chat normally. Mention your equipment, time limits, injuries, or what muscle group you want to destroy today.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Cpu className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">2. Instant Generation</h3>
            <p className="text-zinc-400 leading-relaxed">
              Our Google Gemini integration instantly processes your request and builds a mathematically optimal routine just for you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-xl">
              <Trophy className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">3. Lift & Track</h3>
            <p className="text-zinc-400 leading-relaxed">
              Check off your sets as you go. AIthlete automatically logs your progress to the database to ensure progressive overload next time.
            </p>
          </div>
        </div>
      </section>



{/* CTA  */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="relative rounded-[2rem] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 relative z-10">
            Stop guessing.<br />Start growing.
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 relative z-10">
            Join the next generation of athletes using artificial intelligence to optimize their training, recovery, and results.
          </p>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={isLoggedIn ? "/dashboard" : "/login"} 
              className="w-full group sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>





{/* Footer */}
      <section className="max-w-7xl mx-auto" >
      <footer className="relative z-10 border-t border-white/5 bg-zinc-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4">
          
          <Link href="/" >
          <div className="flex items-center gap-2  transition-all duration-300 ">
            <Dumbbell className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-xl tracking-tight text-zinc-100">
              AI<span className="text-emerald-500">thlete</span>
            </span>
          </div>
          </Link>

          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} AIthlete. All rights reserved.
          </p>
          
        </div>
      </footer>
      </section>

    </div>
  );
}



