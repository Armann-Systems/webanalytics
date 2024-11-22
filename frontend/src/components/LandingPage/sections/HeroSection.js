import React from 'react';
import { ArrowRight, Globe, Shield, Activity } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-black/5 rounded-full transform rotate-45"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 border border-black/5 rounded-full"></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-black/[0.02] rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Main content */}
          <div className="space-y-8">
            <h1 className="text-[3.5rem] leading-none font-bold text-black">
              <span className="block transform hover:translate-x-2 transition-transform duration-300">DNS & IP</span>
              <span className="block mt-2 text-6xl transform hover:translate-x-2 transition-transform duration-300 delay-75">Analyse</span>
              <span className="block mt-2 text-4xl text-black/70 transform hover:translate-x-2 transition-transform duration-300 delay-150">Tools</span>
            </h1>
            
            <p className="text-xl text-black/60 leading-relaxed max-w-xl">
              Professionelle Werkzeuge für umfassende DNS, Blacklist und IP Tests. 
              <span className="block mt-2 font-medium text-black">Kostenlos. Sicher. Ohne Datenspeicherung.</span>
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group bg-black text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-black/90 hover:shadow-xl hover:shadow-black/10">
                <span className="flex items-center">
                  Jetzt Testen
                  <ArrowRight className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
              <button className="px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-black/5">
                Mehr Erfahren
              </button>
            </div>
          </div>

          {/* Right side - Visual elements */}
          <div className="relative hidden lg:block">
            {/* Floating elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-float-slow">
                <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-xs">
                  <Globe className="w-8 h-8 mb-4 text-black" />
                  <div className="h-2 w-24 bg-black/10 rounded mb-2"></div>
                  <div className="h-2 w-32 bg-black/5 rounded"></div>
                </div>
              </div>
              
              <div className="absolute top-2/3 left-1/2 transform -translate-y-1/2 animate-float-slow delay-200">
                <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-xs">
                  <Shield className="w-8 h-8 mb-4 text-black" />
                  <div className="h-2 w-28 bg-black/10 rounded mb-2"></div>
                  <div className="h-2 w-36 bg-black/5 rounded"></div>
                </div>
              </div>

              <div className="absolute top-1/2 right-0 transform translate-x-1/4 animate-float-slow delay-500">
                <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-xs">
                  <Activity className="w-8 h-8 mb-4 text-black" />
                  <div className="h-2 w-20 bg-black/10 rounded mb-2"></div>
                  <div className="h-2 w-24 bg-black/5 rounded"></div>
                </div>
              </div>
            </div>

            {/* Central decorative element */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 border-2 border-black/10 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 border border-black/5 rounded-full animate-spin-slow-reverse"></div>
                <div className="absolute inset-8 border border-black/5 rounded-full animate-spin-slow"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2 transform hover:scale-110 transition-transform duration-300">100+</div>
            <div className="text-black/60">DNS Records analysiert</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2 transform hover:scale-110 transition-transform duration-300">50+</div>
            <div className="text-black/60">Blacklists überprüft</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2 transform hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-black/60">Verfügbarkeit</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
