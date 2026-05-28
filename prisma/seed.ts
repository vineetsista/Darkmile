import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Darkmile database...");

  // Demo user
  const password = await bcrypt.hash("demo1234", 12);
  const user = await db.user.upsert({
    where: { email: "marcus@webbcommercial.com" },
    update: {},
    create: {
      email: "marcus@webbcommercial.com",
      name: "Marcus Webb",
      firm: "Webb Commercial Realty",
      role: "Broker",
      passwordHash: password,
      preferences: {
        create: {
          counties: ["Franklin County"],
          propertyTypes: ["Office", "Industrial", "Retail", "Multifamily"],
          dealSizeRanges: ["$1M–$5M", "$5M–$20M"],
          briefingTime: "07:00",
          briefingFormat: "detailed",
          emailEnabled: true,
          onboardingDone: true,
        },
      },
    },
  });

  console.log(`Created user: ${user.email}`);

  // Properties
  const propertyData = [
    { address: "1100 Polaris Pkwy", city: "Columbus", state: "OH", zip: "43240", county: "Franklin County", propertyType: "Office", squareFeet: 42000, yearBuilt: 2001, assessedValue: 4200000, lastSalePrice: 5100000, lastSaleDate: new Date("2019-03-15"), ownerName: "Polaris Office Partners LLC", ownerType: "LLC", latitude: 40.1523, longitude: -82.9888 },
    { address: "3100 Rickenbacker Pkwy", city: "Columbus", state: "OH", zip: "43217", county: "Franklin County", propertyType: "Industrial", squareFeet: 185000, yearBuilt: 1998, assessedValue: 8900000, lastSalePrice: 10200000, lastSaleDate: new Date("2021-06-02"), ownerName: "Rickenbacker Logistics Group", ownerType: "LLC", latitude: 39.8921, longitude: -82.9244 },
    { address: "8100 Sawmill Rd", city: "Dublin", state: "OH", zip: "43016", county: "Franklin County", propertyType: "Retail", squareFeet: 28000, yearBuilt: 1995, assessedValue: 3100000, lastSalePrice: 3800000, lastSaleDate: new Date("2018-09-20"), ownerName: "Robert & Linda Ashford", ownerType: "Individual", latitude: 40.0987, longitude: -83.1023 },
    { address: "4000 Easton Way", city: "Columbus", state: "OH", zip: "43219", county: "Franklin County", propertyType: "Mixed-Use", squareFeet: 67000, yearBuilt: 2008, assessedValue: 12400000, lastSalePrice: 15600000, lastSaleDate: new Date("2022-01-10"), ownerName: "Easton Town Center LLC", ownerType: "LLC", latitude: 40.0521, longitude: -82.8876 },
    { address: "500 Riverside Dr", city: "Columbus", state: "OH", zip: "43215", county: "Franklin County", propertyType: "Office", squareFeet: 54000, yearBuilt: 1987, assessedValue: 5800000, lastSalePrice: 7200000, lastSaleDate: new Date("2020-11-05"), ownerName: "Capital City Properties Trust", ownerType: "Trust", latitude: 39.9762, longitude: -83.0098 },
  ];

  const properties = [];
  for (const p of propertyData) {
    const prop = await db.property.upsert({
      where: { id: `seed_${p.address.replace(/\s/g, "_")}` },
      update: {},
      create: { id: `seed_${p.address.replace(/\s/g, "_")}`, ...p },
    });
    properties.push(prop);
  }

  console.log(`Created ${properties.length} properties`);

  // Transactions
  await db.transaction.createMany({
    skipDuplicates: true,
    data: [
      { id: "seed_txn_1", propertyId: properties[0].id, transactionType: "sale", price: 5100000, pricePerSF: 121.43, buyer: "NorthPoint Development LLC", seller: "Polaris Holdings Inc", recordedDate: new Date("2025-05-12"), aiInsight: "Institutional buyer expanding Columbus office portfolio — signals market confidence in suburban office recovery." },
      { id: "seed_txn_2", propertyId: properties[1].id, transactionType: "sale", price: 10200000, pricePerSF: 55.14, buyer: "Rickenbacker Holdings LLC", seller: "Franklin Industrial Trust", recordedDate: new Date("2025-05-10"), aiInsight: "Industrial asset near Rickenbacker airport trades at premium — last-mile logistics demand driving cap rate compression." },
      { id: "seed_txn_3", propertyId: properties[2].id, transactionType: "sale", price: 3800000, pricePerSF: 135.71, buyer: "Midwest Retail Ventures", seller: "Robert & Linda Ashford", recordedDate: new Date("2025-05-08"), aiInsight: "Individual seller disposition — estate planning signal. Adjacent retail pad may be next to market." },
    ],
  });

  // Permits
  await db.permit.createMany({
    skipDuplicates: true,
    data: [
      { id: "seed_permit_1", propertyId: properties[3].id, permitType: "renovation", estimatedValue: 2400000, applicant: "Easton Town Center LLC", description: "Interior renovation and tenant improvement — anchor space reconfiguration for mixed retail/office", filingDate: new Date("2025-05-11"), status: "approved" },
      { id: "seed_permit_2", propertyId: properties[4].id, permitType: "new_construction", estimatedValue: 8500000, applicant: "Capitol Square Development", description: "New 6-story mixed-use building — ground floor retail, upper residential", filingDate: new Date("2025-05-09"), status: "pending" },
    ],
  });

  // Opportunities
  await db.opportunity.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "seed_opp_1",
        propertyId: properties[2].id,
        score: 91,
        narrative: "Individual owners (Robert & Linda Ashford) have held this asset 27 years with deferred maintenance signals from recent permit filings. Estate disposition pattern detected — high probability of off-market receptivity.",
        factors: [
          { label: "Long Hold Period", weight: 35, description: "27-year ownership by individuals — statistically high disposition probability" },
          { label: "Deferred Maintenance", weight: 30, description: "Recent minor repair permits suggest owner is not investing for long-term hold" },
          { label: "Market Timing", weight: 20, description: "Retail corridor experiencing renewed institutional interest" },
          { label: "Owner Type", weight: 15, description: "Individual owners more receptive to direct broker outreach than institutional" },
        ] as object,
        estimatedValue: 4200000,
        recommendedAction: "Immediate outreach to owners recommended — prepare comparable sale analysis for Sawmill corridor",
        expiresAt: new Date("2025-06-14"),
      },
      {
        id: "seed_opp_2",
        propertyId: properties[0].id,
        score: 78,
        narrative: "Recent sale to NorthPoint Development indicates active buyer in market. Watch for portfolio consolidation or adjacent dispositions.",
        factors: [
          { label: "Institutional Activity", weight: 40, description: "NorthPoint acquired this asset — likely consolidating suburban office holdings" },
          { label: "Market Momentum", weight: 35, description: "Polaris corridor seeing increased transaction velocity" },
          { label: "Cap Rate Environment", weight: 25, description: "Office cap rate compression creating favorable seller conditions" },
        ] as object,
        estimatedValue: 5800000,
        recommendedAction: "Monitor for adjacent listing opportunities — connect with NorthPoint acquisition team",
        expiresAt: new Date("2025-07-01"),
      },
    ],
  });

  // Watchlist entry for demo user
  await db.watchlist.upsert({
    where: { userId_propertyId: { userId: user.id, propertyId: properties[2].id } },
    update: {},
    create: {
      userId: user.id,
      propertyId: properties[2].id,
      triggers: ["ownership_change", "permit", "comparable_sale"],
      notes: "Estate disposition play — approach owners Q3 2025",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
