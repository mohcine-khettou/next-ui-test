"use client";

import { Card, CardBody, Progress } from "@heroui/react";

interface StatsSectionProps {
  overallCompletion: number;
}

export default function StatsSection({ overallCompletion }: StatsSectionProps) {
  const getBadge = (completion: number) => {
    if (completion >= 90)
      return {
        emoji: "👑",
        title: "Legendary Warrior",
        color: "from-yellow-400 to-orange-400",
      };
    if (completion >= 75)
      return {
        emoji: "⭐",
        title: "Elite Hunter",
        color: "from-purple-400 to-pink-400",
      };
    if (completion >= 50)
      return {
        emoji: "🗡️",
        title: "Skilled Fighter",
        color: "from-blue-400 to-purple-400",
      };
    if (completion >= 25)
      return {
        emoji: "🛡️",
        title: "Novice Warrior",
        color: "from-green-400 to-blue-400",
      };
    return {
      emoji: "🌱",
      title: "Awakening",
      color: "from-gray-400 to-gray-500",
    };
  };

  const getQuote = (completion: number) => {
    const quotes = [
      {
        min: 90,
        text: "You've reached the pinnacle of power. The warrior's path is complete.",
      },
      {
        min: 75,
        text: "Your strength grows with each challenge. Keep pushing forward.",
      },
      {
        min: 50,
        text: "The path to greatness requires persistence. You are on the right track.",
      },
      {
        min: 25,
        text: "Every master was once a beginner. Your journey has just begun.",
      },
      {
        min: 0,
        text: "The first step is always the hardest. Begin your awakening now.",
      },
    ];
    return (
      quotes.find((q) => completion >= q.min)?.text ||
      quotes[quotes.length - 1].text
    );
  };

  const badge = getBadge(overallCompletion);
  const quote = getQuote(overallCompletion);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overall Progress Card */}
      <Card
        className="backdrop-blur-md bg-gradient-to-br from-purple-900/50 to-pink-800/30 border border-purple-500/30"
        shadow="lg"
      >
        <CardBody className="p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Overall Progress
          </h2>
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-purple-200/70 mb-2">
                  Completion Rate
                </p>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {overallCompletion.toFixed(1)}%
                </div>
              </div>
              <div className="text-6xl">{badge.emoji}</div>
            </div>
            <Progress
              value={overallCompletion}
              color="secondary"
              classNames={{
                base: "max-w-full",
                track: "bg-white/10",
                indicator: "bg-gradient-to-r from-purple-500 to-pink-500",
              }}
              size="md"
            />
            <p className="text-xs text-purple-200/50">
              Keep grinding to reach the next level!
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Badge & Quote Card */}
      <Card
        className={`backdrop-blur-md bg-gradient-to-br from-gray-900/60 to-gray-800/40 border-2 border-transparent bg-clip-padding`}
        shadow="lg"
        style={{
          borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1`,
          borderImageSlice: 1,
        }}
      >
        <CardBody className="p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Your Status</h2>
          <div className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl mb-3 drop-shadow-lg`}>
                {badge.emoji}
              </div>
              <h3
                className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${badge.color}`}
              >
                {badge.title}
              </h3>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-center text-purple-200 italic leading-relaxed">
                &quot;{quote}&quot;
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
