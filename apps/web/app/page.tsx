import ChatInterface from '../components/ChatInterface';

const HomePage = () => (
  <section aria-labelledby="hero-title" className="home-section">
    <div className="hero">
      <h1 id="hero-title">Viber · Gemini Agent Workbench</h1>
      <p>
        Experiment with Google Gemini through a Next.js, Geist-designed workbench. Stream responses, attach code context, and follow prompt-engineering best practices.
      </p>
    </div>
    <ChatInterface />
    <style jsx>{`
      .home-section {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        padding: 2rem 0 4rem;
      }

      .hero {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 720px;
      }

      .hero h1 {
        font-size: 2.5rem;
        line-height: 1.2;
      }

      @media (max-width: 768px) {
        .home-section {
          padding: 1.5rem 0 3rem;
        }

        .hero h1 {
          font-size: 2rem;
        }
      }
    `}</style>
  </section>
);

export default HomePage;
