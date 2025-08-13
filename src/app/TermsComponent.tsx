"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure we only render the page on the client after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProceed = () => {
    if (isChecked && mounted) {
      // Browser-only APIs used inside an event handler (safe).
      localStorage.setItem("handsTermsAccepted", "true");
      localStorage.setItem("handsTermsAcceptedDate", new Date().toISOString());
      router.push("/news");
    }
  };

  // Always render the same structure, but conditionally show content
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {!mounted ? (
          // Skeleton loader - same structure as main content
          <>
            <div className="text-center">
              <div className="flex gap-2 items-center justify-center mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 sm:h-10 lg:h-12 bg-slate-200 rounded w-32 animate-pulse" />
              </div>
              <div className="h-5 bg-slate-200 rounded w-64 mx-auto animate-pulse" />
            </div>
            <div className="h-96 bg-slate-200 rounded animate-pulse" />
          </>
        ) : (
          // Main content
          <>
            {/* Logo */}
            <div className="text-center">
              <div className="flex gap-2 items-center justify-center mb-2">
                <Image
                  src="/favicon.svg"
                  alt="Hands Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                  priority
                />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
                  Hands
                </h1>
              </div>
              <p className="text-slate-600 text-sm sm:text-base">
                Gesture-Controlled News Experience
              </p>
            </div>

            {/* Terms and Conditions Card */}
            <Card className="bg-white border border-slate-200 shadow-lg">
              <div className="p-4">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-800 text-center">
                  Terms and Conditions
                </h2>

                <div className="max-h-64 overflow-y-auto space-y-4 text-sm sm:text-base text-slate-700 mb-6 pr-2 custom-scrollbar">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Camera Access & Privacy
                    </h3>
                    <p>
                      This application requires access to your device&apos;s
                      camera to detect hand gestures for navigation. Your camera
                      feed is processed locally on your device and is never
                      recorded, stored, or transmitted to our servers. All
                      gesture recognition happens in real-time within your
                      browser.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Data Collection
                    </h3>
                    <p>
                      We collect minimal data necessary for app functionality,
                      including your reading preferences and usage analytics. No
                      personal information from your camera feed is collected or
                      stored. All data is anonymized and used solely to improve
                      the user experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Gesture Recognition Technology
                    </h3>
                    <p>
                      This application uses a safe system for hand gesture
                      detection. This technology operates entirely within your
                      browser for your privacy and security. Gesture data is
                      processed in real-time and immediately discarded after
                      use.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      News Content
                    </h3>
                    <p>
                      News articles are sourced from third-party APIs and news
                      providers. We are not responsible for the accuracy,
                      completeness, or timeliness of news content. All news
                      articles remain the property of their respective
                      publishers.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Device Compatibility
                    </h3>
                    <p>
                      This application requires a device with camera
                      capabilities and a modern web browser. Performance may
                      vary based on device specifications and lighting
                      conditions.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      User Safety
                    </h3>
                    <p>
                      Please use gesture controls in a safe environment. Ensure
                      adequate space around you when using hand gestures. We
                      recommend taking breaks during extended use and being
                      mindful of your surroundings.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Limitation of Liability
                    </h3>
                    <p>
                      This application is provided &quot;as is&quot; without
                      warranties. We are not liable for any damages arising from
                      the use of this application, including but not limited to
                      technical malfunctions or gesture recognition errors.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Updates and Changes
                    </h3>
                    <p>
                      We reserve the right to update these terms and the
                      application features at any time. Continued use of the
                      application constitutes acceptance of any changes to these
                      terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Contact Information
                    </h3>
                    <p>
                      For questions about these terms or the application, please
                      contact us through our official support channels. We are
                      committed to addressing your concerns promptly.
                    </p>
                  </div>
                </div>

                {/* Checkbox and Button Section */}
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-start space-x-3 mb-6">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label
                      htmlFor="terms-checkbox"
                      className="text-sm sm:text-base text-slate-700 leading-relaxed"
                    >
                      I have read, understand and agree to the Terms and
                      Conditions.
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={handleProceed}
                      disabled={!isChecked}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium text-base transition-all duration-200 ${
                        isChecked
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          : "bg-slate-300 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Continue
                    </button>

                    <button
                      onClick={() => router.back()}
                      className="flex-1 sm:flex-none py-3 px-6 rounded-lg font-medium text-base border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Footer */}
            <div className="text-center text-xs sm:text-sm text-slate-500">
              <p>
                By proceeding, you acknowledge that you have read our privacy
                policy and terms of service.
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
