import React from "react";
import image1 from "../assets/img1.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";

const Technology = () => {
  const news = [
    {
      image: image1,
      title:
        "Microsoft is rapidly expanding the use of its in-house AI family of artificial intelligence (AI) models.",
    },
    {
      image: image3,
      title:
        "AMD to invest up to $5 billion in Anthropic; AI startup to buy up to 2 GW of chips.",
    },
    {
      image: image4,
      title:
        "Why voice, not keyboards, may define AI's next chapter. For years, the artificial intelligence race has revolved around one question.",
    },
    {
      image: image5,
      title:
        "Infosys appoints Ashiss Kumar Dash as CEO Designate and strengthens its AI vision.",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        📰 Technology News
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex"
          >
            <img
              src={item.image}
              alt="Technology"
              className="w-56 h-56 object-cover"
            />

            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Technology
              </h2>

              <p className="text-gray-600 leading-7">
                {item.title}
              </p>

              <button className="mt-5 w-fit bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Technology;