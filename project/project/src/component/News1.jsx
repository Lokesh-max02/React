const News1 = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10">

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">

        {/* Hero Image */}
        <img
          src="/Anthropic-Mythos.webp"
          alt="Anthropic AI"
          className="w-full h-[500px] object-cover"
        />

        <div className="p-10">

          <span className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold">
            Technology
          </span>

          <h1 className="text-5xl font-bold mt-5 leading-tight">
            AMD to Sell Anthropic Tens of Billions in AI Servers and Invest up
            to $5 Billion
          </h1>

          <p className="text-gray-500 mt-3">
            July 22, 2026 • 
          </p>

          <hr className="my-8" />

          <div className="grid md:grid-cols-3 gap-8">

            {/* Main Article */}
            <div className="md:col-span-2">

              <p className="text-lg text-gray-700 leading-8 mb-6">
                AMD announced one of its biggest artificial intelligence
                partnerships by agreeing to supply Anthropic with tens of
                billions of dollars worth of AI servers. The agreement also
                includes an investment of up to <b>$5 billion</b> in Anthropic,
                the company behind the Claude AI assistant.
              </p>

              <p className="text-lg text-gray-700 leading-8 mb-6">
                The partnership is expected to strengthen AMD's position in the
                AI chip industry, where Nvidia has long been the market leader.
                By working closely with one of the world's fastest-growing AI
                companies, AMD hopes to expand adoption of its latest Instinct
                MI450 accelerators.
              </p>

              <p className="text-lg text-gray-700 leading-8 mb-6">
                Anthropic plans to deploy up to two gigawatts of AMD computing
                power beginning in 2027. According to AMD executives, one
                gigawatt of AI computing infrastructure can cost tens of
                billions of dollars, making this one of the largest AI hardware
                agreements ever announced.
              </p>

              <p className="text-lg text-gray-700 leading-8 mb-6">
                The company has been aggressively expanding its AI capabilities
                to keep up with growing demand for Claude, its flagship
                conversational AI platform. Access to high-performance GPUs is
                critical for training larger AI models, serving millions of
                users, and competing with OpenAI, Google DeepMind, and Meta.
              </p>

              <p className="text-lg text-gray-700 leading-8 mb-6">
                Analysts believe this partnership could significantly improve
                AMD's market share in AI infrastructure. Every major AI company
                requires enormous computing resources, and securing Anthropic as
                a long-term customer gives AMD an opportunity to compete more
                directly with Nvidia in enterprise AI.
              </p>

              <p className="text-lg text-gray-700 leading-8 mb-6">
                Anthropic has also secured additional computing resources from
                SpaceX's Colossus supercomputer and is reportedly discussing
                further infrastructure partnerships with Meta. These investments
                highlight the increasing demand for AI computing power as
                companies race to build next-generation large language models.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-700 p-6 rounded-lg mt-10">
                <h2 className="text-2xl font-bold mb-3">
                  Key Highlights
                </h2>

                <ul className="list-disc ml-6 space-y-3 text-gray-700">
                  <li>AMD will supply AI servers worth tens of billions of dollars.</li>
                  <li>Investment of up to $5 billion in Anthropic.</li>
                  <li>Anthropic will use AMD's latest Instinct MI450 AI chips.</li>
                  <li>Deployment begins during the first half of 2027.</li>
                  <li>The deal strengthens AMD's competition with Nvidia.</li>
                </ul>
              </div>

            </div>

            {/* Side Panel */}
            <div>

              <div className="bg-gray-50 rounded-lg p-6 shadow">

                <h2 className="text-2xl font-bold mb-4">
                  Quick Facts
                </h2>

                <div className="space-y-4">

                  <div>
                    <p className="font-semibold">Company</p>
                    <p>Advanced Micro Devices (AMD)</p>
                  </div>

                  <div>
                    <p className="font-semibold">Partner</p>
                    <p>Anthropic (Claude AI)</p>
                  </div>

                  <div>
                    <p className="font-semibold">Investment</p>
                    <p>Up to $5 Billion</p>
                  </div>

                  <div>
                    <p className="font-semibold">AI Chips</p>
                    <p>Instinct MI450</p>
                  </div>

                  <div>
                    <p className="font-semibold">Deployment</p>
                    <p>Starts in 2027</p>
                  </div>

                </div>

              </div>

              <div className="bg-yellow-100 rounded-lg p-5 mt-8">

                <h2 className="font-bold text-xl mb-3">
                  Why This Matters
                </h2>

                <p className="text-gray-700 leading-7">
                  AI companies require massive computing power to train and run
                  advanced language models. This agreement gives Anthropic
                  reliable access to AI hardware while helping AMD challenge
                  Nvidia's dominance in the rapidly growing AI chip market.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default News1;