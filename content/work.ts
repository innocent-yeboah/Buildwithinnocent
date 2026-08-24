export type WorkItem = {
  slug: string;
  title: string;
  href: string;
  still: string;
  alt: string;
  summary: string;
  caption: string;
  isStartingSystem: boolean;
};

export const WORK: WorkItem[] = [
  {
    slug: "benizer-green-shop",
    title: "Benizer Green Shop",
    href: "https://benizergreenshop.com",
    still: "/work/benizer.jpg",
    alt: "Benizer Green Shop homepage with product hero, shop navigation, and Ghana delivery notes",
    summary:
      "A live shop for an Accra wellness brand — products on the web, orders in one place, customers able to find what they need without a stall or a Facebook post.",
    caption:
      "A shop on the web — this is the kind of system the starting build is for.",
    isStartingSystem: true,
  },
  {
    slug: "schoolledger-gh",
    title: "SchoolLedger GH",
    href: "https://schoolledgergh.vercel.app/",
    still: "/work/schoolledger.jpg",
    alt: "SchoolLedger GH sign-in screen for Ghana private schools",
    summary:
      "A school operating system — fees, records, and staff login. Larger than the Ghana starting build, and not what that price buys.",
    caption:
      "A larger school system — not the Ghana GHS 3,500 starting build. I am not taking new school projects on this site.",
    isStartingSystem: false,
  },
];
