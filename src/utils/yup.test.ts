import { UrlRegex } from "./yup";

const regexTestCase = [
  {
    url: "https://google.com",
    expected: true
  },
  {
    url: "https://www.google.com",
    expected: true
  },
  {
    url: "http://www.goo-gle.com",
    expected: true
  },
  {
    url: "https://www.google.com?q=3_Sided-cube/test/under_score",
    expected: true
  },
  {
    url: "www.google.com",
    expected: true
  },
  {
    url: "http://www.goo_gle.com",
    expected: false
  },
  {
    url: "https://",
    expected: false
  },
  {
    url: "https:",
    expected: false
  },
  {
    url: "google",
    expected: false
  }
];

describe("Test url regex", () => {
  for (const testCase of regexTestCase) {
    test(`URL regex test ${testCase.expected ? "pass" : "fail"} for ${testCase.url}`, () => {
      expect(new RegExp(UrlRegex).test(testCase.url)).toBe(testCase.expected);
    });
  }
});
