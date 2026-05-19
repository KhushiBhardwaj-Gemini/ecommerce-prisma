import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="
        mx-4
        mt-4
        mb-6
        sm:mx-6
        grid
        max-w-7xl
        grid-cols-1
        overflow-hidden
        rounded-[32px]
        bg-gradient-to-br
        from-amber-50
        via-white
        to-orange-100
        shadow-xl
        lg:grid-cols-2
      "
    >
      {/* LEFT */}
      
      <div
        className="
          flex
          flex-col
          justify-center
          gap-6
          px-5
          py-10
          sm:px-8
          md:px-10
          lg:px-16
        "
      >
         <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <button
            onClick={() => navigate("/products")}
            className="
              rounded-2xl
              bg-slate-900
              px-7
              py-4
              text-sm
              font-semibold
              text-white
              transition
              hover:scale-105
              w:full
              sm:w-auto
            "
          >
            Shop Now
          </button>

          <button
            onClick={() => navigate("/about")}
            className="
              rounded-2xl
              border
              border-slate-300
              bg-white
              px-7
              py-4
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-100
            "
          >
            Explore
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="
              rounded-full
              bg-amber-100
              px-4
              py-2
              text-sm
              font-semibold
              text-amber-700
            "
          >
            Trending Collection 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            max-w-xl
            text-4xl
            font-black
            leading-tight
            tracking-tight
            text-slate-900
            sm:text-5xl
            lg:text-6xl
          "
        >
          Discover Premium Products For Modern Lifestyle.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            max-w-lg
            text-base
            leading-7
            sm:text-lg
            text-slate-600
          "
        >
          Explore curated fashion, electronics, and lifestyle essentials
          designed to elevate your everyday experience.
        </motion.p>

       
      </div>

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="
          relative
          hidden
          min-h-[500px]
          items-center
          justify-center
          overflow-hidden
          lg:flex
        "
      >
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop"
          alt="Fashion Hero"
          className="
            min-h-[320px]
            md:min-h-[450px]
            h-full
            w-full
            object-cover
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            to-transparent
          "
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
