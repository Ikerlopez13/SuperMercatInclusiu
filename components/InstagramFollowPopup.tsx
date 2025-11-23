"use client";

import Image from 'next/image';

interface InstagramFollowPopupProps {
  show: boolean;
  onClose: () => void;
}

export function InstagramFollowPopup({ show, onClose }: InstagramFollowPopupProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            Vaya... Hay un problema
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            ¡Falta un paso para el 10! 🎓
          </p>
        </div>

        {/* Profile Pictures */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 mb-6 sm:mb-8">
          {/* Nicky's profile */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 sm:border-3 border-gray-200 shadow-lg mb-2 sm:mb-3">
              <Image 
                src="/553094335_18293251435254562_2126220637139590472_n.jpg"
                alt="nickysincee"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">@nickysincee</p>
          </div>

          {/* Arrow */}
          <div className="text-2xl sm:text-3xl text-gray-400">
            →
          </div>

          {/* Iker's profile */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 sm:border-3 border-gray-200 shadow-lg mb-2 sm:mb-3">
              <Image 
                src="/515743251_18149518006384306_8468541277712877556_n (1).jpg"
                alt="ikerlopezttp"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">@ikerlopezttp</p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
          <p className="text-center text-gray-800 leading-relaxed text-xs sm:text-sm mb-3">
            Para desbloquear la funcionalidad completa y conseguir el <span className="font-bold text-green-600">10</span> en el trabajo,{' '}
            <span className="font-bold text-gray-900">@nickysincee</span>{' '}
            debe seguir a{' '}
            <span className="font-bold text-gray-900">@ikerlopezttp</span>.
          </p>
          <p className="text-center text-gray-500 text-xs sm:text-sm italic">
            (No soy un friki te lo juro jajaja)
          </p>
        </div>

        {/* Instagram Button */}
        <a
          href="https://www.instagram.com/ikerlopezttp/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Seguir a @ikerlopezttp</span>
          </button>
        </a>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0">
              <Image 
                src="/515743251_18149518006384306_8468541277712877556_n (1).jpg"
                alt="ikerlopezttp"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-left">
              <p className="text-[10px] sm:text-xs text-gray-500">
                Hecho con cariño por{' '}
                <a 
                  href="https://www.instagram.com/ikerlopezttp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-800 hover:text-gray-900 transition"
                >
                  @ikerlopezttp
                </a>
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Para Nicky, Aleth y sus amigas</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

