// "use client";
// import { motion } from "framer-motion";
// import { Sparkles, Languages, Globe, Mail } from "lucide-react";
// import Image from "next/image";

// const AboutUs = () => {
//   return (
//     <section
//       id="about-us"
//       className="relative py-24 px-6 bg-[#030303] overflow-hidden"
//     >
//       {/* Dynamic Background Elements */}
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] opacity-30" />
//       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] opacity-20" />

//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           {/* Left Column: The Story */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="space-y-8"
//           >
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-primary text-sm font-medium">
//               <Sparkles className="w-4 h-4" />
//               <span>About Us</span>
//             </div>

//             <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter leading-[1.1]">
//               Breaking Barriers with{" "}
//               <span className="text-primary">AI Fluency.</span>
//             </h2>

//             <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
//               <p>
//                 <strong className="text-white">iFluenter</strong> isn't just
//                 another language app. It's a bridge built to close the gap
//                 between learning grammar and actually speaking with confidence.
//                 Born from a passion for technology and communication, we
//                 leverage cutting-edge AI to provide a judgment-free environment
//                 for mastery.
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
//                 <div className="flex gap-3">
//                   <div className="mt-1 bg-primary/20 p-2 rounded-lg">
//                     <Languages className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-sm">
//                     <span className="text-white font-semibold">
//                       Real-time Feedback:
//                     </span>{" "}
//                     Improve your accent instantly with AI analysis.
//                   </p>
//                 </div>
//                 <div className="flex gap-3">
//                   <div className="mt-1 bg-primary/20 p-2 rounded-lg">
//                     <Globe className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-sm">
//                     <span className="text-white font-semibold">
//                       Global Reach:
//                     </span>{" "}
//                     Empowering learners from Yasin to the world.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             className="relative"
//           >
//             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

//             <div className="relative p-8 md:p-12 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden group">
//               <div className="flex flex-col items-center text-center">
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   className="relative w-48 h-48 mb-8"
//                 >
//                   <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
//                   <div className="relative w-full h-full rounded-full border-4 border-primary/30 overflow-hidden shadow-2xl">
//                     <Image
//                       src="/assets/founder.jpg"
//                       fill
//                       alt="Shahwaiz Karim"
//                       className="object-cover"
//                     />
//                   </div>
//                 </motion.div>

//                 <h3 className="text-3xl font-bold text-white mb-2">
//                   Shahwaiz Karim
//                 </h3>
//                 <p className="text-primary font-medium mb-6 uppercase tracking-widest text-sm">
//                   Founder & Developer
//                 </p>

//                 <p className="text-gray-400 leading-relaxed max-w-sm">
//                   "As a developer based in the beautiful valley of{" "}
//                   <span className="text-white">Yasin, Ghizer</span> 🇵🇰, I built
//                   iFluenter to democratize high-quality English education using
//                   the power of Generative AI."
//                 </p>

//                 <div className="flex items-center text-gray-300  justify-center text-right  mt-2  underline  gap-2">
//                   <Mail size={20} />
//                   <p>shahwaix.me@gmail.com</p>
//                 </div>

//                 <div className="mt-8 pt-8 border-t border-white/5 w-full flex justify-center gap-6">
//                   <div className="text-center">
//                     <p className="text-white font-bold text-xl">100%</p>
//                     <p className="text-gray-500 text-xs uppercase tracking-tighter">
//                       Solo Built
//                     </p>
//                   </div>
//                   <div className="w-px h-10 bg-white/10" />
//                   <div className="text-center">
//                     <p className="text-white font-bold text-xl">24/7</p>
//                     <p className="text-gray-500 text-xs uppercase tracking-tighter">
//                       Support
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutUs;

"use client";
import { motion } from "framer-motion";
import { Sparkles, Languages, Globe, Mail, User, Code2 } from "lucide-react";

const Founders = [
  {
    name: "Shahwaiz Karim",
    role: "Founder and Developer",
    icon: <Code2 className="w-6 h-6 text-primary" />,
    email: "shahwaix.me@gmail.com",
  },
  {
    name: "Shafique",
    role: "Co-Founder",
    icon: <User className="w-6 h-6 text-blue-400" />,
    email: "shafiqshafii22@gmail.com", // Placeholder email
  },
];

const AboutUs = () => {
  return (
    <section
      id="about-us"
      className="relative py-24 px-6 bg-[#030303] overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: The Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 lg:sticky lg:top-24"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Our Mission</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter leading-[1.1]">
              Breaking Barriers with{" "}
              <span className="text-primary">AI Fluency.</span>
            </h2>

            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p>
                <strong className="text-white">iFluenter</strong> is a bridge
                built to close the gap between learning grammar and actually
                speaking with confidence. Born in the mountains of Yasin, and
                built for the world, we leverage Generative AI to provide a
                judgment-free environment for mastery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg border border-primary/20">
                    <Languages className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm">
                    <span className="text-white font-semibold block">
                      Real-time Feedback
                    </span>
                    Improve your accent instantly with AI analysis.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-sm">
                    <span className="text-white font-semibold block">
                      Global Reach
                    </span>
                    Empowering learners from Yasin to the world.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Founders */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl"
            >
              <p className="text-gray-300 italic text-lg mb-8 leading-relaxed">
                "As developers based in the beautiful valley of
                <span className="text-white"> Yasin, Ghizer 🇵🇰</span>, we built
                iFluenter to democratize high-quality English education for
                everyone, everywhere."
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Founders.map((founder, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ translateY: -5 }}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all"
                  >
                    <div className="mb-4 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      {founder.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {founder.name}
                    </h3>
                    <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-4">
                      {founder.role}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors">
                      <Mail size={14} />
                      <span className="text-xs truncate">{founder.email}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex justify-around">
                <div className="text-center">
                  <p className="text-white font-bold text-2xl tracking-tight">
                    100%
                  </p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">
                    In-House Built
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-white font-bold text-2xl tracking-tight">
                    24/7
                  </p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">
                    Live Support
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
