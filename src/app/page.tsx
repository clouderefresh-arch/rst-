import { About } from "@/components/About";
import { Advantages } from "@/components/Advantages";
import { Fleet } from "@/components/Fleet";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Parts } from "@/components/Parts";
import { Services } from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Parts />
        <Advantages />
        <Fleet />
        <About />
      </main>
      <Footer />
    </>
  );
}
