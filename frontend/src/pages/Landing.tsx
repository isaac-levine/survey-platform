import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-900">Cendara</div>
          <div className="flex gap-4 items-center">
            <SignedOut>
              <SignInButton mode="redirect">
                <button className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition shadow-md">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
              >
                Dashboard
              </button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
            Reinventing Tenant Satisfaction: Real Time Insights. Real Results.
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            Cendara delivers the next generation of tenant and occupant surveys —
            customizable, instant, and built for decision-makers.
          </p>
          <p className="text-lg font-medium text-indigo-800 mb-10">
            Experience the Cendara Difference — Request a Demo Today
          </p>
          <SignedOut>
            <div className="flex gap-4 justify-center flex-wrap">
              <SignUpButton mode="redirect">
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition shadow-lg">
                  Request a Demo
                </button>
              </SignUpButton>
              <SignInButton mode="redirect">
                <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 font-semibold transition border-2 border-indigo-600">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition shadow-lg"
            >
              Go to Dashboard
            </button>
          </SignedIn>
        </div>
      </section>

      {/* Why Cendara — Problems */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-indigo-900 mb-10">
            Why Cendara? The Industry's Pain Points
          </h2>
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">
            The Problem with Traditional Tenant Surveys
          </h3>
          <p className="text-gray-700 mb-8">
            For decades, tenant satisfaction surveys have been an annual checkbox —
            long, generic, and disconnected from what truly matters. Owners and Managers have
            struggled with:
          </p>
          <ul className="space-y-4 text-gray-700 mb-10">
            <li>
              <strong>Low Response Rates:</strong> Lengthy, one-size-fits-all surveys
              discourage participation, especially from busy decision-makers.
            </li>
            <li>
              <strong>Delayed Feedback:</strong> Annual or semi-annual cycles mean issues go
              unaddressed for months, leading to missed opportunities and preventable turnover.
            </li>
            <li>
              <strong>Limited Customization:</strong> Most platforms offer rigid templates,
              making it hard to ask the right questions at the right time.
            </li>
            <li>
              <strong>Email Fatigue:</strong> Overreliance on email excludes key voices and
              leads to survey fatigue.
            </li>
            <li>
              <strong>Data Silos:</strong> Survey results are often slow to arrive, hard to
              interpret, and disconnected from actionable recommendations.
            </li>
            <li>
              <strong>Missed Decision-Makers:</strong> Traditional surveys focus on tenant
              representatives, not the true influencers of renewal and satisfaction.
            </li>
          </ul>
          <h3 className="text-xl font-semibold text-indigo-800 mb-3">The Result</h3>
          <p className="text-gray-700 font-medium italic">
            Tenant feedback becomes a burden, not a strategic asset. Renewal rates stagnate,
            operational blind spots persist, and asset value suffers.
          </p>
        </div>
      </section>

      {/* The Cendara Solution */}
      <section className="py-20 px-6 bg-indigo-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-indigo-900 mb-10">
            The Cendara Solution: A New Era of Tenant Engagement
          </h2>
          <h3 className="text-xl font-semibold text-indigo-800 mb-6">
            What Makes Cendara Different?
          </h3>
          <p className="text-gray-700 mb-6">
            Cendara was founded by asset and property managers with a singular focus: helping
            owners and operators unlock hidden value in their assets.
          </p>
          <p className="text-gray-700 mb-6">
            We believe customer insight should be a strategic advantage — not a box-checking
            exercise.
          </p>
          <p className="text-gray-700 mb-12">
            That's why Cendara transforms tenant feedback into clear, actionable strategies
            that drive NOI growth, inform asset-level decision-making, and support long-term
            portfolio value — far beyond what legacy survey providers were ever built to deliver.
          </p>

          {/* Decision-Maker Focus */}
          <div className="mb-14">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">Decision-Maker Focus</h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Beyond Tenant Reps:</strong> We engage the decision-makers —
                executives, business owners, and key stakeholders — so insights reflect the
                factors that influence renewals, retention, and long-term asset performance.
              </li>
              <li>
                <strong>Multi-Audience Reach:</strong> Survey not just tenants, but visitors,
                occupants, and even prospective clients for a 360° view.
              </li>
            </ul>
          </div>

          {/* Short, Targeted Surveys */}
          <div className="mb-14">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">Short, Targeted Surveys</h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Concise and Impactful:</strong> Surveys are designed to be completed in
                minutes, with questions prioritized for maximum relevance and actionability.
              </li>
              <li>
                <strong>Smart Question Logic:</strong> Dynamic branching ensures respondents
                only see what matters to them, boosting completion rates and data quality.
              </li>
            </ul>
          </div>

          {/* Real-Time, Instantaneous Feedback */}
          <div className="mb-14">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">
              Real-Time, Instantaneous Feedback
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Immediate Surveys:</strong> Trigger feedback requests after key events —
                maintenance, move-in, snow removal, or amenity upgrades — capturing sentiment
                when it's most accurate.
              </li>
              <li>
                <strong>Continuous Pulse:</strong> Move beyond annual cycles to ongoing
                engagement, so you can spot trends and act before issues escalate.
              </li>
            </ul>
          </div>

          {/* Multi-Channel Delivery */}
          <div className="mb-14">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">Multi-Channel Delivery</h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Beyond Email:</strong> Reach tenants via SMS, QR codes, in-app
                notifications, web links, and even on-site kiosks. Meet your audience where they
                are, not just in their inbox.
              </li>
              <li>
                <strong>Mobile-First Design:</strong> Surveys are optimized for smartphones and
                tablets, ensuring high response rates and accessibility.
              </li>
            </ul>
          </div>

          {/* Unmatched Customization */}
          <div className="mb-14">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">Unmatched Customization</h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Robust Templates:</strong> Start with proven question sets or build your
                own from scratch. Mix and match surveys to fit your property, audience, and goals.
              </li>
              <li>
                <strong>Built-In Flexibility:</strong> The platform empowers customers to
                configure surveys, manage workflows, and monitor results on their own terms —
                without vendor bottlenecks.
              </li>
              <li>
                <strong>Branding and Localization:</strong> Customize surveys with your logo,
                colors, and language preferences for a seamless tenant experience.
              </li>
            </ul>
          </div>

          {/* Actionable, Real-Time Reporting */}
          <div className="mb-14">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">
              Actionable, Real-Time Reporting
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Live Dashboards:</strong> Instantly visualize results as they come in,
                with role-based dashboards for property managers, asset owners, and executives.
              </li>
              <li>
                <strong>Automated Recommendations:</strong> Our analytics engine translates
                feedback into clear, prioritized action items — no more guesswork.
              </li>
              <li>
                <strong>Alerts and Triggers:</strong> Get notified of urgent issues or
                satisfaction drops, enabling proactive intervention.
              </li>
            </ul>
          </div>

          {/* Benchmarking and KPIs */}
          <div className="mb-14">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">Benchmarking and KPIs</h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>National, Local, and Portfolio Benchmarks:</strong> Compare your
                performance against industry standards and your own properties.
              </li>
              <li>
                <strong>Key Metrics Tracked:</strong> Occupancy, renewal rates, Net Promoter
                Score (NPS), maintenance response times, and more.
              </li>
            </ul>
          </div>

          {/* Robust Data Analytics */}
          <div className="mb-14">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">Robust Data Analytics</h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Slice and Dice:</strong> Filter results by building, floor, unit type,
                demographic, or custom tags.
              </li>
              <li>
                <strong>Text Analytics:</strong> AI-powered sentiment analysis uncovers hidden
                themes in open-ended responses.
              </li>
              <li>
                <strong>Export and Integrate:</strong> Seamlessly export data or integrate with
                your property management system for deeper analysis.
              </li>
            </ul>
          </div>

          {/* Built by Real Estate Leaders */}
          <div>
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">
              Built by Real Estate Leaders — For Real Estate Leaders
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Industry Expertise:</strong> Our founders have managed portfolios across
                CRE and multifamily, ensuring every feature solves real operational challenges.
              </li>
              <li>
                <strong>Client Success:</strong> Dedicated onboarding and support teams guide you
                from setup to ongoing optimization.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Schedule a Demo / Connect */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">
            Schedule a Demo or Connect with Cendara
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Connect with Cendara
          </p>
          <p className="text-gray-700 mb-10">
            Experience the Cendara Difference — Request a Demo Today
          </p>
          <SignedOut>
            <SignUpButton mode="redirect">
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition shadow-lg">
                Request a Demo
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </section>

      {/* Connect With Us */}
      <section className="py-12 px-6 bg-indigo-50/50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">Connect With Us</h2>
          <SignedOut>
            <SignUpButton mode="redirect">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition">
                Get in Touch
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-200 text-center text-gray-600 text-sm">
        <p>Copyright © 2026 Cendara, LLC — All Rights Reserved.</p>
      </footer>
    </div>
  )
}
