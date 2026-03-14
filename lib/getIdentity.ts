// lib/getIdentity.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper function to generate random username
function generateUsername(): string {
  const adjectives = [
    // Positive emotions
    "Happy",
    "Joyful",
    "Cheerful",
    "Peaceful",
    "Serene",
    "Calm",
    "Bright",
    "Radiant",
    "Gleeful",
    "Blissful",
    "Content",
    "Merry",
    "Delighted",

    // Personality traits
    "Brave",
    "Bold",
    "Gentle",
    "Kind",
    "Wise",
    "Noble",
    "Clever",
    "Swift",
    "Fierce",
    "Loyal",
    "Honest",
    "True",
    "Free",
    "Wild",
    "Mystic",
    "Silent",
    "Strong",
    "Humble",
    "Graceful",
    "Playful",
    "Curious",
    "Daring",
    "Witty",

    // Nature-inspired
    "Golden",
    "Silver",
    "Crystal",
    "Misty",
    "Starry",
    "Twilight",
    "Dawn",
    "Lunar",
    "Solar",
    "Cosmic",
    "Arctic",
    "Forest",
    "Ocean",
    "Mountain",
    "River",
    "Thunder",
    "Storm",
    "Cloud",
    "Sky",
    "Shadow",
    "Light",
  ];

  const nouns = [
    // Common animals
    "Panda",
    "Eagle",
    "Dolphin",
    "Tiger",
    "Fox",
    "Bear",
    "Wolf",
    "Lion",
    "Hawk",
    "Raven",
    "Owl",
    "Falcon",
    "Dragon",
    "Phoenix",
    "Unicorn",

    // Marine life
    "Whale",
    "Shark",
    "Orca",
    "Seal",
    "Otter",
    "Penguin",
    "Turtle",

    // Wild animals
    "Lynx",
    "Jaguar",
    "Panther",
    "Leopard",
    "Cheetah",
    "Cougar",
    "Deer",
    "Elk",
    "Moose",
    "Bison",
    "Buffalo",
    "Rhino",
    "Elephant",

    // Birds
    "Swan",
    "Crane",
    "Heron",
    "Pelican",
    "Albatross",
    "Condor",

    // Mythical/Cool
    "Griffin",
    "Pegasus",
    "Sphinx",
    "Chimera",
    "Hydra",
    "Kraken",

    // Small creatures
    "Rabbit",
    "Squirrel",
    "Hedgehog",
    "Raccoon",
    "Badger",
    "Ferret",
  ];

  // Generate 4-digit random number for more uniqueness
  const random = Math.floor(Math.random() * 10000);

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj}${noun}${random}`;
}

// Enhanced avatar generator with more emojis
function generateAvatarKey(): string {
 const avatars = ["panda", "capybara", "bear", "owl", "turtle"];
  return avatars[Math.floor(Math.random() * avatars.length)];
}


export async function getIdentity() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      console.log("❌ No valid session found");
      return null;
    }

    const userId = session.user.id;
  

    // Check if user already has an AnonymousIdentity
    let identity = await prisma.anonymousIdentity.findUnique({
      where: { userId },
    });

    // If not, create one
    if (!identity) {
      console.log("🔧 Creating new AnonymousIdentity for user");

      let username = generateUsername();
      let attempts = 0;
      const maxAttempts = 10;

      // Ensure username is unique
      while (attempts < maxAttempts) {
        const existing = await prisma.anonymousIdentity.findUnique({
          where: { username },
        });

        if (!existing) break;

        username = generateUsername();
        attempts++;
      }

      identity = await prisma.anonymousIdentity.create({
        data: {
          userId,
          username,
          avatarKey: generateAvatarKey(),
        },
      });

      console.log("✅ Created AnonymousIdentity:", identity.id);
    }

    return {
      id: identity.id,
      username: identity.username,
      avatarKey: identity.avatarKey,
      userId: identity.userId,
    };
  } catch (error) {
    console.error("❌ getIdentity error:", error);
    return null;
  }
}
