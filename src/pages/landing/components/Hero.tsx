import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Factory,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../../assets";
import { Button } from "../../../common/ui/button";

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const statsVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 1.2,
      },
    },
  };

  return (
    <motion.div
      className="py-12 sm:py-16 lg:py-20 pt-16 mt-[72px] relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] xl:min-h-[85vh] overflow-hidden"
      id="home"
      style={{
        backgroundImage: `url(${IMAGES.heroRectangle})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-16 sm:top-20 right-2 sm:right-4 lg:right-10 text-cyan-300 opacity-20 hidden sm:block"
        variants={floatingVariants}
        animate="animate"
      >
        <Factory className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20" />
      </motion.div>
      <motion.div
        className="absolute top-32 sm:top-40 left-2 sm:left-4 lg:left-10 text-cyan-300 opacity-15 hidden sm:block"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Building2 className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 sm:bottom-40 right-2 sm:right-4 lg:right-20 text-cyan-500 opacity-10 hidden sm:block"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Users className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-18 xl:h-18" />
      </motion.div>

      <div className="flex flex-col space-y-4 sm:space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex justify-center mb-4 sm:mb-6 lg:mb-8"
          variants={fadeInVariants}
        >
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full inline-flex items-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <TrendingUp className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">
              Revolutionizing Supply Chain Management
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-center mb-3 sm:mb-4 lg:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-600 leading-tight px-2"
          variants={fadeInVariants}
        >
          Empowering Ethiopia's Supply
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Chain Ecosystem
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground text-center max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12 leading-relaxed px-2"
          variants={fadeInVariants}
        >
          Connect institutions, manufacturers, agents, and consumers in a
          unified platform.
          <br className="hidden sm:block" />
          Streamline operations, manage inventory, and facilitate seamless
          transactions
          <br className="hidden lg:block" />
          across Ethiopia's cooperative union network.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-12 px-2"
          variants={fadeInVariants}
        >
          <Button
            variant="ghost"
            className="flex items-center justify-center space-x-2 h-10 sm:h-11 lg:h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 hover:bg-cyan-400/90 hover:text-white text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group w-full sm:w-auto"
            onClick={() => navigate("/register")}
          >
            <span>Join Our Network</span>
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform duration-300 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
            />
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-10 sm:h-11 lg:h-12 border-2 border-cyan-600 text-cyan-600 hover:text-cyan-600 hover:bg-cyan-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            onClick={() =>
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>Explore Features</span>
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto px-4"
          variants={statsVariants}
        >
          {[
            { label: "Institutions", value: "500+", icon: Building2 },
            { label: "Manufacturers", value: "200+", icon: Factory },
            { label: "Active Agents", value: "1,000+", icon: Users },
            { label: "Consumers", value: "10,000+", icon: TrendingUp },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.1 }}
              >
                <IconComponent
                  className="mx-auto mb-1 sm:mb-2 text-cyan-600 w-5 h-5 sm:w-6 sm:h-6"
                />
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
