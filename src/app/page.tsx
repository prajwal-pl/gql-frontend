"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "motion/react";
import {
  LineChart,
  BarChart2,
  PieChart,
  Zap,
  Sparkles,
  Layout,
  BarChart,
  ArrowRight,
  Layers,
  LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define the feature items with icons and descriptions
const features = [
  {
    title: "Interactive Dashboards",
    icon: LineChart,
    description:
      "Visualize data with beautiful, responsive charts and interactive elements.",
  },
  {
    title: "Smooth Animations",
    icon: Zap,
    description:
      "Fluid motion transitions and micro-interactions that delight users.",
  },
  {
    title: "Insightful Analytics",
    icon: BarChart2,
    description:
      "Transform raw data into actionable insights with powerful filtering.",
  },
  {
    title: "Modern Design",
    icon: Layout,
    description: "Clean, responsive interface built with shadcn/ui components.",
  },
  {
    title: "Role-Based Access",
    icon: Layers,
    description:
      "Customized experience for students and teachers with tailored views.",
  },
  {
    title: "Real-time Updates",
    icon: Sparkles,
    description:
      "See changes immediately with optimized data fetching and caching.",
  },
];

// Animated feature card component
const FeatureCard = ({
  title,
  icon: Icon,
  description,
  delay,
}: {
  title: string;
  icon: LucideIcon;
  description: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="border-border/50 h-full overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-neutral-900 dark:to-neutral-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6 pb-2">
          <div className="mb-4 bg-primary/10 p-3 w-12 h-12 flex items-center justify-center rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="pb-6 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="group px-0 hover:bg-transparent"
          >
            Learn more
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function Home() {
  const [hasToken, setHasToken] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token =
      localStorage.getItem("token") || document.cookie.includes("token=");
    setHasToken(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-cyan-50 dark:from-[#06050a] dark:via-black dark:to-[#070a0e]">
      {/* Hero Section with animated gradient */}
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-cyan-500/10 z-0 rounded-full blur-3xl"
          animate={{
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.05, 1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <section className="container relative z-10 mx-auto px-6 py-32 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium"
          >
            Analytics Dashboard Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Beautiful, Interactive Dashboards For Everyone
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl"
          >
            Visualize your data with stunning charts, smooth animations, and
            real-time insights that bring your information to life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href={hasToken ? "/dashboard" : "/register"}>
                {hasToken ? "Go to Dashboard" : "Get Started"}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
            >
              <Link href={hasToken ? "/dashboard" : "/login"}>
                {hasToken ? "View Profile" : "I have an account"}
              </Link>
            </Button>
          </motion.div>

          {/* Animated chart preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 w-full max-w-4xl mx-auto relative"
          >
            <div className="bg-background/80 backdrop-blur-sm border border-border/40 shadow-2xl rounded-xl p-4 md:p-8 overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-neutral-900 dark:to-neutral-800 rounded-md flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-lg px-4">
                    <div className="h-24 bg-background/80 rounded-lg shadow-md flex flex-col justify-center items-center">
                      <PieChart
                        className="h-8 w-8 text-primary mb-1"
                        strokeWidth={1.5}
                      />
                      <div className="h-2 w-16 bg-primary/20 rounded mt-2"></div>
                    </div>
                    <div className="h-24 bg-background/80 rounded-lg shadow-md flex flex-col justify-center items-center">
                      <BarChart
                        className="h-8 w-8 text-primary mb-1"
                        strokeWidth={1.5}
                      />
                      <div className="h-2 w-16 bg-primary/20 rounded mt-2"></div>
                    </div>
                    <div className="col-span-2">
                      <div className="h-32 bg-background/80 rounded-lg shadow-md p-4">
                        <div className="flex justify-between mb-3">
                          <div className="h-2.5 w-20 bg-primary/20 rounded"></div>
                          <div className="h-2.5 w-12 bg-primary/20 rounded"></div>
                        </div>
                        <div className="h-16 flex items-end space-x-2">
                          {[40, 25, 60, 30, 45, 75, 55, 25, 65, 40].map(
                            (h, i) => (
                              <motion.div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t"
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{
                                  delay: 0.8 + i * 0.1,
                                  duration: 0.8,
                                  type: "spring",
                                  stiffness: 100,
                                  damping: 15,
                                }}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 h-12 w-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div
              className="absolute -bottom-4 -left-4 h-16 w-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </motion.div>
        </section>
      </div>

      {/* Features section */}
      <section className="container mx-auto px-6 py-24 bg-gradient-to-b from-transparent via-white/50 to-transparent dark:via-black/50">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="h-1 w-16 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-4"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            Our dashboard platform combines beautiful design with powerful
            functionality
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              icon={feature.icon}
              description={feature.description}
              delay={0.2 + i * 0.1}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-cyan-600 shadow-xl"
        >
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />

          <div className="relative mx-auto max-w-2xl text-center py-16 px-4">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to transform your data experience?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Start visualizing your data with beautiful, interactive dashboards
              today.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-primary"
              >
                <Link href={hasToken ? "/dashboard" : "/register"}>
                  {hasToken ? "Go to Dashboard" : "Get Started"}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Dashboard Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
