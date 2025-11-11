import CreatorApplicationForm from "../../components/CreatorApplicationForm";
import Footer from "../../components/layout/footer";
import Header from "../../components/layout/header";
import LandingPage from "../Landing/LandingPage";

 
export default function JoinAsCreatorPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
        <Header></Header>
      {/* Hero */} 
      <LandingPage></LandingPage>
      <section className="w-full text-center py-16">
        <h1 className="text-4xl font-bold text-yellow-600">
          Join As A Creator
        </h1>
        <p className="mt-4 text-gray-600">
          Become part of the Expedify community.
        </p>
      </section>

      {/* Form */}
      <CreatorApplicationForm />
      <Footer></Footer>
    </main>
  );
}
